import { Router } from 'express';
import Paths from '@src/routes/constants/Paths';
import { RequestWithSession } from '@src/middleware/session';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import DatabaseDriver from '@src/util/DatabaseDriver';
import User from '@src/models/User';
import { IUserInfo } from '@src/models/UserInfo';
import { Roadmap } from '@src/models/Roadmap';
import { Issue } from '@src/models/Issue';
import { Follower } from '@src/models/Follower';

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
    const roadmapsCount =
      await db.countWhere('roadmaps', 'userId', userId);
    const issueCount =
      await db.countWhere('issues', 'userId', userId);
    const followerCount =
      await db.countWhere('followers', 'userId', userId);
    const followingCount =
      await db.countWhere('followers', 'followerId', userId);

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
      roadmapsCount: roadmapsCount,
      issueCount: issueCount,
      followerCount: followerCount,
      followingCount: followingCount,
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

UsersGet.get(Paths.Users.Get.UserRoadmaps,
  async (req: RequestWithSession, res) => {
    const userId = getUserId(req);

    if (userId === undefined)
      return res.status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No user specified' });

    const db = new DatabaseDriver();

    const roadmaps =
      await db.getAllWhere<Roadmap>('roadmaps', 'userId', userId);

    res.status(HttpStatusCodes.OK).json({
      type: 'roadmaps',
      userId: userId.toString(),
      roadmaps: roadmaps,
    });
  });

UsersGet.get(Paths.Users.Get.UserIssues,
  async (req: RequestWithSession, res) => {
    const userId = getUserId(req);

    if (userId === undefined)
      return res.status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No user specified' });

    const db = new DatabaseDriver();

    const issues =
      await db.getAllWhere<Issue>('issues', 'userId', userId);

    res.status(HttpStatusCodes.OK).json({
      type: 'issues',
      userId: userId.toString(),
      issues: issues,
    });
  });

UsersGet.get(Paths.Users.Get.UserFollowers,
  async (req: RequestWithSession, res) => {
    const userId = getUserId(req);

    if (userId === undefined)
      return res.status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No user specified' });

    const db = new DatabaseDriver();

    const followers =
      await db.getAllWhere<Follower>('followers', 'userId', userId);

    res.status(HttpStatusCodes.OK).json({
      type: 'followers',
      userId: userId.toString(),
      followers: followers,
    });
  });

UsersGet.get(Paths.Users.Get.UserFollowing,
  async (req: RequestWithSession, res) => {
    const userId = getUserId(req);

    if (userId === undefined)
      return res.status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No user specified' });

    const db = new DatabaseDriver();

    const following =
      await db.getAllWhere<Follower>('followers', 'followerId', userId);

    res.status(HttpStatusCodes.OK).json({
      type: 'following',
      userId: userId.toString(),
      following: following,
    });
  });

UsersGet.get(Paths.Users.Get.RoadmapCount,
  async (req: RequestWithSession, res) => {
    const userId = getUserId(req);

    if (userId === undefined)
      return res.status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No user specified' });

    // get database
    const db = new DatabaseDriver();

    // get roadmap count
    const roadmapCount = await db.countWhere('roadmaps', 'userId', userId);

    res.status(HttpStatusCodes.OK).json({
      type: 'roadmapCount',
      userId: userId.toString(),
      roadmapCount: roadmapCount,
    });
  });

UsersGet.get(Paths.Users.Get.IssueCount,
  async (req: RequestWithSession, res) => {
    const userId = getUserId(req);

    if (userId === undefined)
      return res.status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No user specified' });

    // get database
    const db = new DatabaseDriver();

    // get issue count
    const issueCount = await db.countWhere('issues', 'userId', userId);

    res.status(HttpStatusCodes.OK).json({
      type: 'issueCount',
      userId: userId.toString(),
      issueCount: issueCount,
    });
  });

UsersGet.get(Paths.Users.Get.FollowerCount,
  async (req: RequestWithSession, res) => {
    const userId = getUserId(req);

    if (userId === undefined)
      return res.status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No user specified' });

    // get database
    const db = new DatabaseDriver();

    // get follower count
    const followerCount = await db.countWhere('followers', 'userId', userId);

    res.status(HttpStatusCodes.OK).json({
      type: 'followerCount',
      userId: userId.toString(),
      followerCount: followerCount,
    });
  });

UsersGet.get(Paths.Users.Get.FollowingCount,
  async (req: RequestWithSession, res) => {
    const userId = getUserId(req);

    if (userId === undefined)
      return res.status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No user specified' });

    // get database
    const db = new DatabaseDriver();

    // get the following count
    const followingCount =
      await db.countWhere('followers', 'followerId', userId);

    res.status(HttpStatusCodes.OK).json({
      type: 'followingCount',
      userId: userId.toString(),
      followingCount: followingCount,
    });
  });
export default UsersGet;