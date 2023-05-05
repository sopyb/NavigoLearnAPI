import { Router } from 'express';
import Paths from '@src/routes/constants/Paths';
import {
  RequestWithSession,
  requireSessionMiddleware,
} from '@src/middleware/session';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import DatabaseDriver from '@src/util/DatabaseDriver';
import User from '@src/models/User';
import { IUserInfo } from '@src/models/UserInfo';
import { Roadmap, RoadmapMini } from '@src/models/Roadmap';
import { Issue } from '@src/models/Issue';
import { Follower } from '@src/models/Follower';
import * as console from 'console';

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

UsersGet.get(Paths.Users.Get.Profile, async (req: RequestWithSession, res) => {
  // get userId from request
  const userId = getUserId(req);

  if (userId === undefined)
    // send error json
    return res
      .status(HttpStatusCodes.NOT_FOUND)
      .json({ error: 'User not found' });

  // get database
  const db = new DatabaseDriver();

  // get user from database
  const user = await db.get<User>('users', userId);
  const userInfo = await db.getWhere<IUserInfo>('userInfo', 'userId', userId);
  const roadmapsCount = await db.countWhere('roadmaps', 'ownerId', userId);
  const issueCount = await db.countWhere('issues', 'userId', userId);
  const followerCount = await db.countWhere('followers', 'userId', userId);
  const followingCount = await db.countWhere('followers', 'followerId', userId);

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
    roadmapsCount: roadmapsCount.toString(),
    issueCount: issueCount.toString(),
    followerCount: followerCount.toString(),
    followingCount: followingCount.toString(),
    websiteUrl: userInfo.websiteUrl,
    githubUrl: userInfo.githubUrl,
    githubLink: !!user.githubId,
    googleLink: !!user.googleId,
  });
});

UsersGet.get(
  Paths.Users.Get.MiniProfile,
  async (req: RequestWithSession, res) => {
    const userId = getUserId(req);

    if (userId === undefined)
      return res
        .status(HttpStatusCodes.NOT_FOUND)
        .json({ error: 'User not found' });

    const db = new DatabaseDriver();

    const user = await db.get<User>('users', userId);
    const userInfo = await db.getWhere<IUserInfo>('userInfo', 'userId', userId);

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
  },
);

UsersGet.get(
  Paths.Users.Get.UserRoadmaps,
  async (req: RequestWithSession, res) => {
    const userId = getUserId(req);

    if (userId === undefined)
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No user specified' });

    const db = new DatabaseDriver();

    const roadmaps = await db.getAllWhere<Roadmap>(
      'roadmaps',
      'ownerId',
      userId,
    );

    if (!roadmaps) {
      res.status(HttpStatusCodes.NOT_FOUND).json({ error: 'User not found' });
      return;
    }

    // get user
    const user = await db.get<User>('users', userId);

    if (!user) {
      res.status(HttpStatusCodes.NOT_FOUND).json({ error: 'User not found' });
      return;
    }

    // get Like count
    const likes = await db.countWhere('roadmapLikes', 'userId', userId);

    const parsedRoadmaps: RoadmapMini[] = [];

    // convert roadmaps to RoadmapMini
    for(let i = 0; i < roadmaps.length; i++) {
      const roadmap = roadmaps[i];
      parsedRoadmaps[i] = {
        id: roadmap.id.toString(),
        name: roadmap.name,
        description: roadmap.description,
        likes: likes.toString(),
        ownerName: user.name,
        ownerId: roadmap.ownerId.toString(),
      };
    }

    res.status(HttpStatusCodes.OK).json({
      type: 'roadmaps',
      userId: userId.toString(),
      roadmaps: parsedRoadmaps,
    });
  },
);

UsersGet.get(
  Paths.Users.Get.UserIssues,
  async (req: RequestWithSession, res) => {
    const userId = getUserId(req);

    if (userId === undefined)
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No user specified' });

    const db = new DatabaseDriver();

    const issues = await db.getAllWhere<Issue>('issues', 'userId', userId);

    res.status(HttpStatusCodes.OK).json({
      type: 'issues',
      userId: userId.toString(),
      issues: issues,
    });
  },
);

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

    res.status(HttpStatusCodes.OK).json({
      type: 'followers',
      userId: userId.toString(),
      followers: followers,
    });
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

    res.status(HttpStatusCodes.OK).json({
      type: 'following',
      userId: userId.toString(),
      following: following,
    });
  },
);

