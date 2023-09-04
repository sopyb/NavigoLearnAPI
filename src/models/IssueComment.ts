// Interface
export interface IIssueComment {
  readonly id?: bigint;
  readonly issueId: bigint;
  readonly userId: bigint;
  readonly content: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// Class
export class IssueComment implements IIssueComment {
  private _id?: bigint;
  private _issueId: bigint;
  private _userId: bigint;
  private _content: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  public constructor({
    id,
    issueId,
    userId,
    content,
    createdAt,
    updatedAt,
  }: IIssueComment) {
    this._id = id;
    this._issueId = issueId;
    this._userId = userId;
    this._content = content;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  // Method to modify the properties
  public set({
    id,
    issueId,
    userId,
    content,
    createdAt,
    updatedAt,
  }: IIssueComment): void {
    if (id !== undefined) this._id = id;
    if (issueId !== undefined) this._issueId = issueId;
    if (userId !== undefined) this._userId = userId;
    if (content !== undefined) this._content = content;
    if (createdAt !== undefined) this._createdAt = createdAt;
    if (updatedAt !== undefined) this._updatedAt = updatedAt;
  }

  public get id(): bigint | undefined {
    return this._id;
  }

  public get issueId(): bigint {
    return this._issueId;
  }

  public get userId(): bigint {
    return this._userId;
  }

  public get content(): string {
    return this._content;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  // Static method to check if an object is of type IIssueComment
  public static isIssueComment(obj: unknown): obj is IIssueComment {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'issueId' in obj &&
      'userId' in obj &&
      'content' in obj &&
      'createdAt' in obj &&
      'updatedAt' in obj
    );
  }
}
