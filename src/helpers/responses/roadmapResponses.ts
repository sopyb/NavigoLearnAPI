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
