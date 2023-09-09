import { Router } from 'express';
import Paths from '@src/constants/Paths';
import validateSession from '@src/middleware/validators/validateSession';
import validateBody from '@src/middleware/validators/validateBody';
import {
  updateAboutRoadmap,
  updateAllRoadmap,
  updateDataRoadmap,
  updateDescriptionRoadmap,
  updateIsDraftRoadmap, updateMiscDataRoadmap,
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


RoadmapsUpdate.post(
  Paths.Roadmaps.Update.MiscData,
  validateSession,
  validateBody('miscData'),
  updateMiscDataRoadmap,
);

RoadmapsUpdate.post(
  Paths.Roadmaps.Update.About,
  validateSession,
  validateBody('name', 'description', 'topic', 'miscData'),
  updateAboutRoadmap,
);




export default RoadmapsUpdate;
