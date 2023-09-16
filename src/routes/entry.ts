import { Router } from 'express';
import Paths from '@src/constants/Paths';
import AuthRouter from '@src/routes/AuthRouter';
import RoadmapsRouter from '@src/routes/RoadmapsRouter';
import UsersRouter from '@src/routes/UsersRouter';
import SearchRouter from '@src/routes/SearchRouter';
import NotificationsRouter from '@src/routes/NotificationsRouter';

const BaseRouter = Router();

// Import all routes at base path
const { Auth, Notifications, Roadmaps, Search, Users } = Paths;

// Auth routes
BaseRouter.use(Auth.Base, AuthRouter);

// Notifications routes
BaseRouter.use(Notifications.Base, NotificationsRouter);

// Roadmaps routes
BaseRouter.use(Roadmaps.Base, RoadmapsRouter);

// Search routes
BaseRouter.use(Search.Base, SearchRouter);

// Users routes
BaseRouter.use(Users.Base, UsersRouter);

export default BaseRouter;
