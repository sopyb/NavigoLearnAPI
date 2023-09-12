import { Router } from 'express';
import Paths from '@src/constants/Paths';
import validateSession from '@src/middleware/validators/validateSession';
import validateBody from '@src/middleware/validators/validateBody';
import {
  updateAboutRoadmap,
  updateAllRoadmap,
  updateDataRoadmap,
  updateDescriptionRoadmap,
  updateIsDraftRoadmap,
  updateMiscDataRoadmap,
  updateNameRoadmap,
  updateTopicRoadmap, updateVersionRoadmap,
} from '@src/controllers/roadmapController';

const RoadmapsUpdate = Router({ mergeParams: true });

RoadmapsUpdate.post('*', validateSession);

RoadmapsUpdate.post(
  Paths.Roadmaps.Update.All,
  validateBody('name', 'description', 'data', 'topic', 'miscData', 'isDraft'),
  updateAllRoadmap,
);

RoadmapsUpdate.post(
  Paths.Roadmaps.Update.About,
  validateBody('name', 'description', 'topic', 'miscData'),
  updateAboutRoadmap,
);

RoadmapsUpdate.post(
  Paths.Roadmaps.Update.Name,
  validateBody('name'),
  updateNameRoadmap,
);

RoadmapsUpdate.post(
  Paths.Roadmaps.Update.Description,
  validateBody('description'),
  updateDescriptionRoadmap,
);

RoadmapsUpdate.post(
  Paths.Roadmaps.Update.Data,
  validateBody('data'),
  updateDataRoadmap,
);

RoadmapsUpdate.post(
  Paths.Roadmaps.Update.Topic,
  validateBody('topic'),
  updateTopicRoadmap,
);

RoadmapsUpdate.post(
  Paths.Roadmaps.Update.Draft,
  validateBody('isDraft'),
  updateIsDraftRoadmap,
);

RoadmapsUpdate.post(
  Paths.Roadmaps.Update.MiscData,
  validateBody('miscData'),
  updateMiscDataRoadmap,
);

RoadmapsUpdate.post(
  Paths.Roadmaps.Update.Version,
  validateBody('version'),
  updateVersionRoadmap,
);

export default RoadmapsUpdate;
