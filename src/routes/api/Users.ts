import { Router } from 'express';
import Paths from '@src/routes/constants/Paths';
import UsersGet from '@src/routes/api/Users/Get';

const UsersRouter = Router();

UsersRouter.use(Paths.Users.Get.Base, UsersGet);

export default UsersRouter;