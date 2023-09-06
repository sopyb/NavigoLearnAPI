import { RequestWithSession } from '@src/middleware/session';
import { Response } from 'express';
import { responseServerError } from '@src/helpers/responses/generalResponses';
import Database from '@src/util/DatabaseDriver';
import { RoadmapLike } from '@src/types/models/RoadmapLike';
import {
  responseRoadmapAlreadyLiked,
  responseRoadmapRated,
} from '@src/helpers/responses/roadmapResponses';
import {
  getRoadmapLike,
  insertRoadmapLike,
  updateRoadmapLike,
} from '@src/helpers/databaseManagement';

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

  if (!liked) return responseServerError(res);

  if (await db.delete('roadmapLikes', liked.id))
    return responseRoadmapRated(res);

  return responseServerError(res);
}
