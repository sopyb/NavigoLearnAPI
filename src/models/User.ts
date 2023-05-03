// **** Variables **** //

const INVALID_CONSTRUCTOR_PARAM =
  'nameOrObj arg must a string or an object ' +
  'with the appropriate userDisplay keys.';

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
  googleId?: string | null;
  githubId?: string | null;
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
  public googleId?: string | null;
  public githubId?: string | null;

  /**
   * Constructor()
   */
  public constructor(
    name?: string,
    email?: string,
    role?: UserRoles,
    pwdHash?: string,
    id?: bigint, // id last cause usually set by db
    googleId?: string | null,
    githubId?: string | null,
  ) {
    this.name = name ?? '';
    this.email = email ?? '';
    this.role = role ?? UserRoles.Standard;
    this.pwdHash = pwdHash ?? '';
    this.id = BigInt(id ?? -1);
    this.googleId = googleId ?? null;
    this.githubId = githubId ?? null;
  }

  /**
   * Get userDisplay instance from object.
   */
  public static from(param: object): User {
    // Check is userDisplay
    if (!User.isUser(param)) {
      throw new Error(INVALID_CONSTRUCTOR_PARAM);
    }
    // Get userDisplay instance
    const p = param as IUser;
    return new User(
      p.name,
      p.email,
      p.role,
      p.pwdHash,
      p.id,
      p.googleId,
      p.githubId,
    );
  }

  /**
   * Is this an object which contains all the userDisplay keys.
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
