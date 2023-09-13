import { Router } from 'express';
import Paths from '@src/constants/Paths';
import validateSearchParameters
  from '@src/middleware/validators/validateSearchParameters';
import {
  feelingLuckyRoadmap,
  searchRoadmaps,
} from '@src/controllers/searchController';

const SearchRouter = Router();

SearchRouter.get(
  Paths.Search.Roadmaps,
  validateSearchParameters,
  searchRoadmaps,
);

SearchRouter.get(
  Paths.Search.FeelingLucky,
  feelingLuckyRoadmap,
);

export default SearchRouter;
