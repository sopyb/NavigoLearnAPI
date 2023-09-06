import { RequestWithSession } from '@src/middleware/session';
import { Response } from 'express';
import { responseServerError } from '@src/helpers/responses/generalResponses';
import Database from '@src/util/DatabaseDriver';
import { RoadmapLike } from '@src/types/models/RoadmapLike';
import {
  responseNotAllowed,
  responseRoadmapAlreadyLiked,
  responseRoadmapCreated,
  responseRoadmapDeleted,
  responseRoadmapNotFound,
  responseRoadmapNotRated,
  responseRoadmapRated,
} from '@src/helpers/responses/roadmapResponses';
import {
  getRoadmap,
  getRoadmapLike, insertRoadmap,
  insertRoadmapLike,
  updateRoadmapLike,
} from '@src/helpers/databaseManagement';
import { RequestWithBody } from '@src/middleware/validators/validateBody';
import { Roadmap, RoadmapTopic } from '@src/types/models/Roadmap';

export async function createRoadmap(req: RequestWithBody, res: Response) {
  // guaranteed to exist by middleware
  const { name, description, data } = req.body;

  // non guaranteed to exist by middleware of type Roadmap
  let { topic, isPublic, isDraft } = req.body;

  const userId = req.session?.userId;

  if (!userId || !name || !description || !data)
    return responseServerError(res);

  const db = new Database();

  if (!topic || !Object.values(RoadmapTopic).includes(topic as RoadmapTopic))
    topic = undefined;

  if (isPublic !== true && isPublic !== false) isPublic = true;
  if (isDraft !== true && isDraft !== false) isDraft = false;

  const roadmap = new Roadmap({
    name: name as string,
    description: description as string,
    topic: topic as RoadmapTopic | undefined,
    userId,
    isPublic: isPublic as boolean,
    isDraft: isDraft as boolean ,
    data: data as string,
  });

  const id = await insertRoadmap(db, roadmap);

  if (id !== -1n) return responseRoadmapCreated(res, id);

  return responseServerError(res);
}

export async function deleteRoadmap(req: RequestWithSession, res: Response) {
  const roadmapId = req.params.roadmapId;
  const userId = req.session?.userId;

  if (!userId) return responseServerError(res);
  if (!roadmapId) return responseServerError(res);

  const db = new Database();

  const roadmap = await getRoadmap(db, BigInt(roadmapId));

  if (!roadmap) return responseRoadmapNotFound(res);
  if (roadmap.userId !== userId) return responseNotAllowed(res);

  if (await db.delete('roadmaps', BigInt(roadmapId)))
    return responseRoadmapDeleted(res);

  return responseServerError(res);
}

export async function likeRoadmap(req: RequestWithSession, res: Response) {
  const roadmapId = req.params.roadmapId;
  const userId = req.session?.userId;

  if (!userId) return responseServerError(res);
  if (!roadmapId) return responseServerError(res);

  const db = new Database();

  const liked = await getRoadmapLike(db, BigInt(roadmapId), userId);

  if (!liked) {
    if (
      (await insertRoadmapLike(
        db,
        new RoadmapLike({
          userId,
          roadmapId: BigInt(roadmapId),
          value: 1,
        }),
      )) !== -1n
    )
      return responseRoadmapRated(res);
  }

  if (!liked) return responseServerError(res);
  if (liked.value == 1) return responseRoadmapAlreadyLiked(res);

  liked.set({ value: 1 });

  if (await updateRoadmapLike(db, liked.id, liked))
    return responseRoadmapRated(res);

  return responseServerError(res);
}

export async function dislikeRoadmap(req: RequestWithSession, res: Response) {
  const roadmapId = req.params.roadmapId;
  const userId = req.session?.userId;

  if (!userId) return responseServerError(res);
  if (!roadmapId) return responseServerError(res);

  const db = new Database();

  const liked = await getRoadmapLike(db, BigInt(roadmapId), userId);

  if (!liked) {
    if (
      (await insertRoadmapLike(
        db,
        new RoadmapLike({
          userId,
          roadmapId: BigInt(roadmapId),
          value: -1,
        }),
      )) !== -1n
    )
      return responseRoadmapRated(res);
  }

  if (!liked) return responseServerError(res);
  if (liked.value == -1) return responseRoadmapAlreadyLiked(res);

  liked.set({ value: -1 });

  if (await updateRoadmapLike(db, liked.id, liked))
    return responseRoadmapRated(res);

  return responseServerError(res);
}

export async function removeLikeRoadmap(
  req: RequestWithSession,
  res: Response,
) {
  const roadmapId = req.params.roadmapId;
  const userId = req.session?.userId;

  if (!userId) return responseServerError(res);
  if (!roadmapId) return responseServerError(res);

  const db = new Database();

  const liked = await getRoadmapLike(db, BigInt(roadmapId), userId);

  if (!liked) return responseRoadmapNotRated(res);

  if (await db.delete('roadmapLikes', liked.id))
    return responseRoadmapRated(res);

  return responseServerError(res);
}
