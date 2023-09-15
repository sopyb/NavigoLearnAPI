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
  responseRoadmapAlreadyDisliked,
  responseRoadmapAlreadyLiked,
  responseRoadmapCreated,
  responseRoadmapDeleted,
  responseRoadmapNotFound,
  responseRoadmapNotRated, responseRoadmapProgressUpdated,
  responseRoadmapRated,
  responseRoadmapUnrated,
  responseRoadmapUpdated,
} from '@src/helpers/responses/roadmapResponses';
import {
  deleteDBRoadmap,
  deleteRoadmapLike,
  getRoadmapObject,
  getRoadmapLike, getRoadmapProgress,
  getUser,
  insertRoadmap,
  insertRoadmapLike,
  updateRoadmap,
  updateRoadmapLike, updateRoadmapProgress, insertRoadmapProgress,
} from '@src/helpers/databaseManagement';
import { RequestWithBody } from '@src/middleware/validators/validateBody';
import { Roadmap, RoadmapTopic } from '@src/types/models/Roadmap';
import { ResFullRoadmap } from '@src/types/response/ResFullRoadmap';
import { addRoadmapView } from '@src/util/Views';
import logger from 'jet-logger';
import { RoadmapProgress } from '@src/types/models/RoadmapProgress';

export async function createRoadmap(req: RequestWithBody, res: Response) {
  // guaranteed to exist by middleware
  const { name, description, data, miscData, version } = req.body;

  // non guaranteed to exist by middleware of type Roadmap
  let { topic, isPublic, isDraft } = req.body;

  const userId = req.session?.userId;

  if (!userId || !name || !description || !data)
    return responseServerError(res);

  const db = new Database();

  if (!topic || !Object.values(RoadmapTopic).includes(topic as RoadmapTopic))
    topic = RoadmapTopic.PROGRAMMING;

  isPublic = true;
  if (isDraft !== true && isDraft !== false) isDraft = false;

  const roadmap = new Roadmap({
    name: name as string,
    description: description as string,
    topic: topic as RoadmapTopic | undefined,
    userId,
    isPublic: isPublic as boolean,
    isDraft: isDraft ,
    data: data as string,
    miscData: miscData as string,
    version: version as string,
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

  const roadmap = await getRoadmapObject(db, BigInt(roadmapId));
  if (roadmap === null) return responseRoadmapNotFound(res);

  const user = await getUser(db, roadmap.userId);

  if (user === null) return responseServerError(res);

  const likeCount = await db.sumWhere(
    'roadmapLikes',
    'value',
    'roadmapId',
    roadmap.id,
  );
  const viewCount = await db.countWhere(
    'roadmapViews',
    'roadmapId',
    roadmap.id,
    'full',
    1,
  );
  const isLiked =
    userId !== undefined && userId !== null ?
      await db.sumWhere(
        'roadmapLikes',
        'value',
        'roadmapId',
        roadmap.id,
        'userId',
        userId,
      )
      : 0n;

  if (!roadmap.isPublic && roadmap.userId !== userId)
    return responseNotAllowed(res);

  addRoadmapView(db, roadmap.id, userId).catch((e) => logger.err(e));

  return responseRoadmap(
    res,
    new ResFullRoadmap(roadmap, user, likeCount, viewCount, isLiked),
  );
}

export async function updateAboutRoadmap(req: RequestWithBody, res: Response) {
  const roadmapId = req.params.roadmapId;
  const userId = req.session?.userId;

  if (!roadmapId) return responseServerError(res);
  if (!userId) return responseServerError(res);

  const db = new Database();

  const roadmap = await getRoadmapObject(db, BigInt(roadmapId));

  if (roadmap === null) return responseRoadmapNotFound(res);
  if (roadmap.userId !== userId) return responseNotAllowed(res);

  const { name, description, topic, miscData } = req.body;

  if (!name || !description || !miscData || !topic)
    return responseServerError(res);

  if (!Object.values(RoadmapTopic).includes(topic as RoadmapTopic))
    return responseInvalidBody(res);

  roadmap.set({
    name: name as string,
    description: description as string,
    topic: topic as RoadmapTopic,
    miscData: miscData as string,
  });

  if (await updateRoadmap(db, roadmap.id, roadmap))
    return responseRoadmapUpdated(res);

  return responseServerError(res);
}

export async function updateAllRoadmap(req: RequestWithBody, res: Response) {
  const roadmapId = req.params.roadmapId;
  const userId = req.session?.userId;

  if (!roadmapId) return responseServerError(res);
  if (!userId) return responseServerError(res);

  const db = new Database();

  const roadmap = await getRoadmapObject(db, BigInt(roadmapId));

  if (roadmap === null) return responseRoadmapNotFound(res);
  if (roadmap.userId !== userId) return responseNotAllowed(res);

  const { name, description, data, topic, miscData, isDraft } = req.body;

  if (!name || !description || !data || !topic || !miscData || !isDraft)
    return responseServerError(res);

  if (!Object.values(RoadmapTopic).includes(topic as RoadmapTopic))
    return responseInvalidBody(res);

  roadmap.set({
    name: name as string,
    description: description as string,
    data: data as string,
    topic: topic as RoadmapTopic,
    miscData: miscData as string,
    isDraft: Boolean(isDraft),
  });

  if (await updateRoadmap(db, roadmap.id, roadmap))
    return responseRoadmapUpdated(res);

  return responseServerError(res);
}

export async function updateNameRoadmap(req: RequestWithBody, res: Response) {
  const roadmapId = req.params.roadmapId;
  const userId = req.session?.userId;

  if (!roadmapId) return responseServerError(res);
  if (!userId) return responseServerError(res);

  const db = new Database();

  const roadmap = await getRoadmapObject(db, BigInt(roadmapId));

  if (roadmap === null) return responseRoadmapNotFound(res);
  if (roadmap.userId !== userId) return responseNotAllowed(res);

  const { name } = req.body;

  if (!name) return responseServerError(res);

  roadmap.set({ name: name as string });

  if (await updateRoadmap(db, roadmap.id, roadmap))
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

  const roadmap = await getRoadmapObject(db, BigInt(roadmapId));

  if (roadmap === null) return responseRoadmapNotFound(res);
  if (roadmap.userId !== userId) return responseNotAllowed(res);

  const { description } = req.body;

  if (!description) return responseServerError(res);

  roadmap.set({ description: description as string });

  if (await updateRoadmap(db, roadmap.id, roadmap))
    return responseRoadmapUpdated(res);

  return responseServerError(res);
}

export async function updateDataRoadmap(req: RequestWithBody, res: Response) {
  const roadmapId = req.params.roadmapId;
  const userId = req.session?.userId;

  if (!roadmapId) return responseServerError(res);
  if (!userId) return responseServerError(res);

  const db = new Database();

  const roadmap = await getRoadmapObject(db, BigInt(roadmapId));

  if (roadmap === null) return responseRoadmapNotFound(res);
  if (roadmap.userId !== userId) return responseNotAllowed(res);

  const { data } = req.body;

  if (!data) return responseServerError(res);

  roadmap.set({ data: data as string });

  if (await updateRoadmap(db, roadmap.id, roadmap))
    return responseRoadmapUpdated(res);

  return responseServerError(res);
}

export async function updateTopicRoadmap(req: RequestWithBody, res: Response) {
  const roadmapId = req.params.roadmapId;
  const userId = req.session?.userId;

  if (!roadmapId) return responseServerError(res);
  if (!userId) return responseServerError(res);

  const db = new Database();

  const roadmap = await getRoadmapObject(db, BigInt(roadmapId));

  if (roadmap === null) return responseRoadmapNotFound(res);
  if (roadmap.userId !== userId) return responseNotAllowed(res);

  const { topic } = req.body;

  if (!topic) return responseServerError(res);

  if (!Object.values(RoadmapTopic).includes(topic as RoadmapTopic))
    return responseInvalidBody(res);

  roadmap.set({ topic: topic as RoadmapTopic });

  if (await updateRoadmap(db, roadmap.id, roadmap))
    return responseRoadmapUpdated(res);

  return responseServerError(res);
}

export async function updateMiscDataRoadmap(
  req: RequestWithBody,
  res: Response,
) {
  const roadmapId = req.params.roadmapId;
  const userId = req.session?.userId;

  if (!roadmapId) return responseServerError(res);
  if (!userId) return responseServerError(res);

  const db = new Database();

  const roadmap = await getRoadmapObject(db, BigInt(roadmapId));

  if (roadmap === null) return responseRoadmapNotFound(res);
  if (roadmap.userId !== userId) return responseNotAllowed(res);

  const { miscData } = req.body;

  if (!miscData) return responseServerError(res);

  roadmap.set({ miscData: miscData as string });

  if (await updateRoadmap(db, roadmap.id, roadmap))
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

  const roadmap = await getRoadmapObject(db, BigInt(roadmapId));

  if (roadmap === null) return responseRoadmapNotFound(res);
  if (roadmap.userId !== userId) return responseNotAllowed(res);

  const { isDraft } = req.body;

  if (isDraft === null || isDraft === undefined)
    return responseInvalidBody(res);

  roadmap.set({ isDraft: Boolean(isDraft) });

  if (await updateRoadmap(db, roadmap.id, roadmap))
    return responseRoadmapUpdated(res);

  return responseServerError(res);
}

export async function updateVersionRoadmap(
  req: RequestWithBody,
  res: Response,
) {
  const roadmapId = req.params.roadmapId;
  const userId = req.session?.userId;

  if (!roadmapId) return responseServerError(res);
  if (!userId) return responseServerError(res);

  const { version } = req.body;

  if (!version) return responseServerError(res);

  const db = new Database();

  const roadmap = await getRoadmapObject(db, BigInt(roadmapId));

  if (roadmap === null) return responseRoadmapNotFound(res);

  if (roadmap.userId !== userId) return responseNotAllowed(res);

  roadmap.set({ version: version as string });

  if (await updateRoadmap(db, roadmap.id, roadmap))
    return responseRoadmapUpdated(res);

  return responseServerError(res);
}

export async function deleteRoadmap(req: RequestWithSession, res: Response) {
  const roadmapId = req.params.roadmapId;
  const userId = req.session?.userId;

  if (!userId) return responseServerError(res);
  if (!roadmapId) return responseServerError(res);

  const db = new Database();

  const roadmap = await getRoadmapObject(db, BigInt(roadmapId));

  if (roadmap === null) return responseRoadmapNotFound(res);
  if (roadmap.userId !== userId) return responseNotAllowed(res);

  if (await deleteDBRoadmap(db, BigInt(roadmapId)))
    return responseRoadmapDeleted(res);

  return responseServerError(res);
}

// ! everyone controllers below

export async function likeRoadmap(req: RequestWithSession, res: Response) {
  const roadmapId = req.params.roadmapId;
  const userId = req.session?.userId;

  if (!userId) return responseServerError(res);
  if (!roadmapId) return responseServerError(res);

  const db = new Database();

  const likeEntry = await getRoadmapLike(db, userId, BigInt(roadmapId));

  if (likeEntry === null) {
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

  if (likeEntry === null) return responseServerError(res);
  if (likeEntry.value == 1) return responseRoadmapAlreadyLiked(res);

  likeEntry.set({ value: 1 });

  if (await updateRoadmapLike(db, likeEntry.id, likeEntry))
    return responseRoadmapRated(res);

  return responseServerError(res);
}

export async function dislikeRoadmap(req: RequestWithSession, res: Response) {
  const roadmapId = req.params.roadmapId;
  const userId = req.session?.userId;

  if (!userId) return responseServerError(res);
  if (!roadmapId) return responseServerError(res);

  const db = new Database();

  const liked = await getRoadmapLike(db, userId, BigInt(roadmapId));

  if (liked === null) {
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

  if (liked === null) return responseServerError(res);
  if (liked.value == -1) return responseRoadmapAlreadyDisliked(res);

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

  const liked = await getRoadmapLike(db, userId, BigInt(roadmapId));

  if (liked == null) return responseRoadmapNotRated(res);

  if (await deleteRoadmapLike(db, liked)) return responseRoadmapUnrated(res);

  return responseServerError(res);
}

export async function updateProgressDataRoadmap(
  req: RequestWithBody,
  res: Response,
) {
  const roadmapId = req.params.roadmapId;
  const userId = req.session?.userId;

  const { data } = req.body;

  if (!userId) return responseServerError(res);
  if (!roadmapId) return responseServerError(res);
  if (!data) return responseServerError(res);

  const db = new Database();

  const roadmap = await getRoadmapObject(db, BigInt(roadmapId));

  if (roadmap === null) return responseRoadmapNotFound(res);

  const progress = await getRoadmapProgress(db, userId, BigInt(roadmapId));

  if (progress === null) {
    if (
      (await insertRoadmapProgress(
        db,
        new RoadmapProgress({
          userId,
          roadmapId: BigInt(roadmapId),
          data: data as string,
        }),
      )) !== -1n
    )
      return responseRoadmapProgressUpdated(res);
  } else {
    progress.set({ data: data as string });

    if (await updateRoadmapProgress(db, progress.id, progress))
      return responseRoadmapProgressUpdated(res);
  }

  return responseServerError(res);
}
