import { Router } from 'express';
import Paths from '@src/routes/constants/Paths';
import AuthRouter from '@src/routes/api/AuthRouter';
import RoadmapsRouter from '@src/routes/api/RoadmapsRouter';
import UsersRouter from '@src/routes/api/UsersRouter';
import ExploreRouter from '@src/routes/api/ExploreRouter';

const BaseRouter = Router();

// Import all routes at base path
const { Auth, Explore, Roadmaps, Users } = Paths;

// Auth routes
BaseRouter.use(Auth.Base, AuthRouter);

// Explore routes
BaseRouter.use(Explore.Base, ExploreRouter);

// Roadmaps routes
BaseRouter.use(Roadmaps.Base, RoadmapsRouter);

// Users routes
BaseRouter.use(Users.Base, UsersRouter);

export default BaseRouter;