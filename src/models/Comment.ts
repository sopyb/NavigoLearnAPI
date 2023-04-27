const INVALID_CONSTRUCTOR_PARAM = 'content, issueId, and userId args ' +
  'must be strings or numbers.';

export interface IComment {
  id: bigint;
  issueId: bigint;
  userId: bigint;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Comment implements IComment {
  public id: bigint;
  public issueId: bigint;
  public userId: bigint;
  public content: string;
  public createdAt: Date;
  public updatedAt: Date;

  public constructor(
    content: string,
    issueId: bigint | number,
    userId: bigint | number,
    id?: bigint,
    createdAt?: Date | string,
    updatedAt?: Date | string,
  ) {
    this.id = BigInt(id ?? -1);
    this.issueId = BigInt(issueId);
    this.userId = BigInt(userId);
    this.content = content;
    this.createdAt = (createdAt instanceof Date) ?
      createdAt : new Date(createdAt ?? Date.now());

    this.updatedAt = (updatedAt instanceof Date) ?
      updatedAt : new Date(updatedAt ?? Date.now());
  }

  public static from(obj: unknown): Comment {
    if (!Comment.isComment(obj)) throw new Error(INVALID_CONSTRUCTOR_PARAM);

    return new Comment(
      obj.content,
      obj.issueId,
      obj.userId,
      obj.id,
      obj.createdAt,
      obj.updatedAt,
    );
  }

  public static isComment(obj: unknown): obj is Comment {
    return (
      !!obj &&
      typeof obj === 'object' &&
      'content' in obj &&
      'issueId' in obj &&
      'userId' in obj &&
      'id' in obj &&
      'createdAt' in obj &&
      'updatedAt' in obj
    );
  }
}

