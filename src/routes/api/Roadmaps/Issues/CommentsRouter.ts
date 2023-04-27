import { Request, Response, Router } from 'express';
import Paths from '@src/routes/constants/Paths';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import {
  RequestWithSession,
  requireSessionMiddleware,
} from '@src/middleware/session';
import { Roadmap } from '@src/models/Roadmap';
import { Issue } from '@src/models/Issue';
import User from '@src/models/User';
import Database from '@src/util/DatabaseDriver';
import { Comment } from '@src/models/Comment';

const CommentsRouter = Router({ mergeParams: true });

async function checkParams(req: Request, res: Response)
  : Promise<{
  issue: Issue,
  issueId: bigint,
  roadmap: Roadmap,
  roadmapId: bigint,
} | undefined> {
  // get data from body and session
  const roadmapId = BigInt(req.params.roadmapId || -1);
  const issueId = BigInt(req.params.issueId || -1);

  // check if ids are valid
  if (issueId < 0) {
    res.status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: 'IssueId is invalid.' });
    return;
  }

  if (roadmapId < 0) {
    res.status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: 'RoadmapId is invalid.' });
  }

  // get database connection
  const db = new Database();

  // check if roadmap exists
  const roadmap = await db.get<Roadmap>('roadmaps', roadmapId);

  if (!roadmap) {
    res.status(HttpStatusCodes.NOT_FOUND)
      .json({ error: 'Roadmap does not exist.' });
    return;
  }

  // check if issue exists
  const issue = await db.get<Issue>('issues', issueId);

  if (!issue) {
    res.status(HttpStatusCodes.NOT_FOUND)
      .json({ error: 'Issue does not exist.' });
    return;
  }

  return { issue, issueId, roadmap, roadmapId };
}

async function checkUser(req: RequestWithSession, res: Response)
  : Promise<{
  user: User,
  userId: bigint
} | undefined> {
  // get user id from session
  const userId = BigInt(req.session?.userId || -1);

  // get database connection
  const db = new Database();

  // get user
  const user = await db.get<User>('users', userId);

  if (!user) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Token user can\'t be found.' });
    return;
  }

  return { user, userId };
}

CommentsRouter
  .post(Paths.Roadmaps.Issues.Comments.Create, requireSessionMiddleware);
CommentsRouter.post(Paths.Roadmaps.Issues.Comments.Create,
  async (req: RequestWithSession, res) => {
    // get comment data from body
    const { content } = req.body as { content: string };

    const args = await checkParams(req, res);
    const userArgs = await checkUser(req, res);
    if (!args || !userArgs) return;
    const { issueId, roadmap} = args;
    const { userId } = userArgs;

    // check if user is allowed to create a comment
    if (!roadmap.isPublic && roadmap.ownerId !== userId) {
      res.status(HttpStatusCodes.FORBIDDEN)
        .json({ error: 'Only the owner can create comments.' });
      return;
    }

    // get database connection
    const db = new Database();

    // create comment
    const commentId =
      await db.insert('issueComments', new Comment(content, issueId, userId));

    if (commentId < 0) return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Failed to create comment.' });

    // send success json
    return res.status(HttpStatusCodes.OK).json({ success: true });
  });

CommentsRouter.get(Paths.Roadmaps.Issues.Comments.Get,
  async (req, res) => {
    const args = await checkParams(req, res);
    if (!args) return;
    const { issueId} = args;

    // get database connection
    const db = new Database();

    // get comments
    const comments =
      await db.getAllWhere<Comment>('issueComments', 'issueId', issueId);

    if (!comments) return res.status(HttpStatusCodes.NOT_FOUND)
      .json({ error: 'Failed to get comments, there might be none.' });

    // send success json
    return res.status(HttpStatusCodes.OK).json({ success: true, comments });

  });

CommentsRouter
  .use(Paths.Roadmaps.Issues.Comments.Update, requireSessionMiddleware);
CommentsRouter.post(Paths.Roadmaps.Issues.Comments.Update,
  async (req: RequestWithSession, res) => {
    // get comment data from body
    const { content } = req.body as { content: string };
    // get comment id from params
    const commentId = BigInt(req.params.commentId || -1);

    // get user info
    const userArgs = await checkUser(req, res);
    if (!userArgs) return;
    const { userId } = userArgs;

    // check if comment id is valid
    if (commentId < 0) {
      res.status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'CommentId is invalid.' });
      return;
    }

    // get database connection
    const db = new Database();

    // get comment
    const comment = await db.get<Comment>('issueComments', commentId);

    if (!comment) {
      res.status(HttpStatusCodes.NOT_FOUND)
        .json({ error: 'Comment does not exist.' });
      return;
    }

    // check if user is allowed to update comment
    if (comment.userId !== userId) {
      res.status(HttpStatusCodes.FORBIDDEN)
        .json({ error: 'Only the owner can update comments.' });
      return;
    }

    // update comment
    const success = await db.update('issueComments', commentId, { content });

    if (!success) return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Failed to update comment.' });

    // send success json
    return res.status(HttpStatusCodes.OK).json({ success: true });
  });

CommentsRouter
  .use(Paths.Roadmaps.Issues.Comments.Delete, requireSessionMiddleware);
CommentsRouter.delete(Paths.Roadmaps.Issues.Comments.Delete,
  async (req: RequestWithSession, res) => {
    // get comment id from params
    const commentId = BigInt(req.params.commentId || -1);

    // get user info
    const userArgs = await checkUser(req, res);
    if (!userArgs) return;
    const { userId } = userArgs;

    // check if comment id is valid
    if (commentId < 0) {
      res.status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'CommentId is invalid.' });
      return;
    }

    // get database connection
    const db = new Database();

    // get comment
    const comment = await db.get<Comment>('issueComments', commentId);

    if (!comment) {
      res.status(HttpStatusCodes.NOT_FOUND)
        .json({ error: 'Comment does not exist.' });
      return;
    }

    // check if the user is allowed to delete comment
    if (comment.userId !== userId) {
      res.status(HttpStatusCodes.FORBIDDEN)
        .json({ error: 'Only the owner can delete comments.' });
      return;
    }

    // delete comment
    const success = await db.delete('issueComments', commentId);

    if (!success) return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Failed to delete comment.' });

    // send success json
    return res.status(HttpStatusCodes.OK).json({ success: true });
  });

export default CommentsRouter;