import { Router } from 'express';
import Paths from '@src/routes/constants/Paths';
import UsersGet from '@src/routes/api/Users/UsersGet';
import {
  RequestWithSession,
  requireSessionMiddleware,
} from '@src/middleware/session';
import DatabaseDriver from '@src/util/DatabaseDriver';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import UsersUpdate from '@src/routes/api/Users/UsersUpdate';

const UsersRouter = Router();

// Get routes
UsersRouter.use(Paths.Users.Get.Base, UsersGet);

// Update routes
UsersRouter.use(Paths.Users.Update.Base, UsersUpdate);

// Delete route - delete userDisplay - requires session
UsersRouter.delete(Paths.Users.Delete, requireSessionMiddleware);
UsersRouter.delete(Paths.Users.Delete, async (req: RequestWithSession, res) => {
  // get database
  const db = new DatabaseDriver();

  // get userId from request
  const userId = req.session?.userId;

  if (userId === undefined) {
    // send error json
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: 'No userDisplay specified' });
  }

  // delete userDisplay from database
  const success = await db.delete('users', userId);

  if (success) {
    // send success json
    return res.status(HttpStatusCodes.OK).json({ success: true });
  } else {
    // send error json
    return res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Failed to delete userDisplay' });
  }
});

export default UsersRouter;
