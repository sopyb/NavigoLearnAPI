// TypeScript Interface
export interface IUserInfo {
  readonly id?: bigint;
  readonly userId: bigint;
  readonly bio?: string | null;
  readonly quote?: string | null;
  readonly websiteUrl?: string | null;
  readonly githubUrl?: string | null;
}

// TypeScript Class
export class UserInfo implements IUserInfo {
  private _id?: bigint;
  private _userId: bigint;
  private _bio?: string | null;
  private _quote?: string | null;
  private _websiteUrl?: string | null;
  private _githubUrl?: string | null;

  public constructor({
    id,
    userId,
    bio = null,
    quote = null,
    websiteUrl = null,
    githubUrl = null,
  }: IUserInfo) {
    this._id = id;
    this._userId = userId;
    this._bio = bio;
    this._quote = quote;
    this._websiteUrl = websiteUrl;
    this._githubUrl = githubUrl;
  }

  // Method to modify the properties
  public set({ id, userId, bio, quote, websiteUrl, githubUrl }: IUserInfo) {
    if (id !== undefined) this._id = id;
    if (userId !== undefined) this._userId = userId;
    if (bio !== undefined) this._bio = bio;
    if (quote !== undefined) this._quote = quote;
    if (websiteUrl !== undefined) this._websiteUrl = websiteUrl;
    if (githubUrl !== undefined) this._githubUrl = githubUrl;
  }

  public get id(): bigint | undefined {
    return this._id;
  }

  public get userId(): bigint {
    return this._userId;
  }

  public get bio(): string | null | undefined {
    return this._bio;
  }

  public get quote(): string | null | undefined {
    return this._quote;
  }

  public get websiteUrl(): string | null | undefined {
    return this._websiteUrl;
  }

  public get githubUrl(): string | null | undefined {
    return this._githubUrl;
  }

  // Static method to check if an object is of type IUserInfo
  public static isUserInfo(obj: unknown): obj is IUserInfo {
    return typeof obj === 'object' && obj !== null && 'userId' in obj;
  }
}
