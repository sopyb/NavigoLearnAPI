import { Router } from 'express';
import Paths from '@src/routes/constants/Paths';
import AuthRouter from '@src/routes/api/Auth';

const baseRouter = Router();

// Import all routes at base path
const { Base, Auth, Explore, Roadmaps, Users } = Paths;

// Auth routes
baseRouter.use(Auth.Base, AuthRouter);

// Explore routes
// ...

// Roadmaps routes
// ...

// Users routes
// ...

export default baseRouter;