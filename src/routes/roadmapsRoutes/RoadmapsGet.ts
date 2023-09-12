import { Router } from 'express';
import Paths from '@src/constants/Paths';
import { getRoadmap } from '@src/controllers/roadmapController';

const RoadmapsGet = Router({ mergeParams: true });

RoadmapsGet.get(Paths.Roadmaps.Get.Roadmap, getRoadmap);

export default RoadmapsGet;
