import { Router } from 'express';
import Paths from '@src/routes/constants/Paths';
import AuthRouter from '@src/routes/api/Auth';
import UsersRouter from '@src/routes/api/Users';

const BaseRouter = Router();

// Import all routes at base path
const { Auth, Explore, Roadmaps, Users } = Paths;

// Auth routes
BaseRouter.use(Auth.Base, AuthRouter);

// Explore routes
// ...

// Roadmaps routes
// ...

// Users routes
BaseRouter.use(Users.Base, UsersRouter);

export default BaseRouter;