import { Router } from 'express';
import Paths from '@src/constants/Paths';
import { RequestWithSession } from '@src/middleware/session';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import DatabaseDriver from '@src/util/DatabaseDriver';
import { Follower } from '@src/types/models/Follower';
import validateSession from '@src/validators/validateSession';
import validateUser from '@src/validators/validateUser';
import {
  userGetRoadmaps,
  usersGetMiniProfile,
  usersGetProfile,
} from '@src/controllers/usersController';

// ! What would I do without StackOverflow?
// ! https://stackoverflow.com/a/60848873
const UsersGet = Router({ mergeParams: true, strict: true });

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

UsersGet.get(Paths.Users.Get.Profile, validateUser(), usersGetProfile);

UsersGet.get(Paths.Users.Get.MiniProfile, validateUser(), usersGetMiniProfile);

UsersGet.get(Paths.Users.Get.UserRoadmaps, validateUser(), userGetRoadmaps);

UsersGet.get(
  Paths.Users.Get.UserFollowers,
  async (req: RequestWithSession, res) => {
    const userId = getUserId(req);

    if (userId === undefined)
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No user specified' });

    const db = new DatabaseDriver();

    const followers = await db.getAllWhere<Follower>(
      'followers',
      'userId',
      userId,
    );

    res.status(HttpStatusCodes.OK).json(
      JSON.stringify(
        {
          type: 'followers',
          userId: userId.toString(),
          followers: followers,
        },
        (_, value) => {
          if (typeof value === 'bigint') {
            return value.toString();
          }
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return value;
        },
      ),
    );
  },
);

UsersGet.get(
  Paths.Users.Get.UserFollowing,
  async (req: RequestWithSession, res) => {
    const userId = getUserId(req);

    if (userId === undefined)
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No user specified' });

    const db = new DatabaseDriver();

    const following = await db.getAllWhere<Follower>(
      'followers',
      'followerId',
      userId,
    );

    res.status(HttpStatusCodes.OK).json(
      JSON.stringify(
        {
          type: 'following',
          userId: userId.toString(),
          following: following,
        },
        (_, value) => {
          if (typeof value === 'bigint') {
            return value.toString();
          }
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return value;
        },
      ),
    );
  },
);

UsersGet.get(Paths.Users.Get.Follow, validateSession);
UsersGet.get(Paths.Users.Get.Follow, async (req: RequestWithSession, res) => {
  // get the target userDisplay id
  const userId = BigInt(req.params.userId || -1);

  // get the current userDisplay id
  const followerId = req.session?.userId;

  if (userId === followerId)
    return res
      .status(HttpStatusCodes.FORBIDDEN)
      .json({ error: 'Cannot follow  yourself' });

  // if either of the ids are undefined, return a bad request
  if (!followerId || !userId || userId < 0)
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: 'No userDisplay specified' });

  // get database
  const db = new DatabaseDriver();

  // check if the userDisplay is already following the target userDisplay
  const following = await db.getWhere<Follower>(
    'followers',
    'followerId',
    followerId,
    'userId',
    userId,
  );

  if (following)
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: 'Already following' });

  // create a new follower
  const follower = new Follower({ followerId, userId });

  // insert the follower into the database
  const insert = await db.insert('followers', follower);

  // if the insert was successful, return the follower
  if (insert >= 0) {
    return res.status(HttpStatusCodes.OK).json({
      type: 'follow',
      follower: {
        id: insert.toString(),
        followerId: follower.followerId.toString(),
        userId: follower.userId.toString(),
      },
    });
  }

  // otherwise, return an error
  return res
    .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
    .json({ error: 'Failed to follow' });
});

UsersGet.delete(Paths.Users.Get.Follow, validateSession);
UsersGet.delete(
  Paths.Users.Get.Follow,
  async (req: RequestWithSession, res) => {
    // get the target userDisplay id
    const userId = BigInt(req.params.userId || -1);

    // get the current userDisplay id
    const followerId = req.session?.userId;

    if (userId === followerId)
      return res
        .status(HttpStatusCodes.FORBIDDEN)
        .json({ error: 'Cannot unfollow yourself' });

    // if either of the ids are undefined, return a bad request
    if (!followerId || !userId)
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No userDisplay specified' });

    // get database
    const db = new DatabaseDriver();

    // check if the userDisplay is already following the target userDisplay
    const following = await db.getWhere<Follower>(
      'followers',
      'followerId',
      followerId,
      'userId',
      userId,
    );

    if (!following)
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'Not following' });

    // delete the follower from the database
    const deleted = await db.delete('followers', following.id);

    // if the delete was successful, return the follower
    if (deleted) {
      return res.status(HttpStatusCodes.OK).json({
        type: 'unfollow',
        follower: {
          followerId: followerId.toString(),
          userId: userId.toString(),
        },
      });
    }

    // otherwise, return an error
    return res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Failed to unfollow' });
  },
);

export default UsersGet;
