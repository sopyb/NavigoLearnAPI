import EnvVars from '@src/constants/EnvVars';
import { createPool, Pool } from 'mariadb';
import fs from 'fs';
import path from 'path';
import logger from 'jet-logger';
import { User } from '@src/types/models/User';
import { GenericModelClass } from '@src/types/models/GenericModelClass';

// database credentials
const { DBCred } = EnvVars;

const trustedColumns = [
  // id columns
  'id',
  'roadmapId',
  'userId',
  'issueId',
  // followers
  'followerId',

  // generic
  'name',
  'data',

  // time
  'createdAt',
  'updatedAt',

  // user
  'avatar',
  'email',
  'role',
  'pwdHash',
  'googleId',
  'githubId',

  // userInfo
  'bio',
  'quote',
  'websiteUrl',
  'githubUrl',

  // roadmap
  'description',
  'isPublic',
  'isDraft',

  // roadmapLikes
  'value',

  // roadmapViews
  'full',

  // roadmapIssues & comments
  'open',
  'title',
  'content',

  // session
  'token',
  'expires',
];

// data interface
interface Data {
  keys: string[];
  values: unknown[];
}

type DataType = bigint | string | number | Date | null;

// config interface
export interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  database: string;
}

// database results interface
interface RowDataPacket {
  [columnName: string]: unknown;
}

interface CountDataPacket extends RowDataPacket {
  'COUNT(*)': bigint;
}

interface CountQueryPacket extends RowDataPacket {
  result: bigint;
}

export interface ResultSetHeader {
  fieldCount: number;
  affectedRows: number;
  insertId: number;
  info: string;
  serverStatus: number;
  warningStatus: number;
}

function processData(
  data: object | Record<string, DataType>,
  discardId = true,
): Data {
  const dataObj = data as GenericModelClass;

  // check if data is a GenericModelClass
  if (
    typeof dataObj === 'object' &&
    dataObj !== null &&
    'toObject' in dataObj &&
    typeof dataObj.toObject === 'function'
  ) {
    data = dataObj.toObject();
  }

  // get keys and values
  const keys = Object.keys(data);
  const values = Object.values(data) as unknown[];

  // remove id from keys and values
  const idIndex = keys.indexOf('id');
  if (idIndex > -1 && discardId) {
    keys.splice(idIndex, 1);
    values.splice(idIndex, 1);
  }

  // check if values are trusted
  if (keys.every((key) => !trustedColumns.includes(key)))
    throw new Error('Untrusted data: ' + keys.join(', '));

  return { keys, values };
}

function parseResult(
  result: RowDataPacket[] | ResultSetHeader,
): RowDataPacket[] | null {
  if (result && Object.keys(result).length > 0) {
    const keys = Object.keys((result as RowDataPacket[])[0]);
    for (const element of keys) {
      const key = element;
      const value: unknown = (result as RowDataPacket[])[0][key];
      if (typeof value === 'string' && value.startsWith('JSON-')) {
        (result as RowDataPacket[])[0][key] = JSON.parse(
          value.replace('JSON-', ''),
        );
      }
    }
  }

  return result as RowDataPacket[];
}

function getFirstResult<T>(
  result: RowDataPacket[] | ResultSetHeader,
): T | null {
  return (parseResult(result)?.[0] as T) || null;
}

class Database {
  protected static pool: Pool;
  protected static isSetup = false;

  public constructor(config: DatabaseConfig = DBCred as DatabaseConfig) {
    if (!Database.pool) this.initialize(config);
  }

  public initialize(config: DatabaseConfig = DBCred as DatabaseConfig) {
    Database.pool = createPool(config);
    this._setup();
  }

  public async insert(
    table: string,
    data: object | Record<string, DataType>,
    discardId = true,
  ): Promise<bigint> {
    const { keys, values } = processData(data, discardId);

    // create sql query - insert into table (keys) values (values)
    // ? for values to be replaced by params
    const sql = `INSERT INTO ${table} (${keys.join(',')})
                 VALUES (${values.map(() => '?').join(',')})`;
    // execute query
    const result = (await this._query(sql, values)) as ResultSetHeader;

    // return insert id
    let insertId = -1n;
    if (result) {
      insertId = BigInt(result.insertId);
    }
    return insertId;
  }

  public async update(
    table: string,
    id: bigint,
    data: object | Record<string, DataType>,
    discardId = true,
  ): Promise<boolean> {
    const { keys, values } = processData(data, discardId);

    // create sql query - update table set key = ?, key = ? where id = ?
    // ? for values to be replaced by params
    const sqlKeys = keys.map((key) => `${key} = ?`).join(',');
    const sql = `UPDATE ${table}
                 SET ${sqlKeys}
                 WHERE id = ?`;
    const params = [...values, id];
    // execute query
    const result = (await this._query(sql, params)) as ResultSetHeader;

    let affectedRows = -1;
    if (result) {
      affectedRows = result.affectedRows || -1;
    }

    // return true if affected rows > 0 else false
    return affectedRows > 0;
  }

