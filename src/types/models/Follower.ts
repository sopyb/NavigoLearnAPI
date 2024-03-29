// Interface for full Follower object
export interface IFollower {
  readonly id: bigint;
  readonly followerId: bigint;
  readonly userId: bigint;
  readonly createdAt: Date;
}

// Interface for constructing a Follower
interface IFollowerConstructor {
  readonly id?: bigint;
  readonly followerId: bigint;
  readonly userId: bigint;
  readonly createdAt?: Date;
}

// Interface for modifying a Follower
interface IFollowerModifications {
  readonly id?: bigint;
  readonly followerId?: bigint;
  readonly userId?: bigint;
  readonly createdAt?: Date;
}

// Class
export class Follower implements IFollower {
  public constructor({
    id = -1n,
    followerId,
    userId,
    createdAt = new Date(),
  }: IFollowerConstructor) {
    this._id = id;
    this._followerId = followerId;
    this._userId = userId;
    this._createdAt = createdAt;
  }

  private _id: bigint;

  public get id(): bigint {
    return this._id;
  }

  private _followerId: bigint;

  public get followerId(): bigint {
    return this._followerId;
  }

  private _userId: bigint;

  public get userId(): bigint {
    return this._userId;
  }

  private _createdAt: Date;

  public get createdAt(): Date {
    return this._createdAt;
  }

  // Static method to check if an object is of type IFollower
  public static isFollower(obj: unknown): obj is IFollower {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'followerId' in obj &&
      'userId' in obj &&
      'createdAt' in obj
    );
  }

  // Method to modify the properties
  public set({
    id,
    followerId,
    userId,
    createdAt,
  }: IFollowerModifications): void {
    if (id !== undefined) this._id = id;
    if (followerId !== undefined) this._followerId = followerId;
    if (userId !== undefined) this._userId = userId;
    if (createdAt !== undefined) this._createdAt = createdAt;
  }

  // toObject method
  public toObject(): IFollower {
    return {
      id: this._id,
      followerId: this._followerId,
      userId: this._userId,
      createdAt: this._createdAt,
    };
  }
}
