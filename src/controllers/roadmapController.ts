import { RequestWithSession } from '@src/middleware/session';
import { Response } from 'express';
import {
  responseInvalidBody,
  responseServerError,
} from '@src/helpers/responses/generalResponses';
import Database from '@src/util/Database/DatabaseDriver';
import { RoadmapLike } from '@src/types/models/RoadmapLike';
import {
  responseNotAllowed,
  responseRoadmap,
  responseRoadmapAlreadyLiked,
  responseRoadmapCreated,
  responseRoadmapDeleted,
  responseRoadmapNotFound,
  responseRoadmapNotRated,
  responseRoadmapRated,
  responseRoadmapUpdated,
} from '@src/helpers/responses/roadmapResponses';
import {
  getRoadmapData,
  getRoadmapLike,
  insertRoadmap,
  insertRoadmapLike,
  updateRoadmapLike,
} from '@src/helpers/databaseManagement';
import { RequestWithBody } from '@src/middleware/validators/validateBody';
import { Roadmap, RoadmapTopic } from '@src/types/models/Roadmap';
import { ResFullRoadmap } from '@src/types/response/ResFullRoadmap';
import { IUser } from '@src/types/models/User';
import { addRoadmapView } from '@src/util/Views';
import logger from 'jet-logger';

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

  // isPublic can't be modified by the user yet
  // if (isPublic !== true && isPublic !== false) isPublic = true;
  isPublic = true;
  if (isDraft !== true && isDraft !== false) isDraft = false;

  const roadmap = new Roadmap({
    name: name as string,
    description: description as string,
    topic: topic as RoadmapTopic | undefined,
    userId,
    isPublic: isPublic as boolean,
    isDraft: isDraft as boolean,
    data: data as string,
  });

  const id = await insertRoadmap(db, roadmap);

  if (id !== -1n) return responseRoadmapCreated(res, id);

  return responseServerError(res);
}

export async function getRoadmap(req: RequestWithSession, res: Response) {
  const roadmapId = req.params.roadmapId;
  const userId = req.session?.userId;

  if (!roadmapId) return responseServerError(res);

  const db = new Database();

  const roadmap = await getRoadmapData(db, BigInt(roadmapId));
  if (!roadmap) return responseRoadmapNotFound(res);

  const user = await db.get<IUser>('users', roadmap.userId);
  if (!user) return responseServerError(res);
  const likeCount = await db.countWhere(
    'roadmapLikes',
    'roadmapId',
    roadmap.id,
  );
  const viewCount = await db.countWhere(
    'roadmapViews',
    'roadmapId',
    roadmap.id,
  );
  const isLiked = await db.sumWhere(
    'roadmapLikes',
    'roadmapId',
    roadmap.id,
    'userId',
    userId,
  );

  if (!roadmap.isPublic && roadmap.userId !== userId)
    return responseNotAllowed(res);

  addRoadmapView(db, roadmap.id, userId).catch((e) => logger.err(e));

  return responseRoadmap(
    res,
    new ResFullRoadmap(roadmap, user, likeCount, viewCount, isLiked),
  );
}

export async function updateAllRoadmap(req: RequestWithBody, res: Response) {
  const roadmapId = req.params.roadmapId;
  const userId = req.session?.userId;

  if (!roadmapId) return responseServerError(res);
  if (!userId) return responseServerError(res);

  const db = new Database();

  const roadmap = await getRoadmapData(db, BigInt(roadmapId));

  if (!roadmap) return responseRoadmapNotFound(res);
  if (roadmap.userId !== userId) return responseNotAllowed(res);

  const { name, description, data, topic, isDraft } = req.body;

  if (!name || !description || !data || !topic || !isDraft)
    return responseServerError(res);

  if (!Object.values(RoadmapTopic).includes(topic as RoadmapTopic))
    return responseInvalidBody(res);

  roadmap.set({
    name: name as string,
    description: description as string,
    data: data as string,
    topic: topic as RoadmapTopic,
    isDraft: isDraft as boolean,
  });

  if (await db.update('roadmaps', roadmap.id, roadmap))
    return responseRoadmapUpdated(res);

  return responseServerError(res);
}

