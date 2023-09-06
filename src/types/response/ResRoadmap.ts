import { IRoadmap, RoadmapTopic } from '@src/types/models/Roadmap';
import { IUser } from '@src/types/models/User';

export interface IResRoadmap {
  readonly id: bigint;
  readonly name: string;
  readonly description: string;
  readonly topic: RoadmapTopic;
  readonly isPublic: boolean;
  readonly isDraft: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  // user
  readonly userId: bigint;
  readonly userAvatar: string | null;
  readonly userName: string;

  // stats
  readonly likeCount: bigint;
  readonly viewCount: bigint;

  // user stats
  readonly isLiked: boolean;
}

export class ResRoadmap implements IResRoadmap {
  public readonly id: bigint;
  public readonly name: string;
  public readonly description: string;
  public readonly topic: RoadmapTopic;
  public readonly isFeatured: boolean;
  public readonly isPublic: boolean;
  public readonly isDraft: boolean;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  public readonly userId: bigint;
  public readonly userAvatar: string | null;
  public readonly userName: string;

  public readonly likeCount: bigint;
  public readonly viewCount: bigint;

  public readonly isLiked: boolean;

  public constructor(
    {
      id,
      name,
      description,
      topic,
      userId,
      isFeatured,
      isPublic,
      isDraft,
      createdAt,
      updatedAt,
    }: IRoadmap,
    { avatar: userAvatar, name: userName }: IUser,
    likeCount: bigint,
    viewCount: bigint,
    isLiked: boolean,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.topic = topic;
    this.isFeatured = isFeatured;
    this.isPublic = isPublic;
    this.isDraft = isDraft;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.userId = userId;
    this.userAvatar = userAvatar;
    this.userName = userName;

    this.likeCount = likeCount;
    this.viewCount = viewCount;

    this.isLiked = isLiked;
  }

  public static isRoadmap(obj: unknown): obj is IResRoadmap {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'id' in obj &&
      'name' in obj &&
      'description' in obj &&
      'topic' in obj &&
      'isFeatured' in obj &&
      'isPublic' in obj &&
      'isDraft' in obj &&
      'createdAt' in obj &&
      'updatedAt' in obj &&
      'userId' in obj &&
      'userAvatar' in obj &&
      'userName' in obj &&
      'likeCount' in obj &&
      'viewCount' in obj &&
      'isLiked' in obj
    );
  }
}
