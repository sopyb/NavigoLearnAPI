import { Router } from 'express';
import Paths from '@src/routes/constants/Paths';
import AuthRouter from '@src/routes/api/AuthRouter';
import RoadmapsRouter from '@src/routes/api/RoadmapsRouter';
import UsersRouter from '@src/routes/api/UsersRouter';

const BaseRouter = Router();

// Import all routes at base path
const { Auth, Explore, Roadmaps, Users } = Paths;

// Auth routes
BaseRouter.use(Auth.Base, AuthRouter);

// Explore routes
// ...

// Roadmaps routes
BaseRouter.use(Roadmaps.Base, RoadmapsRouter);

// Users routes
BaseRouter.use(Users.Base, UsersRouter);

export default BaseRouter;