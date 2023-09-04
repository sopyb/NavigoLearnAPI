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

// Class
export class RoadmapLike implements IRoadmapLike {
  private _id: bigint;
  private _roadmapId: bigint;
  private _userId: bigint;
  private _value: number;
  private _createdAt: Date;

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

  // Method to modify the properties
  public set({ id, roadmapId, userId, value, createdAt }: IRoadmapLike): void {
    if (id !== undefined) this._id = id;
    if (roadmapId !== undefined) this._roadmapId = roadmapId;
    if (userId !== undefined) this._userId = userId;
    if (value !== undefined) this._value = value;
    if (createdAt !== undefined) this._createdAt = createdAt;
  }

  public get id(): bigint {
    return this._id;
  }

  public get roadmapId(): bigint {
    return this._roadmapId;
  }

  public get userId(): bigint {
    return this._userId;
  }

  public get value(): number {
    return this._value;
  }

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
}
