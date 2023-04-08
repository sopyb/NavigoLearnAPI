import { Router } from 'express';
import Paths from '@src/routes/constants/Paths';
import UsersGet from '@src/routes/api/Users/Get';
import {
  RequestWithSession,
  requireSessionMiddleware,
} from '@src/middleware/session';
import DatabaseDriver from '@src/util/DatabaseDriver';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';

const UsersRouter = Router();

// Get routes
UsersRouter.use(Paths.Users.Get.Base, UsersGet);

// Post routes
// ...
// TODO

// Delete route - delete user - requires session
UsersRouter.delete(Paths.Users.Get.Profile, requireSessionMiddleware);
UsersRouter.delete(Paths.Users.Delete,
  async (req: RequestWithSession, res) => {
    // get database
    const db = new DatabaseDriver();

    // get userId from request
    const userId = req.session?.userId;

    if (userId === undefined) {
      // send error json
      return res.status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No user specified' });
    }

    // delete user from database
    const success = await db.delete('users', userId);

    if (success) {
      // send success json
      return res.status(HttpStatusCodes.OK).json({ success: true });
    } else {
      // send error json
      return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to delete user' });
    }
  });

export default UsersRouter;