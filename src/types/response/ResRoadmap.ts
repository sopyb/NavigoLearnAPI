import { IRoadmap } from '@src/types/models/Roadmap';
import { IUser } from '@src/types/models/User';

export interface IResRoadmap {
  readonly id: bigint;
  readonly name: string;
  readonly description: string;
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
      id = 0n,
      name,
      description,
      userId,
      isPublic = true,
      isDraft = false,
      data,
      createdAt = new Date(),
      updatedAt = new Date(),
    }: IRoadmap,
    { avatar, name: userName }: IUser,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.isPublic = isPublic;
    this.isDraft = isDraft;
    this.data = data;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

    this.userId = userId;
    this.userAvatar = avatar;
    this.userName = userName;
  }

  public static isRoadmap(obj: unknown): obj is IResRoadmap {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'id' in obj &&
      'name' in obj &&
      'description' in obj &&
      'userId' in obj &&
      'isPublic' in obj &&
      'isDraft' in obj &&
      'data' in obj &&
      'createdAt' in obj &&
      'updatedAt' in obj
    );
  }
}
