import { Router } from 'express';
import Paths from '@src/constants/Paths';
import validateSearchParameters
  from '@src/middleware/validators/validateSearchParameters';
import { searchRoadmaps } from '@src/controllers/searchController';

const SearchRouter = Router();

SearchRouter.get(
  Paths.Search.Roadmaps,
  validateSearchParameters,
  searchRoadmaps,
);

export default SearchRouter;
