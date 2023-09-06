import {
  RequestWithSearchParameters,
} from '@src/middleware/validators/validateSearchParameters';
import { Response } from 'express';
import { ExploreDB, SearchRoadmap } from '@src/util/ExploreDB';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';

function responseSearchRoadmaps(
  res: Response,
  roadmaps: SearchRoadmap[],
): unknown {
  return res.status(HttpStatusCodes.OK).json({
    success: true,
    message: 'Roadmaps found',
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
