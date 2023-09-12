//  interface for RoadmapLike
export interface IRoadmapLike {
  readonly id: bigint;
  readonly roadmapId: bigint;
  readonly userId: bigint;
  readonly value: number;
  readonly createdAt: Date;
}

// Interface for constructing a RoadmapLike
interface IRoadmapLikeConstructor {
  readonly id?: bigint;
  readonly roadmapId: bigint;
  readonly userId: bigint;
  readonly value?: number;
  readonly createdAt?: Date;
}

// Interface for modifying a RoadmapLike
interface IRoadmapLikeModifications {
  readonly id?: bigint;
  readonly roadmapId?: bigint;
  readonly userId?: bigint;
  readonly value?: number;
  readonly createdAt?: Date;
}

// Class
export class RoadmapLike implements IRoadmapLike {
  public constructor({
    id = -1n,
    roadmapId,
    userId,
    value = 1,
    createdAt = new Date(),
  }: IRoadmapLikeConstructor) {
    this._id = id;
    this._roadmapId = roadmapId;
    this._userId = userId;
    this._value = value;
    this._createdAt = createdAt;
  }

  private _id: bigint;

  public get id(): bigint {
    return this._id;
  }

  private _roadmapId: bigint;

  public get roadmapId(): bigint {
    return this._roadmapId;
  }

  private _userId: bigint;

  public get userId(): bigint {
    return this._userId;
  }

  private _value: number;

  public get value(): number {
    return this._value;
  }

  private _createdAt: Date;

  public get createdAt(): Date {
    return this._createdAt;
  }

  // Static method to check if an object is of type IRoadmapLike
  public static isRoadmapLike(obj: unknown): obj is IRoadmapLike {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'roadmapId' in obj &&
      'userId' in obj
    );
  }

  // Method to modify the properties
  public set({
    id,
    roadmapId,
    userId,
    value,
    createdAt,
  }: IRoadmapLikeModifications): void {
    if (id !== undefined) this._id = id;
    if (roadmapId !== undefined) this._roadmapId = roadmapId;
    if (userId !== undefined) this._userId = userId;
    if (value !== undefined) this._value = value;
    if (createdAt !== undefined) this._createdAt = createdAt;
  }

  // toObject method
  public toObject(): IRoadmapLike {
    return {
      id: this._id,
      roadmapId: this._roadmapId,
      userId: this._userId,
      value: this._value,
      createdAt: this._createdAt,
    };
  }
}
