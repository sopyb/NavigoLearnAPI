export const INVALID_CONSTRUCTOR_PARAM = 'Invalid constructor parameter';

export interface IIssue {
  id: bigint;
  roadmapId: bigint;
  userId: bigint;
  open: boolean;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Issue implements IIssue {
  public id: bigint;
  public roadmapId: bigint;
  public userId: bigint;
  public open: boolean;
  public title: string;
  public content: string;
  public createdAt: Date;
  public updatedAt: Date;

  public constructor(
    roadmapId: bigint,
    userId: bigint,
    open: boolean,
    title: string,
    content: string,
    id: bigint | null = null,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    this.id = (id ?? -1) as bigint;
    this.roadmapId = roadmapId;
    this.userId = userId;
    this.open = open;
    this.title = title;
    this.content = content;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public static from(param: object): Issue {
    if (!Issue.isIssue(param)) {
      throw new Error(INVALID_CONSTRUCTOR_PARAM);
    }

    return new Issue(
      param.roadmapId,
      param.userId,
      param.open,
      param.title,
      param.content,
      param.id,
      param.createdAt,
      param.updatedAt,
    );
  }

  public static isIssue(param: object): param is IIssue {
    return (
      'id' in param &&
      'roadmapId' in param &&
      'userId' in param &&
      'open' in param &&
      'title' in param &&
      'content' in param &&
      'createdAt' in param &&
      'updatedAt' in param
    );
  }

  public toJSONSafe(): unknown {
    return {
      id: this.id.toString(),
      roadmapId: this.roadmapId.toString(),
      userId: this.userId.toString(),
      open: this.open,
      title: this.title,
      content: this.content,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
