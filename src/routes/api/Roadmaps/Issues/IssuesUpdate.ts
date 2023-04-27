import { Response, Router } from 'express';
import Paths from '@src/routes/constants/Paths';
import Database from '@src/util/DatabaseDriver';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import {
  RequestWithSession,
  requireSessionMiddleware,
} from '@src/middleware/session';
import { Issue } from '@src/models/Issue';
import { Roadmap } from '@src/models/Roadmap';

const IssuesUpdate = Router({ mergeParams: true });

async function checkArguments(
  req: RequestWithSession,
  res: Response,
  roadmapOwnerCanEdit = false,
): Promise<{
  session: RequestWithSession['session'],
  issueId: bigint,
  roadmapId: bigint,
  issue: Issue,
  roadmap: Roadmap,
  db: Database,
} | undefined> {
  // get data from body and session
  const session = req.session;
  const issueId = BigInt(req.params.issueId || -1);
  const roadmapId = BigInt(req.params.roadmapId || -1);

  // check if session, issueId and roadmapId are valid
  if (!session || issueId < 0 || roadmapId < 0) {
    res.status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: 'Session, issueId or roadmapId is invalid.' });
    return;
  }

  // get database connection
  const db = new Database();

  // check if issue exists
  const issue = await db.get<Issue>('issues', issueId);

  if (!issue) {
    res.status(HttpStatusCodes.NOT_FOUND)
      .json({ error: 'Issue does not exist.' });
    return;
  }

  // check if issue belongs to roadmap
  if (issue.roadmapId !== roadmapId) {
    res.status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: 'Issue does not belong to roadmap.' });
    return;
  }

  // check if roadmap exists
  const roadmap = await db.get<Roadmap>('roadmaps', roadmapId);

  if (!roadmap) {
    res.status(HttpStatusCodes.NOT_FOUND)
      .json({ error: 'Roadmap does not exist.' });
    return;
  }
  // check if user is allowed to update issue
  if (issue.userId !== session.userId &&
    (roadmapOwnerCanEdit ? roadmap?.ownerId !== session.userId : true)) {
    res.status(HttpStatusCodes.FORBIDDEN)
      .json({ error: 'User is not allowed to update issue.' });
    return;
  }

  return {
    session,
    issueId,
    roadmapId,
    issue,
    roadmap,
    db,
  };
}

async function statusChangeIssue(
  req: RequestWithSession,
  res: Response,
  open: boolean) {
  // check if arguments are valid
  const args = await checkArguments(req, res, true);

  if (!args) return;

  const {
    issueId,
    issue,
    db,
  } = args;

  // update issue
  issue.open = open;
  issue.updatedAt = new Date();

  // save issue to database
  const success = await db.update('issues', issueId, issue);

  // check if id is valid
  if (!success) return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
    .json({ error: 'Issue could not be saved to database.' });

  // return success
  return res.status(HttpStatusCodes.OK).json({ success: true });
}

IssuesUpdate.post(Paths.Roadmaps.Issues.Update.Title,
  async (req: RequestWithSession, res) => {
    // get data from body and session
    const session = req.session;
    const issueId = BigInt(req.params.issueId || -1);
    const roadmapId = BigInt(req.params.roadmapId || -1);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const title = req.body?.title as string;

    // check if title is valid
    if (!title) {
      return res.status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'Title is missing.' });
    }
    // check if session, issueId and roadmapId are valid
    if (!session || issueId < 0 || roadmapId < 0) {
      return res.status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'Session, issueId or roadmapId is invalid.' });
    }

    // get database connection
    const db = new Database();

    // check if issue exists
    const issue = await db.get<Issue>('issues', issueId);

    if (!issue) {
      return res.status(HttpStatusCodes.NOT_FOUND)
        .json({ error: 'Issue does not exist.' });
    }

    // check if issue belongs to roadmap
    if (issue.roadmapId !== roadmapId) {
      return res.status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'Issue does not belong to roadmap.' });
    }

    // check if user is allowed to update issue
    if (issue.userId !== session.userId) {
      return res.status(HttpStatusCodes.UNAUTHORIZED)
        .json({ error: 'User is not allowed to update issue.' });
    }

    // update issue
    issue.title = title;
    issue.updatedAt = new Date();

    // save issue to database
    const success = await db.update('issues', issueId, issue);

    // check if id is valid
    if (!success) return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Issue could not be saved to database.' });

    // return success
    return res.status(HttpStatusCodes.OK).json({ success: true });
  });

IssuesUpdate.post(Paths.Roadmaps.Issues.Update.Content,
  async (req: RequestWithSession, res) => {
    // get data from body and session
    const session = req.session;
    const issueId = BigInt(req.params.issueId || -1);
    const roadmapId = BigInt(req.params.roadmapId || -1);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const content = req.body?.content as string;

    // check if content is valid
    if (!content) {
      return res.status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'Content is missing.' });
    }
    // check if session, issueId and roadmapId are valid
    if (!session || issueId < 0 || roadmapId < 0) {
      return res.status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'Session, issueId or roadmapId is invalid.' });
    }

    // get database connection
    const db = new Database();

    // check if issue exists
    const issue = await db.get<Issue>('issues', issueId);

    if (!issue) {
      return res.status(HttpStatusCodes.NOT_FOUND)
        .json({ error: 'Issue does not exist.' });
    }

    // check if issue belongs to roadmap
    if (issue.roadmapId !== roadmapId) {
      return res.status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'Issue does not belong to roadmap.' });
    }

    // check if user is allowed to update issue
    if (issue.userId !== session.userId) {
      return res.status(HttpStatusCodes.UNAUTHORIZED)
        .json({ error: 'User is not allowed to update issue.' });
    }

    // update issue
    issue.content = content;
    issue.updatedAt = new Date();

    // save issue to database
    const success = await db.update('issues', issueId, issue);

    // check if id is valid
    if (!success) return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Issue could not be saved to database.' });

    // return success
    return res.status(HttpStatusCodes.OK).json({ success: true });
  });

IssuesUpdate.get(Paths.Roadmaps.Issues.Update.Status, requireSessionMiddleware);
IssuesUpdate.get(Paths.Roadmaps.Issues.Update.Status,
  (req, res) => statusChangeIssue(req, res, true));

IssuesUpdate.delete(
  Paths.Roadmaps.Issues.Update.Status, requireSessionMiddleware);
IssuesUpdate.delete(Paths.Roadmaps.Issues.Update.Status,
  (req, res) => statusChangeIssue(req, res, false));

export default IssuesUpdate;