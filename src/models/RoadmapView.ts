export interface IRoadmapView {
  id: bigint;
  userId: bigint;
  roadmapId: bigint;
  createdAt: Date;
  full: boolean;
}

export class RoadmapView implements IRoadmapView {
  public id: bigint;
  public userId: bigint;
  public roadmapId: bigint;
  public createdAt: Date;
  public full: boolean;

  public constructor(
    userId: bigint | number,
    roadmapId: bigint | number,
    full: boolean,
    createdAt: Date | string = new Date(),
    id?: bigint | number | string,
  ) {
    this.id = BigInt(id || 0);
    this.userId = BigInt(userId);
    this.roadmapId = BigInt(roadmapId);
    this.full = full;

    if (typeof createdAt === 'string') {
      this.createdAt = new Date(createdAt);
    } else this.createdAt = createdAt;
  }

  // Get roadmap instance from object.
  public static from(param: object): RoadmapView {
    // chekc if param is a roadmapView instance
    if (!this.isRoadmapView(param)) throw new Error('Invalid param');

    // return new roadmapView instance
    return new RoadmapView(
      param.userId,
      param.roadmapId,
      param.full,
      param.createdAt,
      param.id,
    );
  }

  // Check if object is a roadmapView
  public static isRoadmapView(param: object): param is IRoadmapView {
    return (
      param &&
      'id' in param &&
      'userId' in param &&
      'full' in param &&
      'roadmapId' in param &&
      'createdAt' in param
    );
  }
}