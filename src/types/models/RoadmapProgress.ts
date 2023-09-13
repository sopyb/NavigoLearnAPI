// Interface for RoadmapProgress
export interface IRoadmapProgress {
  readonly id: bigint;
  readonly roadmapId: bigint;
  readonly userId: bigint;
  readonly data: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// Interface for constructing a RoadmapProgress
interface IRoadmapProgressConstructor {
  readonly id?: bigint;
  readonly roadmapId: bigint;
  readonly userId: bigint;
  readonly data: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

// Interface for modifying a RoadmapProgress
interface IRoadmapProgressModifications {
  readonly id?: bigint;
  readonly roadmapId?: bigint;
  readonly userId?: bigint;
  readonly data?: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

// Class
export class RoadmapProgress implements IRoadmapProgress {
  public constructor({
    id = -1n,
    roadmapId,
    userId,
    data,
    createdAt = new Date(),
    updatedAt = new Date(),
  }: IRoadmapProgressConstructor) {
    this._id = id;
    this._roadmapId = roadmapId;
    this._userId = userId;
    this._data = data;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
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

  private _data: string;

  public get data(): string {
    return this._data;
  }

  private _createdAt: Date;

  public get createdAt(): Date {
    return this._createdAt;
  }

  private _updatedAt: Date;

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  // Static method to check if an object is of type IRoadmapProgress
  public static isRoadmapProgress(obj: unknown): obj is IRoadmapProgress {
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
    data,
    createdAt,
    updatedAt,
  }: IRoadmapProgressModifications): void {
    if (id !== undefined) this._id = id;
    if (roadmapId !== undefined) this._roadmapId = roadmapId;
    if (userId !== undefined) this._userId = userId;
    if (data !== undefined) this._data = data;
    if (createdAt !== undefined) this._createdAt = createdAt;
    if (updatedAt !== undefined) this._updatedAt = updatedAt;
  }

  // toObject method
  public toObject(): IRoadmapProgress {
    return {
      id: this._id,
      roadmapId: this._roadmapId,
      userId: this._userId,
      data: this._data,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}