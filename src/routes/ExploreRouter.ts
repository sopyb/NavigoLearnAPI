import { Router } from 'express';
import Paths from '@src/constants/Paths';
import validateSearchParameters
  from '@src/middleware/validators/validateSearchParameters';
import { searchRoadmaps } from '@src/controllers/exploreController';

const ExploreRouter = Router();

ExploreRouter.get(
  Paths.Explore.Search.Base + Paths.Explore.Search.Roadmaps,
  validateSearchParameters,
  searchRoadmaps,
);

export default ExploreRouter;
