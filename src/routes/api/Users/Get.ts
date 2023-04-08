import { Router } from 'express';
import Paths from '@src/routes/constants/Paths';
import { RequestWithSession } from '@src/middleware/session';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import DatabaseDriver from '@src/util/DatabaseDriver';
import User from '@src/models/User';
import { IUserInfo } from '@src/models/UserInfo';

// ! What would I do without StackOverflow?
// ! https://stackoverflow.com/a/60848873
const UsersGet = Router({ mergeParams: true });

function getUserId(req: RequestWithSession): bigint | undefined {

  // get :userId? from req.params
  const query: string = req.params.userId;

  let userId = query ? BigInt(query) : undefined;

  if (userId === undefined) {
    // get userId from session
    userId = req?.session?.userId;
  }

  return userId;
}

UsersGet.get(Paths.Users.Get.Profile,
  async (req: RequestWithSession, res) => {
    // get userId from request
    const userId = getUserId(req);

    if (userId === undefined)
      // send error json
      return res.status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No user specified' });

    // get database
    const db = new DatabaseDriver();

    // get user from database
    const user = await db.get<User>('users', userId);
    const userInfo =
      await db.getWhere<IUserInfo>('userInfo', 'userId', userId);

    if (!user || !userInfo) {
      res.status(HttpStatusCodes.NOT_FOUND).json({ error: 'User not found' });
      return;
    }

    res.status(HttpStatusCodes.OK).json({
      type: 'profile',
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

UsersGet.get(Paths.Users.Get.MiniProfile,
  async (req: RequestWithSession, res) => {
    const userId = getUserId(req);

    if (userId === undefined)
      return res.status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No user specified' });

    const db = new DatabaseDriver();

    const user = await db.get<User>('users', userId);
    const userInfo =
      await db.getWhere<IUserInfo>('userInfo', 'userId', userId);

    if (!user || !userInfo) {
      res.status(HttpStatusCodes.NOT_FOUND).json({ error: 'User not found' });
      return;
    }

    res.status(HttpStatusCodes.OK).json({
      type: 'mini',
      name: user.name,
      profilePictureUrl: userInfo.profilePictureUrl,
      userId: user.id.toString(),
    });

    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'Internal server error',
    });
  });

// UsersGet.get(Paths.Users.Get.RoadmapCount,
export default UsersGet;