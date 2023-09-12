import { Router } from 'express';
import Paths from '@src/constants/Paths';
import validateSearchParameters
  from '@src/middleware/validators/validateSearchParameters';
import { searchRoadmaps } from '@src/controllers/exploreController';

const SearchRouter = Router();

SearchRouter.get(
  Paths.Search.Roadmaps,
  validateSearchParameters,
  searchRoadmaps,
);

export default SearchRouter;
