// Interface for full Session object
export interface ISession {
  readonly id: bigint;
  readonly userId: bigint;
  readonly token: string;
  readonly expires: Date;
}

// Interface for constructing a Session
interface ISessionConstructor {
  readonly id?: bigint;
  readonly userId: bigint;
  readonly token: string;
  readonly expires: Date;
}

// Interface for modifying a Session
interface ISessionModifications {
  readonly id?: bigint;
  readonly userId?: bigint;
  readonly token?: string;
  readonly expires?: Date;
}

// Class
export class Session implements ISession {
  private _id: bigint;
  private _userId: bigint;
  private _token: string;
  private _expires: Date;

  public constructor({
    id = -1n,
    userId,
    token,
    expires,
  }: ISessionConstructor) {
    this._id = id;
    this._userId = userId;
    this._token = token;
    this._expires = expires;
  }

  // Method to modify the properties
  public set({ id, userId, token, expires }: ISessionModifications): void {
    if (id !== undefined) this._id = id;
    if (userId !== undefined) this._userId = userId;
    if (token !== undefined) this._token = token;
    if (expires !== undefined) this._expires = expires;
  }

  public get id(): bigint {
    return this._id;
  }

  public get userId(): bigint {
    return this._userId;
  }

  public get token(): string {
    return this._token;
  }

  public get expires(): Date {
    return this._expires;
  }

  // Static method to check if an object is of type ISession
  public static isSession(obj: unknown): obj is ISession {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'userId' in obj &&
      'token' in obj &&
      'expires' in obj
    );
  }

  // toObject method to convert the class instance to an object
  public toObject(): ISession {
    return {
      id: this._id,
      userId: this._userId,
      token: this._token,
      expires: this._expires,
    };
  }
}
