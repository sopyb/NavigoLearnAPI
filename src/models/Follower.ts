export const INVALID_CONSTRUCTOR_PARAM = 'Invalid constructor parameter';

export interface IFollower {
  id: bigint;
  followerId: bigint;
  userId: bigint;
}

export class Follower implements IFollower {
  public followerId: bigint;
  public id: bigint;
  public userId: bigint;

  public constructor(
    followerId: bigint,
    userId: bigint,
    id: bigint | null = null,
  ) {
    this.followerId = followerId;
    this.userId = userId;
    this.id = (id ?? -1) as bigint;
  }

  public static from(param: object): Follower {
    if (!Follower.isFollower(param)) {
      throw new Error(INVALID_CONSTRUCTOR_PARAM);
    }

    return new Follower(
      param.followerId,
      param.userId,
      param.id,
    );
  }

  public static isFollower(param: object): param is IFollower {
    return 'followerId' in param && 'userId' in param && 'id' in param;
  }

}