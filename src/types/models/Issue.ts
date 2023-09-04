// Interface for full Issue object
export interface IIssue {
  readonly id: bigint;
  readonly roadmapId: bigint;
  readonly userId: bigint;
  readonly open: boolean;
  readonly title: string;
  readonly content: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// Interface for constructing an Issue
interface IIssueConstructor {
  readonly id?: bigint;
  readonly roadmapId: bigint;
  readonly userId: bigint;
  readonly open: boolean;
  readonly title: string;
  readonly content?: string | null;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

// Interface for modifying an Issue
interface IIssueModifications {
  readonly id?: bigint;
  readonly roadmapId?: bigint;
  readonly userId?: bigint;
  readonly open?: boolean;
  readonly title?: string;
  readonly content?: string | null;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

// Class
export class Issue implements IIssue {
  private _id: bigint;
  private _roadmapId: bigint;
  private _userId: bigint;
  private _open: boolean;
  private _title: string;
  private _content: string | null;
  private _createdAt: Date;
  private _updatedAt: Date;

  public constructor({
    id = -1n,
    roadmapId,
    userId,
    open,
    title,
    content = null,
    createdAt = new Date(),
    updatedAt = new Date(),
  }: IIssueConstructor) {
    this._id = id;
    this._roadmapId = roadmapId;
    this._userId = userId;
    this._open = open;
    this._title = title;
    this._content = content;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  // Method to modify the properties
  public set({
    id,
    roadmapId,
    userId,
    open,
    title,
    content,
    createdAt,
    updatedAt,
  }: IIssueModifications): void {
    if (id !== undefined) this._id = id;
    if (roadmapId !== undefined) this._roadmapId = roadmapId;
    if (userId !== undefined) this._userId = userId;
    if (open !== undefined) this._open = open;
    if (title !== undefined) this._title = title;
    if (content !== undefined) this._content = content;
    if (createdAt !== undefined) this._createdAt = createdAt;
    if (updatedAt !== undefined) this._updatedAt = updatedAt;
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

  public get open(): boolean {
    return this._open;
  }

  public get title(): string {
    return this._title;
  }

  public get content(): string | null {
    return this._content;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  // Static method to check if an object is of type IIssue
  public static isIssue(obj: unknown): obj is IIssue {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'roadmapId' in obj &&
      'userId' in obj &&
      'open' in obj &&
      'title' in obj &&
      'updatedAt' in obj
    );
  }

  // toObject method
  public toObject(): IIssue {
    return {
      id: this._id,
      roadmapId: this._roadmapId,
      userId: this._userId,
      open: this._open,
      title: this._title,
      content: this._content,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
