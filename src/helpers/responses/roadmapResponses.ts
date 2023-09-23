import { Response } from 'express';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { JSONSafety } from '@src/util/misc';
import { ResRoadmap } from '@src/types/response/ResRoadmap';
import { ResFullRoadmap } from '@src/types/response/ResFullRoadmap';
import {RoadmapProgress} from '@src/types/models/RoadmapProgress';

export function responseRoadmap(res: Response, roadmap: ResFullRoadmap): void {
  res
    .status(HttpStatusCodes.OK)
    .contentType('application/json')
    .send(
      JSONSafety({
        data: roadmap,
        message: 'Roadmap found',
        success: true,
      }),
    );
}

export function responseCantPublishDraft(res: Response): void {
  res.status(HttpStatusCodes.BAD_REQUEST).json({
    message: 'Cannot publish draft that\'s unlisted for inappropriate content',
    success: false,
  });
}

export function responseRoadmapUpdated(res: Response): void {
  res.status(HttpStatusCodes.OK).json({
    message: 'Roadmap updated',
    success: true,
  });
}

export function responseRoadmapNotFound(res: Response): void {
  res.status(HttpStatusCodes.NOT_FOUND).json({
    message: 'Roadmap not found',
    success: false,
  });
}

export function responseNotAllowed(res: Response): void {
  res.status(HttpStatusCodes.METHOD_NOT_ALLOWED).json({
    message: 'Not allowed to perform this action',
    success: false,
  });
}

export function responseRoadmapCreated(res: Response, id: bigint): void {
  res.status(HttpStatusCodes.CREATED).json({
    data: { id: id.toString() },
    message: 'Roadmap created',
    success: true,
  });
}

export function responseRoadmapDeleted(res: Response): void {
  res.status(HttpStatusCodes.OK).json({
    message: 'Roadmap deleted',
    success: true,
  });
}

export function responseUserNoRoadmaps(res: Response): void {
  res
    .status(HttpStatusCodes.OK)
    .contentType('application/json')
    .send(
      JSONSafety({
        data: [],
        message: 'User has no roadmaps',
        success: true,
      }),
    );
}

export function responseUserRoadmaps(
  res: Response,
  roadmaps: ResRoadmap[],
  total: bigint,
): void {
  res
    .status(HttpStatusCodes.OK)
    .contentType('application/json')
    .send(
      JSONSafety({
        data: roadmaps,
        message: 'Roadmaps found',
        success: true,
        total: total,
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

export function responseRoadmapUnrated(res: Response) {
  return res.status(HttpStatusCodes.OK).json({
    message: 'Roadmap unrated',
    success: true,
  });
}

export function responseRoadmapProgressNotFound(res: Response) {
  return res.status(HttpStatusCodes.NOT_FOUND).json({
    message: 'Roadmap progress not found',
    success: false,
  });
}

export function responseRoadmapProgressFound(
  res: Response,
  progress: RoadmapProgress,
) {
  return res.status(HttpStatusCodes.OK).json({
    data: progress.data,
    message: 'Roadmap progress found',
    success: true,
  });
}

export function responseRoadmapProgressUpdated(res: Response) {
  return res.status(HttpStatusCodes.OK).json({
    message: 'Roadmap progress updated',
    success: true,
  });
}
