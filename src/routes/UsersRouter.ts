import { Router } from 'express';
import Paths from '@src/constants/Paths';
import validateSession from '@src/validators/validateSession';
import UsersGet from '@src/routes/usersRoutes/UsersGet';
import UsersUpdate from '@src/routes/usersRoutes/UsersUpdate';
import { usersDelete } from '@src/controllers/usersController';

const UsersRouter = Router();

// Get and Update routes
UsersRouter.use(Paths.Users.Get.Base, UsersGet);
UsersRouter.use(Paths.Users.Update.Base, UsersUpdate);

// Delete route - delete user - requires session
UsersRouter.delete(Paths.Users.Delete, validateSession, usersDelete);

export default UsersRouter;
