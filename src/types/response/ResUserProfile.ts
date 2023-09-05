import { IUser } from '@src/types/models/User';
import { IUserInfo } from '@src/types/models/UserInfo';
import { UserStats } from '@src/helpers/databaseManagement';

export interface IResUserProfile {
  // from User
  readonly id: bigint;
  readonly avatar: string | null;
  readonly name: string;
  readonly email: string;
  readonly createdAt: Date;

  // from UserInfo
  readonly bio: string | null;
  readonly quote: string | null;
  readonly websiteUrl: string | null;
  readonly githubUrl: string | null;

  // from UserStats
  readonly roadmapsCount: bigint;
  readonly roadmapsViews: bigint;
  readonly roadmapsLikes: bigint;
  readonly followerCount: bigint;
  readonly followingCount: bigint;

  // from User
  readonly githubLinked: boolean;
  readonly googleLinked: boolean;

  // utils
  readonly isFollowing: boolean;
}

export class ResUserProfile implements IResUserProfile {
  public readonly id: bigint;
  public readonly avatar: string | null;
  public readonly name: string;
  public readonly email: string;
  public readonly bio: string | null;
  public readonly quote: string | null;
  public readonly websiteUrl: string | null;
  public readonly githubUrl: string | null;
  public readonly roadmapsCount: bigint;
  public readonly roadmapsViews: bigint;
  public readonly roadmapsLikes: bigint;
  public readonly followerCount: bigint;
  public readonly followingCount: bigint;
  public readonly githubLinked: boolean;
  public readonly googleLinked: boolean;
  public readonly createdAt: Date;
  public readonly isFollowing: boolean;

  public constructor(
    { id, avatar, name, email, createdAt, githubId, googleId }: IUser,
    { bio, quote, websiteUrl, githubUrl }: IUserInfo,
    {
      roadmapsCount,
      roadmapsViews,
      roadmapsLikes,
      followerCount,
      followingCount,
    }: UserStats,
    isFollowing: boolean,
  ) {
    this.id = id;
    this.avatar = avatar;
    this.name = name;
    this.email = email;
    this.bio = bio;
    this.quote = quote;
    this.websiteUrl = websiteUrl;
    this.githubUrl = githubUrl;
    this.roadmapsCount = roadmapsCount;
    this.roadmapsViews = roadmapsViews;
    this.roadmapsLikes = roadmapsLikes;
    this.followerCount = followerCount;
    this.followingCount = followingCount;
    this.githubLinked = !!githubId;
    this.googleLinked = !!googleId;
    this.createdAt = createdAt;
    this.isFollowing = isFollowing;
  }

  // function to determine if an object is a UserProfile
  public static isProfile(obj: unknown): obj is IResUserProfile {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'id' in obj &&
      'avatar' in obj &&
      'name' in obj &&
      'email' in obj &&
      'createdAt' in obj &&
      'bio' in obj &&
      'quote' in obj &&
      'websiteUrl' in obj &&
      'githubUrl' in obj &&
      'roadmapsCount' in obj &&
      'roadmapsViews' in obj &&
      'roadmapsLikes' in obj &&
      'followerCount' in obj &&
      'followingCount' in obj &&
      'githubLinked' in obj &&
      'googleLinked' in obj &&
      'isFollowing' in obj
    );
  }
}
