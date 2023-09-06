// Interface for full User object
export interface IUser {
  readonly id: bigint;
  readonly avatar: string | null;
  readonly name: string;
  readonly email: string;
  readonly role: number | null;
  readonly pwdHash: string | null;
  readonly googleId: string | null;
  readonly githubId: string | null;
  readonly createdAt: Date;
}

// Interface for constructing a User
interface IUserConstructor {
  readonly id?: bigint;
  readonly avatar?: string | null;
  readonly name: string;
  readonly email: string;
  readonly role?: number | null;
  readonly pwdHash?: string | null;
  readonly googleId?: string | null;
  readonly githubId?: string | null;
  readonly createdAt?: Date;
}

// Interface for modifying a User
interface IUserModifications {
  readonly id?: bigint;
  readonly avatar?: string | null;
  readonly name?: string;
  readonly email?: string;
  readonly role?: number | null;
  readonly pwdHash?: string | null;
  readonly googleId?: string | null;
  readonly githubId?: string | null;
  readonly createdAt?: Date;
}

// Class
export class User implements IUser {
  private _id: bigint;
  private _avatar: string | null;
  private _name: string;
  private _email: string;
  private _role: number | null;
  private _pwdHash: string | null;
  private _googleId: string | null;
  private _githubId: string | null;
  private _createdAt: Date;

  public constructor({
    id = -1n,
    avatar = null,
    name,
    email,
    role = null,
    pwdHash = null,
    googleId = null,
    githubId = null,
    createdAt = new Date(),
  }: IUserConstructor) {
    this._id = id;
    this._avatar = avatar;
    this._name = name;
    this._email = email;
    this._role = role;
    this._pwdHash = pwdHash;
    this._googleId = googleId;
    this._githubId = githubId;
    this._createdAt = createdAt;
  }

  // Method to modify the properties
  public set({
    id,
    avatar,
    name,
    email,
    role,
    pwdHash,
    googleId,
    githubId,
    createdAt,
  }: IUserModifications): void {
    if (id !== undefined) this._id = id;
    if (avatar !== undefined) this._avatar = avatar;
    if (name !== undefined) this._name = name;
    if (email !== undefined) this._email = email;
    if (role !== undefined) this._role = role;
    if (pwdHash !== undefined) this._pwdHash = pwdHash;
    if (googleId !== undefined) this._googleId = googleId;
    if (githubId !== undefined) this._githubId = githubId;
    if (createdAt !== undefined) this._createdAt = createdAt;
  }

  public get id(): bigint {
    return this._id;
  }

  public get avatar(): string | null {
    return this._avatar;
  }

  public get name(): string {
    return this._name;
  }

  public get email(): string {
    return this._email;
  }

  public get role(): number | null {
    return this._role;
  }

  public get pwdHash(): string | null {
    return this._pwdHash;
  }

  public get googleId(): string | null {
    return this._googleId;
  }

  public get githubId(): string | null {
    return this._githubId;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  // Static method to check if an object is of type IUser
  public static isUser(obj: unknown): obj is IUser {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'name' in obj &&
      'email' in obj &&
      'createdAt' in obj
    );
  }

  // toObject method
  public toObject(): IUser {
    return {
      id: this._id,
      avatar: this._avatar,
      name: this._name,
      email: this._email,
      role: this._role,
      pwdHash: this._pwdHash,
      googleId: this._googleId,
      githubId: this._githubId,
      createdAt: this._createdAt,
    };
  }
}
