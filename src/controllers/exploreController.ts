import {
  RequestWithSearchParameters,
} from '@src/middleware/validators/validateSearchParameters';
import { Response } from 'express';
import { ExploreDB } from '@src/util/Database/ExploreDB';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { ResRoadmap } from '@src/types/response/ResRoadmap';

function responseSearchRoadmaps(
  res: Response,
  roadmaps: ResRoadmap[],
): unknown {
  return res.status(HttpStatusCodes.OK).json({
    success: true,
    message: `Roadmaps ${roadmaps.length ? '' : 'not '}found`,
    data: roadmaps,
  });
}

export async function searchRoadmaps(
  req: RequestWithSearchParameters,
  res: Response,
): Promise<unknown> {
  const db = new ExploreDB();

  const roadmaps = await db.getRoadmaps(req, req.session?.userId);

  return responseSearchRoadmaps(res, roadmaps);
}
