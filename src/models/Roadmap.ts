// Interface for full Roadmap object
export interface IRoadmap {
  readonly id: bigint;
  readonly name: string;
  readonly description: string;
  readonly userId: bigint;
  readonly isPublic: boolean;
  readonly isDraft: boolean;
  readonly data: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// Interface for constructing a Roadmap
interface IRoadmapConstructor {
  readonly id?: bigint;
  readonly name: string;
  readonly description: string;
  readonly userId: bigint;
  readonly isPublic?: boolean;
  readonly isDraft?: boolean;
  readonly data: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

// Interface for modifying a Roadmap
interface IRoadmapModifications {
  readonly id?: bigint;
  readonly name?: string;
  readonly description?: string;
  readonly userId?: bigint;
  readonly isPublic?: boolean;
  readonly isDraft?: boolean;
  readonly data?: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

// Class
export class Roadmap implements IRoadmap {
  private _id: bigint;
  private _name: string;
  private _description: string;
  private _userId: bigint;
  private _isPublic: boolean;
  private _isDraft: boolean;
  private _data: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  public constructor({
    id = 0n,
    name,
    description,
    userId,
    isPublic = true,
    isDraft = false,
    data,
    createdAt = new Date(),
    updatedAt = new Date(),
  }: IRoadmapConstructor) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._userId = userId;
    this._isPublic = isPublic;
    this._isDraft = isDraft;
    this._data = data;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  // Method to modify the properties
  public set({
    id,
    name,
    description,
    userId,
    isPublic,
    isDraft,
    data,
    createdAt,
    updatedAt,
  }: IRoadmapModifications): void {
    if (id !== undefined) this._id = id;
    if (name !== undefined) this._name = name;
    if (description !== undefined) this._description = description;
    if (userId !== undefined) this._userId = userId;
    if (isPublic !== undefined) this._isPublic = isPublic;
    if (isDraft !== undefined) this._isDraft = isDraft;
    if (data !== undefined) this._data = data;
    if (createdAt !== undefined) this._createdAt = createdAt;
    if (updatedAt !== undefined) this._updatedAt = updatedAt;
  }

  public get id(): bigint {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get description(): string {
    return this._description;
  }

  public get userId(): bigint {
    return this._userId;
  }

  public get isPublic(): boolean {
    return this._isPublic;
  }

  public get isDraft(): boolean {
    return this._isDraft;
  }

  public get data(): string {
    return this._data;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  // Static method to check if an object is of type IRoadmap
  public static isRoadmap(obj: unknown): obj is IRoadmap {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'name' in obj &&
      'description' in obj &&
      'userId' in obj &&
      'isPublic' in obj &&
      'data' in obj &&
      'createdAt' in obj &&
      'updatedAt' in obj
    );
  }

  // toObject method
  public toObject(): IRoadmap {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      userId: this._userId,
      isPublic: this._isPublic,
      isDraft: this._isDraft,
      data: this._data,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
