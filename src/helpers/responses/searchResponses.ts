import { Response } from 'express';
import { ResRoadmap } from '@src/types/response/ResRoadmap';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { JSONSafety } from '@src/util/misc';

export function responseSearchRoadmaps(
  res: Response,
  roadmaps: ResRoadmap[],
  total: bigint,
): unknown {
  return res.status(HttpStatusCodes.OK).json(
    JSONSafety({
      success: true,
      message: `Roadmaps ${roadmaps.length ? '' : 'not '}found`,
      data: roadmaps,
      total: total,
    }),
  );
}

export function responseFeelingLucky(
  res: Response,
  roadmap: bigint,
): unknown {
  return res.status(HttpStatusCodes.OK).json(
    JSONSafety(
      {
        success: true,
        message: 'Roadmap found',
        data: roadmap,
      },
    ),
  );
}