export async function updateNameRoadmap(req: RequestWithBody, res: Response) {
  const roadmapId = req.params.roadmapId;
  const userId = req.session?.userId;

  if (!roadmapId) return responseServerError(res);
  if (!userId) return responseServerError(res);

  const db = new Database();

  const roadmap = await getRoadmapData(db, BigInt(roadmapId));

  if (!roadmap) return responseRoadmapNotFound(res);
  if (roadmap.userId !== userId) return responseNotAllowed(res);

  const { name } = req.body;

  if (!name) return responseServerError(res);

  roadmap.set({ name: name as string });

  if (await db.update('roadmaps', roadmap.id, roadmap))
    return responseRoadmapUpdated(res);

  return responseServerError(res);
}

export async function updateDescriptionRoadmap(
  req: RequestWithBody,
  res: Response,
) {
  const roadmapId = req.params.roadmapId;
  const userId = req.session?.userId;

  if (!roadmapId) return responseServerError(res);
  if (!userId) return responseServerError(res);

  const db = new Database();

  const roadmap = await getRoadmapData(db, BigInt(roadmapId));

  if (!roadmap) return responseRoadmapNotFound(res);
  if (roadmap.userId !== userId) return responseNotAllowed(res);

  const { description } = req.body;

  if (!description) return responseServerError(res);

  roadmap.set({ description: description as string });

  if (await db.update('roadmaps', roadmap.id, roadmap))
    return responseRoadmapUpdated(res);

  return responseServerError(res);
}

export async function updateDataRoadmap(req: RequestWithBody, res: Response) {
  const roadmapId = req.params.roadmapId;
  const userId = req.session?.userId;

  if (!roadmapId) return responseServerError(res);
  if (!userId) return responseServerError(res);

  const db = new Database();

  const roadmap = await getRoadmapData(db, BigInt(roadmapId));

  if (!roadmap) return responseRoadmapNotFound(res);
  if (roadmap.userId !== userId) return responseNotAllowed(res);

  const { data } = req.body;

  if (!data) return responseServerError(res);

  roadmap.set({ data: data as string });

  if (await db.update('roadmaps', roadmap.id, roadmap))
    return responseRoadmapUpdated(res);

  return responseServerError(res);
}

export async function updateTopicRoadmap(req: RequestWithBody, res: Response) {
  const roadmapId = req.params.roadmapId;
  const userId = req.session?.userId;

  if (!roadmapId) return responseServerError(res);
  if (!userId) return responseServerError(res);

  const db = new Database();

  const roadmap = await getRoadmapData(db, BigInt(roadmapId));

  if (!roadmap) return responseRoadmapNotFound(res);
  if (roadmap.userId !== userId) return responseNotAllowed(res);

  const { topic } = req.body;

  if (!topic) return responseServerError(res);

  if (!Object.values(RoadmapTopic).includes(topic as RoadmapTopic))
    return responseInvalidBody(res);

  roadmap.set({ topic: topic as RoadmapTopic });

  if (await db.update('roadmaps', roadmap.id, roadmap))
    return responseRoadmapUpdated(res);

  return responseServerError(res);
}

export async function updateIsDraftRoadmap(
  req: RequestWithBody,
  res: Response,
) {
  const roadmapId = req.params.roadmapId;
  const userId = req.session?.userId;

  if (!roadmapId) return responseServerError(res);
  if (!userId) return responseServerError(res);

  const db = new Database();

  const roadmap = await getRoadmapData(db, BigInt(roadmapId));

  if (!roadmap) return responseRoadmapNotFound(res);
  if (roadmap.userId !== userId) return responseNotAllowed(res);

  const { isDraft } = req.body;

  if (!isDraft) return responseServerError(res);

  roadmap.set({ isDraft: !!isDraft });

  if (await db.update('roadmaps', roadmap.id, roadmap))
    return responseRoadmapUpdated(res);

  return responseServerError(res);
}

export async function deleteRoadmap(req: RequestWithSession, res: Response) {
  const roadmapId = req.params.roadmapId;
  const userId = req.session?.userId;

  if (!userId) return responseServerError(res);
  if (!roadmapId) return responseServerError(res);

  const db = new Database();

  const roadmap = await getRoadmapData(db, BigInt(roadmapId));

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