UsersGet.get(
  Paths.Users.Get.RoadmapCount,
  async (req: RequestWithSession, res) => {
    const userId = getUserId(req);

    if (userId === undefined)
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No user specified' });

    // get database
    const db = new DatabaseDriver();

    // get roadmap count
    const roadmapCount = await db.countWhere('roadmaps', 'ownerId', userId);

    res.status(HttpStatusCodes.OK).json({
      type: 'roadmapCount',
      userId: userId.toString(),
      roadmapCount: roadmapCount.toString(),
    });
  },
);

UsersGet.get(
  Paths.Users.Get.IssueCount,
  async (req: RequestWithSession, res) => {
    const userId = getUserId(req);

    if (userId === undefined)
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No user specified' });

    // get database
    const db = new DatabaseDriver();

    // get issue count
    const issueCount = await db.countWhere('issues', 'userId', userId);

    res.status(HttpStatusCodes.OK).json({
      type: 'issueCount',
      userId: userId.toString(),
      issueCount: issueCount.toString(),
    });
  },
);

UsersGet.get(
  Paths.Users.Get.FollowerCount,
  async (req: RequestWithSession, res) => {
    const userId = getUserId(req);

    if (userId === undefined)
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No userDisplay specified' });

    // get database
    const db = new DatabaseDriver();

    // get follower count
    const followerCount = await db.countWhere('followers', 'userId', userId);

    res.status(HttpStatusCodes.OK).json({
      type: 'followerCount',
      userId: userId.toString(),
      followerCount: followerCount.toString(),
    });
  },
);

UsersGet.get(
  Paths.Users.Get.FollowingCount,
  async (req: RequestWithSession, res) => {
    const userId = getUserId(req);

    if (userId === undefined)
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No userDisplay specified' });

    // get database
    const db = new DatabaseDriver();

    // get the following count
    const followingCount = await db.countWhere(
      'followers',
      'followerId',
      userId,
    );

    res.status(HttpStatusCodes.OK).json({
      type: 'followingCount',
      userId: userId.toString(),
      followingCount: followingCount.toString(),
    });
  },
);

UsersGet.get(Paths.Users.Get.IsFollowing, requireSessionMiddleware);
UsersGet.get(
  Paths.Users.Get.IsFollowing,
  async (req: RequestWithSession, res) => {
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
    const following = await db.getAllWhere<Follower>(
      'followers',
      'followerId',
      followerId,
    );
    console.log(following);

    if (!!following)
      if (following.some((f) => f.userId === userId)) {
        return res
          .status(HttpStatusCodes.OK)
          .json({ status: true, userId: userId.toString() });
      } else {
        return res
          .status(HttpStatusCodes.OK)
          .json({ status: false, userId: userId.toString() });
      }
    else
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'something went wrong' });
  },
);

UsersGet.get(Paths.Users.Get.Follow, requireSessionMiddleware);
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
  const following = await db.getAllWhere<Follower>(
    'followers',
    'followerId',
    followerId,
  );

  if (!!following)
    if (following.some((f) => f.userId === userId))
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'Already following' });

  // create a new follower
  const follower = new Follower(followerId, userId);

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

UsersGet.delete(Paths.Users.Get.Follow, requireSessionMiddleware);
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
    const following = await db.getAllWhere<Follower>(
      'followers',
      'followerId',
      followerId,
    );

    if (!!following)
      if (!following.some((f) => f.userId === userId))
        return res
          .status(HttpStatusCodes.BAD_REQUEST)
          .json({ error: 'Not following' });

    if (!following)
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'Not following' });

    // get the follower object to delete
    const follower = following.find((f) => f.userId === userId);

    if (!follower)
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'Not following' });

    // delete the follower from the database
    const deleted = await db.delete('followers', follower.id);

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
