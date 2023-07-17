const INVALID_CONSTRUCTOR_PARAM =
  'nameOrObj arg must a string or an object ' +
  'with the appropriate user keys.';

export interface IUserInfo {
  id: bigint;
  userId: bigint;
  profilePictureUrl: string;
  bio: string;
  quote: string;
  blogUrl: string;
  websiteUrl: string;
  githubUrl: string;
}

export class UserInfo implements IUserInfo {
  public id: bigint;
  public userId: bigint;
  public profilePictureUrl: string;
  public bio: string;
  public quote: string;
  public blogUrl: string;
  public websiteUrl: string;
  public githubUrl: string;

  public constructor(
    userId: bigint,
    profilePictureUrl = '',
    bio = '',
    quote = '',
    blogUrl = '',
    websiteUrl = '',
    githubUrl = '',
    id = BigInt(-1), // id last cause usually set by db
  ) {
    this.userId = userId;
    this.profilePictureUrl = profilePictureUrl;
    this.bio = bio;
    this.quote = quote;
    this.blogUrl = blogUrl;
    this.websiteUrl = websiteUrl;
    this.githubUrl = githubUrl;
    this.id = id;
  }

  public static from(param: object): UserInfo {
    // check if param is user
    if (!UserInfo.isUserInfo(param)) {
      throw new Error(INVALID_CONSTRUCTOR_PARAM);
    }

    const info = param as IUserInfo;

    // create user
    return new UserInfo(
      info.userId,
      info.profilePictureUrl,
      info.bio,
      info.quote,
      info.blogUrl,
      info.websiteUrl,
      info.githubUrl,
    );
  }

  public static isUserInfo(param: object): boolean {
    return (
      'id' in param &&
      'userId' in param &&
      'profilePictureUrl' in param &&
      'bio' in param &&
      'quote' in param &&
      'blogUrl' in param &&
      'websiteUrl' in param &&
      'githubUrl' in param
    );
  }
}
