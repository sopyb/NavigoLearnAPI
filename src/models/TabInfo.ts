export const INVALID_CONSTRUCTOR_PARAM = 'Invalid constructor parameter';

export interface ITabInfo {
  id: bigint;
  stringId: string;
  roadmapId: bigint;
  userId: bigint;
  content: string;
}

export class TabInfo implements ITabInfo {
  public id: bigint;
  public stringId: string;
  public roadmapId: bigint;
  public userId: bigint;
  public content: string;

  public constructor(
    roadmapId: bigint,
    userId: bigint,
    content: string, // base64 encoded json
    stringId: string,
    id: bigint | null = null,
  ) {
    this.stringId = stringId;
    this.id = (id ?? -1) as bigint;
    this.roadmapId = roadmapId;
    this.userId = userId;
    this.content = content;
  }

  public static isTabInfo(param: object): param is ITabInfo {
    return (
      'id' in param &&
      'stringId' in param &&
      'roadmapId' in param &&
      'userId' in param &&
      'content' in param
    );
  }

  public toJSON(): string {
    return JSON.stringify({
      id: this.id.toString(),
      stringId: this.stringId,
      roadmapId: this.roadmapId.toString(),
      userId: this.userId.toString(),
      content: this.content,
    });
  }

  public static from(param: object): ITabInfo {
    if (!TabInfo.isTabInfo(param)) {
      throw new Error(INVALID_CONSTRUCTOR_PARAM);
    }

    return new TabInfo(
      param.roadmapId,
      param.userId,
      param.content,
      param.stringId,
      param.id,
    );
  }
}
