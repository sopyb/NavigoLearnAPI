// Interface for full RoadmapView object
export interface IRoadmapView {
  readonly id: bigint;
  readonly userId: bigint;
  readonly roadmapId: bigint;
  readonly full: boolean;
  readonly createdAt: Date;
}

// Interface for constructing a RoadmapView
interface IRoadmapViewConstructor {
  readonly id?: bigint;
  readonly userId?: bigint;
  readonly roadmapId: bigint;
  readonly full?: boolean | bigint;
  readonly createdAt?: Date;
}

// Interface for modifying a RoadmapView
interface IRoadmapViewModifications {
  readonly id?: bigint;
  readonly userId?: bigint;
  readonly roadmapId?: bigint;
  readonly full?: boolean | bigint;
  readonly createdAt?: Date;
}

// Class
export class RoadmapView implements IRoadmapView {
  public constructor({
    id = -1n,
    userId = -1n,
    roadmapId,
    full = false,
    createdAt = new Date(),
  }: IRoadmapViewConstructor) {
    this._id = id;
    this._userId = userId;
    this._roadmapId = roadmapId;
    this._full = !!full;
    this._createdAt = createdAt;
  }

  private _id: bigint;

  public get id(): bigint {
    return this._id;
  }

  private _userId: bigint;

  public get userId(): bigint {
    return this._userId;
  }

  private _roadmapId: bigint;

  public get roadmapId(): bigint {
    return this._roadmapId;
  }

  private _full: boolean;

  public get full(): boolean {
    return this._full;
  }

  private _createdAt: Date;

  public get createdAt(): Date {
    return this._createdAt;
  }

  // Static method to check if an object is of type IRoadmapView
  public static isRoadmapView(obj: unknown): obj is IRoadmapView {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'userId' in obj &&
      'roadmapId' in obj &&
      'full' in obj &&
      'createdAt' in obj
    );
  }

  // Method to modify the properties
  public set({
    id,
    userId,
    roadmapId,
    full,
    createdAt,
  }: IRoadmapViewModifications): void {
    if (id !== undefined) this._id = id;
    if (userId !== undefined) this._userId = userId;
    if (roadmapId !== undefined) this._roadmapId = roadmapId;
    if (full !== undefined) this._full = !!full;
    if (createdAt !== undefined) this._createdAt = createdAt;
  }

  // toObject method
  public toObject(): IRoadmapView {
    return {
      id: this._id,
      userId: this._userId,
      roadmapId: this._roadmapId,
      full: this._full,
      createdAt: this._createdAt,
    };
  }
}
