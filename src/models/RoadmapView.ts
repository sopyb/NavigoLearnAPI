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
  readonly full?: boolean;
  readonly createdAt?: Date;
}

// Class
export class RoadmapView implements IRoadmapView {
  private _id: bigint;
  private _userId: bigint;
  private _roadmapId: bigint;
  private _full: boolean;
  private _createdAt: Date;

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
    this._full = full;
    this._createdAt = createdAt;
  }

  // Method to modify the properties
  public set({ id, userId, roadmapId, full, createdAt }: IRoadmapView): void {
    if (id !== undefined) this._id = id;
    if (userId !== undefined) this._userId = userId;
    if (roadmapId !== undefined) this._roadmapId = roadmapId;
    if (full !== undefined) this._full = full;
    if (createdAt !== undefined) this._createdAt = createdAt;
  }

  public get id(): bigint {
    return this._id;
  }

  public get userId(): bigint {
    return this._userId;
  }

  public get roadmapId(): bigint {
    return this._roadmapId;
  }

  public get full(): boolean {
    return this._full;
  }

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
}
