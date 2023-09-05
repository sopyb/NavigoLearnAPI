import { IUser } from '@src/types/models/User';

export interface IResUserMiniProfile {
  readonly id: bigint;
  readonly avatar: string | null;
  readonly name: string;
  readonly createdAt: Date;
}

export class ResUserMiniProfile implements IResUserMiniProfile {
  public readonly id: bigint;
  public readonly avatar: string | null;
  public readonly name: string;
  public readonly createdAt: Date;

  public constructor({ id, avatar, name, createdAt }: IUser) {
    this.id = id;
    this.avatar = avatar;
    this.name = name;
    this.createdAt = createdAt;
  }

  public static isMiniProfile(obj: unknown): obj is IResUserMiniProfile {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'id' in obj &&
      'avatar' in obj &&
      'name' in obj &&
      'email' in obj &&
      'createdAt' in obj
    );
  }
}
