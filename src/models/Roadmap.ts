// variables
export const INVALID_CONSTRUCTOR_PARAM = 'Invalid constructor parameter';

// interface
export interface IRoadmap {
  id: bigint;
  ownerId: bigint;
  name: string;
  description: string;
  created: Date;
  updated: Date;
  deleted: Date | null;
  isDeleted: boolean;
  isPublic: boolean;
  data: string; // base64 encoded json
}

// class
export class Roadmap implements IRoadmap {
  public id: bigint;
  public ownerId: bigint;
  public name: string;
  public description: string;
  public created: Date;
  public updated: Date;
  public deleted: Date | null;
  public isDeleted: boolean;
  public isPublic: boolean;
  public data: string; // base64 encoded json

  /**
   * Constructor()
   */
  public constructor(
    ownerId: bigint | number,
    name: string,
    description: string,
    data: string,
    id: bigint | null = null,
    created: Date = new Date(),
    updated: Date = new Date(),
    deleted: Date | null = null,
    isDeleted = false,
    isPublic = true,
  ) {
    this.id = (id ?? -1) as bigint;
    this.ownerId = ownerId as bigint;
    this.name = name;
    this.description = description;
    this.created = created;
    this.updated = updated;
    this.deleted = deleted;
    this.isDeleted = isDeleted;
    this.isPublic = isPublic;
    this.data = data;
  }

  // Get roadmap instance from object.
  public static from(param: object): Roadmap {
    // Check is roadmap
    if (!Roadmap.isRoadmap(param)) {
      throw new Error(INVALID_CONSTRUCTOR_PARAM);
    }

    // Create instance
    return new Roadmap(
      param.ownerId,
      param.name,
      param.description,
      param.data,
      param.id,
      param.created,
      param.updated,
      param.deleted,
      param.isDeleted,
      param.isPublic,
    );
  }

  // Check if object is a roadmap.
  public static isRoadmap(param: object): param is IRoadmap {
    return (
      'id' in param &&
      'ownerId' in param &&
      'name' in param &&
      'description' in param &&
      'created' in param &&
      'updated' in param &&
      'deleted' in param &&
      'isDeleted' in param &&
      'isPublic' in param &&
      'data' in param
    );
  }
}

