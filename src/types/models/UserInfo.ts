// Interface for full UserInfo object
export interface IUserInfo {
  readonly id: bigint;
  readonly userId: bigint;
  readonly bio: string | null;
  readonly quote: string | null;
  readonly websiteUrl: string | null;
  readonly githubUrl: string | null;
}

// Interface for constructing a UserInfo
interface IUserInfoConstructor {
  readonly id?: bigint;
  readonly userId: bigint;
  readonly bio?: string | null;
  readonly quote?: string | null;
  readonly websiteUrl?: string | null;
  readonly githubUrl?: string | null;
}

// Interface for modifying a UserInfo
interface IUserInfoModifications {
  readonly id?: bigint;
  readonly userId?: bigint;
  readonly bio?: string | null;
  readonly quote?: string | null;
  readonly websiteUrl?: string | null;
  readonly githubUrl?: string | null;
}

// Class
export class UserInfo implements IUserInfo {
  public constructor({
    id = -1n,
    userId,
    bio = null,
    quote = null,
    websiteUrl = null,
    githubUrl = null,
  }: IUserInfoConstructor) {
    this._id = id;
    this._userId = userId;
    this._bio = bio;
    this._quote = quote;
    this._websiteUrl = websiteUrl;
    this._githubUrl = githubUrl;
  }

  private _id: bigint;

  public get id(): bigint {
    return this._id;
  }

  private _userId: bigint;

  public get userId(): bigint {
    return this._userId;
  }

  private _bio: string | null;

  public get bio(): string | null {
    return this._bio;
  }

  private _quote: string | null;

  public get quote(): string | null {
    return this._quote;
  }

  private _websiteUrl: string | null;

  public get websiteUrl(): string | null {
    return this._websiteUrl;
  }

  private _githubUrl: string | null;

  public get githubUrl(): string | null {
    return this._githubUrl;
  }

  // Static method to check if an object is of type IUserInfo
  public static isUserInfo(obj: unknown): obj is IUserInfo {
    return typeof obj === 'object' && obj !== null && 'userId' in obj;
  }

  // Method to modify the properties
  public set({
    id,
    userId,
    bio,
    quote,
    websiteUrl,
    githubUrl,
  }: IUserInfoModifications) {
    if (id !== undefined) this._id = id;
    if (userId !== undefined) this._userId = userId;
    if (bio !== undefined) this._bio = bio;
    if (quote !== undefined) this._quote = quote;
    if (websiteUrl !== undefined) this._websiteUrl = websiteUrl;
    if (githubUrl !== undefined) this._githubUrl = githubUrl;
  }

  // toObject method
  public toObject(): IUserInfo {
    return {
      id: this._id,
      userId: this._userId,
      bio: this._bio,
      quote: this._quote,
      websiteUrl: this._websiteUrl,
      githubUrl: this._githubUrl,
    };
  }
}
