// variables
export const INVALID_CONSTRUCTOR_PARAM = 'Invalid constructor parameter';

// interface
export interface IRoadmap {
  id: bigint;
  ownerId: bigint;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  data: string; // base64 encoded json
}

// class
export class Roadmap implements IRoadmap {
  public id: bigint;
  public ownerId: bigint;
  public name: string;
  public description: string;
  public createdAt: Date;
  public updatedAt: Date;
  public isPublic: boolean;
  public data: string; // base64 encoded json

  /**
   * Constructor()
   */
  public constructor(
    ownerId: bigint,
    name: string,
    description: string,
    data: string,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    isPublic = false,
    id: bigint | null = null,
  ) {
    this.id = (id ?? -1) as bigint;
    this.ownerId = ownerId;
    this.name = name;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
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
      param.createdAt,
      param.updatedAt,
      param.isPublic,
      param.id,
    );
  }

  // Check if object is a roadmap.
  public static isRoadmap(param: object): param is IRoadmap {
    return (
      'id' in param &&
      'ownerId' in param &&
      'name' in param &&
      'description' in param &&
      'createdAt' in param &&
      'updatedAt' in param &&
      'isPublic' in param &&
      'data' in param
    );
  }
}

