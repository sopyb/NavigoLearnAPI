import { Router } from 'express';
import Paths from '@src/constants/Paths';
import {
  getProgressDataRoadmap,
  getRoadmap,
} from '@src/controllers/roadmapController';
import validateSession from '@src/middleware/validators/validateSession';

const RoadmapsGet = Router({ mergeParams: true });

RoadmapsGet.get(Paths.Roadmaps.Get.Roadmap, getRoadmap);

RoadmapsGet.get(
  Paths.Roadmaps.Get.Progress,
  validateSession,
  getProgressDataRoadmap,
);

export default RoadmapsGet;
