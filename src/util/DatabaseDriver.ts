import EnvVars from '@src/constants/EnvVars';
import mariadb, {Pool} from 'mariadb';



const {DBCred} = EnvVars;

// config interface
interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  database: string;
}

// database results interface
interface RowDataPacket {
  [columnName: string]: unknown;
}

interface ResultSetHeader {
  fieldCount: number;
  affectedRows: number;
  insertId: number;
  info: string;
  serverStatus: number;
  warningStatus: number;
}

class Database {
  private static pool: Pool;

  public constructor(config: DatabaseConfig = DBCred as DatabaseConfig) {
    this.initialize(config);
  }

  public initialize(config: DatabaseConfig = DBCred as DatabaseConfig) {
    Database.pool = mariadb.createPool(config);
    this.setup();
  }

  private setup() {
    // create users table using the User model
    let query = `CREATE TABLE IF NOT EXISTS users (
      id INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      role INT NOT NULL,
      pwdHash VARCHAR(255) NOT NULL,
      googleId VARCHAR(255),
      githubId VARCHAR(255),
      PRIMARY KEY (id)
    )`;
    this.query(query);


    // create roadmaps table
    query = `CREATE TABLE IF NOT EXISTS roadmaps (
      id INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      description VARCHAR(255) NOT NULL,
      ownerId INT NOT NULL,
      created DATETIME NOT NULL,
      updated DATETIME NOT NULL,
      deleted DATETIME,
      isDeleted BOOLEAN NOT NULL,
      isPublic BOOLEAN NOT NULL,
      data TEXT NOT NULL,
      PRIMARY KEY (id)
    )`;

    this.query(query);
  }

  private async query(sql: string, params?: unknown[]):
    Promise<ResultSetHeader | RowDataPacket[]> {
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

  public async insert(table: string, data: object): Promise<bigint> {
    // get keys and values
    const keys = Object.keys(data);
    const values = Object.values(data);
    // remove id from keys and values
    const idIndex = keys.indexOf('id');
    if (idIndex > -1) {
      keys.splice(idIndex, 1);
      values.splice(idIndex, 1);
    }

    // create sql query - insert into table (keys) values (values)
    // ? for values to be replaced by params
    const sql = `INSERT INTO ${table} (${keys.join(',')}) 
        VALUES (${values.map(() => '?').join(',')})`;
    // execute query
    const result = await this.query(sql, values);

    // return insert id
    let insertId = BigInt(-1);
    if (result) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      insertId = BigInt((result as ResultSetHeader)?.insertId);
    }
    return insertId;
  }

  public async update(table: string, id: bigint, data: object):
    Promise<boolean> {
    // get keys and values
    const keys = Object.keys(data);
    const values = Object.values(data);

    // remove id from keys and values
    const idIndex = keys.indexOf('id');
    if (idIndex > -1) {
      keys.splice(idIndex, 1);
      values.splice(idIndex, 1);
    }

    // create sql query - update table set key = ?, key = ? where id = ?
    // ? for values to be replaced by params
    const sql = `UPDATE ${table} SET ${keys.map(key => `${key} = ?`).join(',')} 
        WHERE id = ?`;
    // execute query
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.query(sql, [...values, id]);

    let affectedRows = -1;
    if (result) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      affectedRows = (result as ResultSetHeader)?.affectedRows || -1;
    }

    // return true if affected rows > 0 else false
    return affectedRows > 0;
  }

  public async delete(table: string, id: bigint): Promise<boolean> {
    const sql = `DELETE FROM ${table} WHERE id = ?`;
    const result = await this.query(sql, [id]);

    let affectedRows = -1;
    if (result) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      affectedRows = (result as ResultSetHeader)?.affectedRows || -1;
    }

    // return true if affected rows > 0 else false
    return affectedRows > 0;
  }

  public async get<T>(table: string, id: bigint): Promise<T | null> {
    // create sql query - select * from table where id = ?
    const sql = `SELECT * FROM ${table} WHERE id = ?`;
    // execute query
    const result = await this.query(sql, [id]);

    let data: T | null = null;
    if (result) {
      data = (result as T[])?.[0]  || null;
    }
    // if result is RowDataPacket return first element else return null
    return data;
  }

  // async getUsers(): Promise<User[]> {
  //   const users = await this.query('SELECT * FROM users');
  //   return users;
  // }
  //
  // async createUser(user: User): Promise<number> {
  //   const userId = await this.insert('users', user);
  //   return userId;
  // }
  //
  // async updateUser(id: number, user: User): Promise<boolean> {
  //   const updated = await this.update('users', id, user);
  //   return updated;
  // }
  //
  // async deleteUser(id: number): Promise<boolean> {
  //   const deleted = await this.delete('users', id);
  //   return deleted;
  // }
  //
  // async getPosts(): Promise<Post[]> {
  //   const posts = await this.query('SELECT * FROM posts');
  //   return posts;
  // }
  //
  // async createPost(post: Post): Promise<number> {
  //   const postId = await this.insert('posts', post);
  //   return postId;
  // }
  //
  // async updatePost(id: number, post: Post): Promise<boolean> {
  //   const updated = await this.update('posts', id, post);
  //   return updated;
  // }
  //
  // async deletePost(id: number): Promise<boolean> {
  //   const deleted = await this.delete('posts', id);
  //   return deleted;
  // }
}

export default Database;