  public async updateWhere(
    table: string,
    data: object | Record<string, DataType>,
    ...values: unknown[]
  ): Promise<boolean> {
    const { keys, values: dataValues } = processData(data);

    const queryBuilderResult = this._buildWhereQuery(false, ...values);
    if (!queryBuilderResult) return false;

    // create sql query - update table set key = ?, key = ? where id = ?
    // ? for values to be replaced by params
    const sqlKeys = keys.map((key) => `${key} = ?`).join(',');
    const sql = `UPDATE ${table}
                 SET ${sqlKeys}
                 WHERE ${queryBuilderResult.keyString}`;
    const params = [...dataValues, ...queryBuilderResult.params];

    // execute query
    const result = (await this._query(sql, params)) as ResultSetHeader;

    let affectedRows = -1;
    if (result) {
      affectedRows = result.affectedRows || -1;
    }

    // return true if affected rows > 0 else false
    return affectedRows > 0;
  }

  public async delete(table: string, id: bigint): Promise<boolean> {
    const sql = `DELETE
                 FROM ${table}
                 WHERE id = ?`;
    const result = (await this._query(sql, [id])) as ResultSetHeader;

    // return true if affected rows > 0 else false
    return result.affectedRows > 0;
  }

  public async deleteWhere(
    table: string,
    ...values: unknown[]
  ): Promise<boolean> {
    const queryBuilderResult = this._buildWhereQuery(false, ...values);
    if (!queryBuilderResult) return false;

    const sql = `DELETE
                 FROM ${table}
                 WHERE ${queryBuilderResult.keyString}`;
    const result = (await this._query(
      sql,
      queryBuilderResult.params,
    )) as ResultSetHeader;

    return result.affectedRows > 0;
  }

  private _buildWhereQuery = (
    like: boolean,
    ...values: unknown[]
  ): { keyString: string; params: unknown[] } | null => {
    let keyString = '';
    let params: unknown[] = [];

    for (let i = 0; i < values.length - 1; i += 2) {
      const key = values[i] as string;

      if (Array.isArray(values[i + 1])) {
        const arrayParams = values[i + 1] as unknown[];
        if ((values[i + 1] as unknown[]).length === 0) continue;
        const subKeyString = arrayParams
          .map(() => `${key} ${like ? 'LIKE' : '='} ?`)
          .join(' OR ');
        keyString += i > 0 ? ' AND ' : '';
        keyString += `(${subKeyString})`;
        params = [...params, ...arrayParams];
      } else {
        if (i > 0) keyString += ' AND ';
        keyString += `${key} ${like ? 'LIKE' : '='} ?`;
        params = [...params, values[i + 1]];
      }
    }

    return { keyString, params };
  };

  public async getQuery(
    sql: string,
    params?: unknown[],
  ): Promise<RowDataPacket[] | null> {
    const result = await this._query(sql, params);
    return parseResult(result);
  }

  public async get<T>(table: string, id: bigint): Promise<T | null> {
    // create sql query - select * from table where id = ?
    const sql = `SELECT *
                 FROM ${table}
                 WHERE id = ?`;
    // execute query
    const result = await this._query(sql, [id]);

    // check if T has any properties that are JSON
    // if so parse them
    return getFirstResult<T>(result);
  }

  public async getWhere<T>(
    table: string,
    ...values: unknown[]
  ): Promise<T | null> {
    return this._getWhere<T>(table, false, ...values);
  }

  public async getWhereLike<T>(
    table: string,
    ...values: unknown[]
  ): Promise<T | null> {
    return this._getWhere<T>(table, true, ...values);
  }

  protected async _getWhere<T>(
    table: string,
    like: boolean,
    ...values: unknown[]
  ): Promise<T | null> {
    const queryBuilderResult = this._buildWhereQuery(like, ...values);
    if (!queryBuilderResult) return null;

    const sql = `SELECT *
                 FROM ${table}
                 WHERE ${queryBuilderResult.keyString}`;
    const result = await this._query(sql, queryBuilderResult.params);

    return getFirstResult<T>(result);
  }

  public async getAll<T>(table: string): Promise<T[] | null> {
    // create sql query - select * from table
    const sql = `SELECT *
                 FROM ${table}`;

    // execute query
    const result = await this._query(sql);

    // check if T has any properties that are JSON
    // if so parse them
    return parseResult(result) as T[] | null;
  }

  public async getAllWhere<T>(
    table: string,
    ...values: unknown[]
  ): Promise<T[] | null> {
    return this._getAllWhere<T>(table, false, ...values);
  }

