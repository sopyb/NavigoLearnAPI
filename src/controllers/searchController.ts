import {
  RequestWithSearchParameters,
} from '@src/middleware/validators/validateSearchParameters';
import { Request, Response } from 'express';
import { ExploreDB } from '@src/util/Database/ExploreDB';
import {
  responseFeelingLucky,
  responseSearchRoadmaps,
} from '@src/helpers/responses/searchResponses';
import {
  responseRoadmapNotFound,
} from '@src/helpers/responses/roadmapResponses';

export async function searchRoadmaps(
  req: RequestWithSearchParameters,
  res: Response,
): Promise<unknown> {
  const db = new ExploreDB();

  const roadmaps = await db.getRoadmaps(req, req.session?.userId);

  return responseSearchRoadmaps(res, roadmaps.result, roadmaps.totalRoadmaps);
}

export async function feelingLuckyRoadmap(
  req: Request,
  res: Response,
): Promise<unknown> {
  const db = new ExploreDB();

  const roadmap = await db.getRandomRoadmapId();
  
  if (!roadmap)
    return responseRoadmapNotFound(res);

  return responseFeelingLucky(res, roadmap);
}