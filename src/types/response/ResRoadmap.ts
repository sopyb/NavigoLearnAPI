import { IRoadmap, RoadmapTopic } from '@src/types/models/Roadmap';
import { IUser } from '@src/types/models/User';

export interface IResRoadmap {
  readonly id: bigint;
  readonly name: string;
  readonly description: string;
  readonly topic: RoadmapTopic;
  readonly isPublic: boolean;
  readonly isDraft: boolean;
  readonly data: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  // user
  readonly userId: bigint;
  readonly userAvatar: string | null;
  readonly userName: string;
}

export class ResRoadmap implements IResRoadmap {
  public readonly id: bigint;
  public readonly name: string;
  public readonly description: string;
  public readonly topic: RoadmapTopic;
  public readonly isFeatured: boolean;
  public readonly isPublic: boolean;
  public readonly isDraft: boolean;
  public readonly data: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  public readonly userId: bigint;
  public readonly userAvatar: string | null;
  public readonly userName: string;

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
      data,
      createdAt,
      updatedAt,
    }: IRoadmap,
    { avatar: userAvatar, name: userName }: IUser,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.topic = topic;
    this.isFeatured = isFeatured;
    this.isPublic = isPublic;
    this.isDraft = isDraft;
    this.data = data;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.userId = userId;
    this.userAvatar = userAvatar;
    this.userName = userName;
  }

  public static isRoadmap(obj: unknown): obj is IResRoadmap {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'id' in obj &&
      'name' in obj &&
      'description' in obj &&
      'topic' in obj &&
      'userId' in obj &&
      'isFeatured' in obj &&
      'isPublic' in obj &&
      'isDraft' in obj &&
      'data' in obj &&
      'createdAt' in obj &&
      'updatedAt' in obj
    );
  }
}