  public async getAllWhereLike<T>(
    table: string,
    ...values: unknown[]
  ): Promise<T[] | null> {
    return this._getAllWhere<T>(table, true, ...values);
  }

  protected async _getAllWhere<T>(
    table: string,
    like: boolean,
    ...values: unknown[]
  ): Promise<T[] | null> {
    const queryBuilderResult = this._buildWhereQuery(like, ...values);
    if (!queryBuilderResult) return null;

    const sql = `SELECT *
                 FROM ${table}
                 WHERE ${queryBuilderResult.keyString}`;
    const result = await this._query(sql, queryBuilderResult.params);

    return parseResult(result) as T[] | null;
  }

  public async sum(table: string, column: string): Promise<bigint> {
    const sql = `SELECT SUM(${column})
                 FROM ${table}`;
    const result = await this._query(sql);

    return (result as CountDataPacket[])[0][`SUM(${column})`] as bigint || 0n;
  }

  public async sumQuery(sql: string, params?: unknown[]): Promise<bigint> {
    const result = await this._query(sql, params);
    return (result as CountQueryPacket[])[0]['result'] || 0n;
  }

  public async sumWhere(
    table: string,
    column: string,
    ...values: unknown[]
  ): Promise<bigint> {
    return await this._sumWhere(table, column, false, ...values);
  }

  public async sumWhereLike(
    table: string,
    column: string,
    ...values: unknown[]
  ): Promise<bigint> {
    return await this._sumWhere(table, column, true, ...values);
  }

  protected async _sumWhere(
    table: string,
    column: string,
    like: boolean,
    ...values: unknown[]
  ): Promise<bigint> {
    const queryBuilderResult = this._buildWhereQuery(like, ...values);
    if (!queryBuilderResult) return 0n;

    const sql = `SELECT SUM(${column})
                 FROM ${table}
                 WHERE ${queryBuilderResult.keyString}`;
    const result = await this._query(sql, queryBuilderResult.params);

    return (result as CountDataPacket[])[0][`SUM(${column})`] as bigint || 0n;
  }

  public async countQuery(sql: string, params?: unknown[]): Promise<bigint> {
    const result = await this._query(sql, params);
    return (result as CountQueryPacket[])[0]['result'] || 0n;
  }

  public async count(table: string): Promise<bigint> {
    // create sql query - select count(*) from table
    const sql = `SELECT COUNT(*)
                 FROM ${table}`;

    // execute query
    const result = await this._query(sql);

    // return count
    return (result as CountDataPacket[])[0]['COUNT(*)'];
  }

  public async countWhere(
    table: string,
    ...values: unknown[]
  ): Promise<bigint> {
    return await this._countWhere(table, false, ...values);
  }

  public async countWhereLike(
    table: string,
    ...values: unknown[]
  ): Promise<bigint> {
    return await this._countWhere(table, true, ...values);
  }

  protected async _countWhere(
    table: string,
    like: boolean,
    ...values: unknown[]
  ): Promise<bigint> {
    const queryBuilderResult = this._buildWhereQuery(like, ...values);
    if (!queryBuilderResult) return 0n;

    const sql = `SELECT COUNT(*)
                 FROM ${table}
                 WHERE ${queryBuilderResult.keyString}`;
    const result = await this._query(sql, queryBuilderResult.params);

    return (result as CountDataPacket[])[0]['COUNT(*)'];
  }

  protected async _setup() {
    // get setup.sql file
    let setupSql = fs.readFileSync(
      path.join(__dirname, '..', '..', 'sql', 'setup.sql'),
      'utf8',
    );

    // remove comments
    setupSql = setupSql.replace(/--.*/g, '');

    // remove empty lines
    setupSql = setupSql.replace(/^\s*[\r, \n]/gm, '');

    // split sql queries
    const queries = setupSql.split(';');

    // get connection from pool
    const conn = await Database.pool.getConnection();

    try {
      // execute each query
      for (const query of queries) {
        if (query) await conn.query(query);
      }
    } catch (e) {
      logger.err(e);
    } finally {
      // release connection
      await conn.release();
      Database.isSetup = true;
    }

    // create dummy user
    const user = new User({
      id: -1n,
      name: 'Unknown User',
      email: 'unknown',
    });
    // see if user exists
    const existingUser = await this.get('users', user.id);

    if (existingUser) {
      await this.update('users', user.id, user, false);
    } else await this.insert('users', user, false);
  }

  public async _query(
    sql: string,
    params?: unknown[],
  ): Promise<ResultSetHeader | RowDataPacket[]> {
    while (!Database.isSetup) await new Promise((r) => setTimeout(r, 100));
    if (!sql) return Promise.reject(new Error('No SQL query'));

    // get connection from pool
    const conn = await Database.pool.getConnection();
    try {
      // execute query and return result
      return await conn.query(sql, params);
    } finally {
      // release connection
      await conn.release();
    }
  }
}

export default Database;
