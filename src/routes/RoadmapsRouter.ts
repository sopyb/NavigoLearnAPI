import Paths from '@src/constants/Paths';
import { Router } from 'express';
import GetRouter from '@src/routes/roadmapsRoutes/RoadmapsGet';
import UpdateRouter from '@src/routes/roadmapsRoutes/RoadmapsUpdate';
import validateSession from '@src/middleware/validators/validateSession';
import {
  createRoadmap,
  deleteRoadmap,
} from '@src/controllers/roadmapController';
import validateBody from '@src/middleware/validators/validateBody';

const RoadmapsRouter = Router();

RoadmapsRouter.post(
  Paths.Roadmaps.Create,
  validateSession,
  validateBody(
    'name',
    'description',
    'data',
    'isPublic',
    'isDraft',
    'version',
    'miscData',
  ),
  createRoadmap,
);

RoadmapsRouter.use(Paths.Roadmaps.Get.Base, GetRouter);
RoadmapsRouter.use(Paths.Roadmaps.Update.Base, UpdateRouter);

RoadmapsRouter.delete(Paths.Roadmaps.Delete, validateSession, deleteRoadmap);
export default RoadmapsRouter;
