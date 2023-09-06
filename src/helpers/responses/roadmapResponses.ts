import { Response } from 'express';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import JSONStringify from '@src/util/JSONStringify';
import { ResRoadmap } from '@src/types/response/ResRoadmap';

export function responseUserNoRoadmaps(res: Response): void {
  res
    .status(HttpStatusCodes.OK)
    .contentType('application/json')
    .send(
      JSONStringify({
        data: [],
        message: 'User has no roadmaps',
        success: true,
      }),
    );
}

export function responseUserRoadmaps(
  res: Response,
  roadmaps: ResRoadmap[],
): void {
  res
    .status(HttpStatusCodes.OK)
    .contentType('application/json')
    .send(
      JSONStringify({
        data: roadmaps,
        message: 'Roadmaps found',
        success: true,
      }),
    );
}

export function responseRoadmapAlreadyLiked(res: Response) {
  return res.status(HttpStatusCodes.BAD_REQUEST).json({
    message: 'Already liked',
    success: false,
  });
}

export function responseRoadmapAlreadyDisliked(res: Response) {
  return res.status(HttpStatusCodes.BAD_REQUEST).json({
    message: 'Already disliked',
    success: false,
  });
}

export function responseRoadmapNotRated(res: Response) {
  return res.status(HttpStatusCodes.BAD_REQUEST).json({
    message: 'Not rated',
    success: false,
  });
}

export function responseRoadmapRated(res: Response) {
  return res.status(HttpStatusCodes.OK).json({
    message: 'Roadmap rated',
    success: true,
  });
}
