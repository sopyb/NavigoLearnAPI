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
  private _id: bigint;
  private _userId: bigint;
  private _bio: string | null;
  private _quote: string | null;
  private _websiteUrl: string | null;
  private _githubUrl: string | null;

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

  public get id(): bigint {
    return this._id;
  }

  public get userId(): bigint {
    return this._userId;
  }

  public get bio(): string | null {
    return this._bio;
  }

  public get quote(): string | null {
    return this._quote;
  }

  public get websiteUrl(): string | null {
    return this._websiteUrl;
  }

  public get githubUrl(): string | null {
    return this._githubUrl;
  }

  // Static method to check if an object is of type IUserInfo
  public static isUserInfo(obj: unknown): obj is IUserInfo {
    return typeof obj === 'object' && obj !== null && 'userId' in obj;
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
