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
import RoadmapsRouter from '@src/routes/RoadmapsRouter';

const RoadmapsUpdate = Router({ mergeParams: true });

RoadmapsUpdate.post('*', validateSession);

// ! Owner only
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

// ! Everyone

RoadmapsRouter.get(Paths.Roadmaps.Update.Like, likeRoadmap);
RoadmapsRouter.get(Paths.Roadmaps.Update.Dislike, dislikeRoadmap);

RoadmapsRouter.delete(Paths.Roadmaps.Update.Like, removeLikeRoadmap);
RoadmapsRouter.delete(Paths.Roadmaps.Update.Dislike, removeLikeRoadmap);

RoadmapsUpdate.post(
  Paths.Roadmaps.Update.Progress,
  validateBody('data'),
  updateProgressDataRoadmap,
);

export default RoadmapsUpdate;
