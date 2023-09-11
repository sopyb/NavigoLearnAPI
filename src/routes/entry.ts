import { Router } from 'express';
import Paths from '@src/constants/Paths';
import AuthRouter from '@src/routes/AuthRouter';
import RoadmapsRouter from '@src/routes/RoadmapsRouter';
import UsersRouter from '@src/routes/UsersRouter';
import SearchRouter from '@src/routes/SearchRouter';

const BaseRouter = Router();

// Import all routes at base path
const { Auth, Search, Roadmaps, Users } = Paths;

// Auth routes
BaseRouter.use(Auth.Base, AuthRouter);

// Search routes
BaseRouter.use(Search.Base, SearchRouter);

// Roadmaps routes
BaseRouter.use(Roadmaps.Base, RoadmapsRouter);

// Users routes
BaseRouter.use(Users.Base, UsersRouter);

export default BaseRouter;
