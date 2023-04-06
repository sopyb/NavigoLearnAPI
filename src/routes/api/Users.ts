import { Router } from 'express';
import Paths from '@src/routes/constants/Paths';
import { RequestWithSession } from '@src/middleware/session';
import DatabaseDriver from '@src/util/DatabaseDriver';
import User from '@src/models/User';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { IUserInfo } from '@src/models/UserInfo';
import logger from "jet-logger";

const UsersRouter = Router();

// Paths.Users.Get parse argument
UsersRouter.get(Paths.Users.Get, async (req: RequestWithSession, res) => {
  // get :userId? from req.params
  let query: string = req.params.userId;
  logger.info(query)

  const [ userIdStr, type ] = query.split('/');
  logger.info(userIdStr)
  logger.info(type)

  let userId = userIdStr ? BigInt(userIdStr) : undefined;
  logger.info(userId)

  if (userId === undefined) {
    // get userId from session
    userId = req?.session?.userId;

    if (userId === undefined) {
      // send error json
      res.status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No user specified' });
      return;
    }
  }

  // get database
  const db = new DatabaseDriver();

  // get user from database
  const user = await db.get<User>('users', userId);
  const userInfo =
    await db.getObjByKey<IUserInfo>('userInfo', 'userId', userId);

  if (!user && !userInfo) {
    res.status(HttpStatusCodes.NOT_FOUND).json({ error: 'User not found' });
    return;
  } else if (!!user && !userInfo) {
    res.status(HttpStatusCodes.OK).json({
        type: 'partial/'+ (type ?? 'all'),
        name: user.name,
        userId: user.id.toString(),
        githubLink: !!user.githubId,
        googleLink: !!user.googleId,
      });
    return;
  }

  if (!!user && !!userInfo)
    if (type === 'min') {
      res.status(HttpStatusCodes.OK).json({
        type: 'partial/min',
        name: user.name,
        profilePictureUrl: userInfo.profilePictureUrl,
        userId: user.id.toString(),
        githubLink: !!user.githubId,
        googleLink: !!user.googleId,
      });
    } else res.status(HttpStatusCodes.OK).json({
        type: 'full/all',
        name: user.name,
        profilePictureUrl: userInfo.profilePictureUrl,
        userId: user.id.toString(),
        bio: userInfo.bio,
        quote: userInfo.quote,
        blogUrl: userInfo.blogUrl,
        websiteUrl: userInfo.websiteUrl,
        githubUrl: userInfo.githubUrl,
        githubLink: !!user.githubId,
        googleLink: !!user.googleId,
      });

  // internal server error if we get here
  res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
    error: 'Internal server error',
  });
});

export default UsersRouter;