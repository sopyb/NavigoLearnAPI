// **** Variables **** //

const INVALID_CONSTRUCTOR_PARAM = 'nameOrObj arg must a string or an object ' + 
  'with the appropriate user keys.';

export enum UserRoles {
  Standard,
  Admin,
}


// **** Types **** //

export interface IUser {
  id: bigint;
  name: string;
  email: string;
  pwdHash?: string;
  role?: UserRoles;
  googleId?: bigint;
  githubId?: bigint;
}

export interface ISessionUser {
  id: number;
  email: string;
  name: string;
  role: IUser['role'];
}


// **** User **** //

class User implements IUser {

  public id: bigint;
  public name: string;
  public email: string;
  public role?: UserRoles;
  public pwdHash?: string;
  public googleId?: bigint;
  public githubId?: bigint;

  /**
   * Constructor()
   */
  public constructor(
    name?: string,
    email?: string,
    role?: UserRoles,
    pwdHash?: string,
    id?: bigint, // id last cause usually set by db
    googleId?: bigint,
    githubId?: bigint,
  ) {
    this.name = (name ?? '');
    this.email = (email ?? '');
    this.role = (role ?? UserRoles.Standard);
    this.pwdHash = (pwdHash ?? '');
    this.id = BigInt(id ?? -1);
    this.googleId = BigInt(googleId ?? -1);
    this.githubId = BigInt(githubId ?? -1);
  }

  /**
   * Get user instance from object.
   */
  public static from(param: object): User {
    // Check is user
    if (!User.isUser(param)) {
      throw new Error(INVALID_CONSTRUCTOR_PARAM);
    }
    // Get user instance
    const p = param as IUser;
    return new User(
      p.name, p.email, p.role, p.pwdHash, p.id, p.googleId, p.githubId);
  }

  /**
   * Is this an object which contains all the user keys.
   */
  public static isUser(this: void, arg: unknown): boolean {
    return (
      !!arg &&
      typeof arg === 'object' &&
      'id' in arg &&
      'email' in arg &&
      'name' in arg &&
      'role' in arg &&
      'pwdHash' in arg &&
      'googleId' in arg &&
      'githubId' in arg
    );
  }
}


// **** Export default **** //

export default User;
