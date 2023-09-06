import { Router } from 'express';
import Paths from '@src/constants/Paths';
import validateSession from '@src/middleware/validators/validateSession';
import validateBody from '@src/middleware/validators/validateBody';
import {
  updateAllRoadmap,
  updateDataRoadmap,
  updateDescriptionRoadmap,
  updateIsDraftRoadmap,
  updateNameRoadmap,
  updateTopicRoadmap,
} from '@src/controllers/roadmapController';

const RoadmapsUpdate = Router({ mergeParams: true });

RoadmapsUpdate.post(
  Paths.Roadmaps.Update.All,
  validateSession,
  validateBody('name', 'description', 'data', 'topic', 'isDraft'),
  updateAllRoadmap,
);

RoadmapsUpdate.post(
  Paths.Roadmaps.Update.Name,
  validateSession,
  validateBody('name'),
  updateNameRoadmap,
);

RoadmapsUpdate.post(
  Paths.Roadmaps.Update.Description,
  validateSession,
  validateBody('description'),
  updateDescriptionRoadmap,
);

RoadmapsUpdate.post(
  Paths.Roadmaps.Update.Data,
  validateSession,
  validateBody('data'),
  updateDataRoadmap,
);

RoadmapsUpdate.post(
  Paths.Roadmaps.Update.Topic,
  validateSession,
  validateBody('topic'),
  updateTopicRoadmap,
);

RoadmapsUpdate.post(
  Paths.Roadmaps.Update.Draft,
  validateSession,
  validateBody('isDraft'),
  updateIsDraftRoadmap,
);

export default RoadmapsUpdate;
