import { Router } from 'express';
import Paths from '@src/constants/Paths';
import validateSession from '@src/middleware/validators/validateSession';
import validateBody from '@src/middleware/validators/validateBody';
import {
  dislikeRoadmap,
  likeRoadmap, removeLikeRoadmap,
  updateAboutRoadmap,
  updateAllRoadmap,
  updateDataRoadmap,
  updateDescriptionRoadmap,
  updateIsDraftRoadmap,
  updateMiscDataRoadmap,
  updateNameRoadmap, updateProgressDataRoadmap,
  updateTopicRoadmap, updateVersionRoadmap,
} from '@src/controllers/roadmapController';
import {
  validateRoadmapIsProfane, validateRoadmapDescription, validateRoadmapTitle,
} from '@src/middleware/validators/validateRoadmapIsProfane';

const RoadmapsUpdate = Router({ mergeParams: true });

RoadmapsUpdate.all('*', validateSession);

// ! Owner only
RoadmapsUpdate.post(
  Paths.Roadmaps.Update.All,
  validateBody('name', 'description', 'data', 'topic', 'miscData'),
  validateRoadmapTitle,
  validateRoadmapDescription,
  validateRoadmapIsProfane,
  updateAllRoadmap,
);

RoadmapsUpdate.post(
  Paths.Roadmaps.Update.About,
  validateBody('name', 'description', 'topic', 'miscData'),
  validateRoadmapTitle,
  validateRoadmapDescription,
  updateAboutRoadmap,
);

RoadmapsUpdate.post(
  Paths.Roadmaps.Update.Name,
  validateBody('name'),
  validateRoadmapTitle,
  updateNameRoadmap,
);

RoadmapsUpdate.post(
  Paths.Roadmaps.Update.Description,
  validateBody('description'),
  validateRoadmapDescription,
  updateDescriptionRoadmap,
);

RoadmapsUpdate.post(
  Paths.Roadmaps.Update.Data,
  validateBody('data'),
  validateRoadmapIsProfane,
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

// ! Everyone

RoadmapsUpdate.get(Paths.Roadmaps.Update.Like, likeRoadmap);
RoadmapsUpdate.get(Paths.Roadmaps.Update.Dislike, dislikeRoadmap);

RoadmapsUpdate.delete(Paths.Roadmaps.Update.Like, removeLikeRoadmap);
RoadmapsUpdate.delete(Paths.Roadmaps.Update.Dislike, removeLikeRoadmap);

RoadmapsUpdate.post(
  Paths.Roadmaps.Update.Progress,
  validateBody('data'),
  updateProgressDataRoadmap,
);

export default RoadmapsUpdate;
