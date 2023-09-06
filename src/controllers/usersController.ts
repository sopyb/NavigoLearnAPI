import { Response } from 'express';
import { RequestWithSession } from '@src/middleware/session';
import DatabaseDriver from '@src/util/Database/DatabaseDriver';
import {
  deleteUser,
  followUser,
  getUser,
  getUserInfo,
  getUserRoadmaps,
  getUserStats,
  isUserFollowing,
  unfollowUser,
  updateUser,
  updateUserInfo,
} from '@src/helpers/databaseManagement';
import {
  RequestWithTargetUserId,
} from '@src/middleware/validators/validateUser';
import { ResRoadmap } from '@src/types/response/ResRoadmap';
import { responseServerError } from '@src/helpers/responses/generalResponses';
import {
  responseAlreadyFollowing,
  responseCantFollowYourself,
  responseProfileUpdated,
  responseUserDeleted,
  responseUserFollowed,
  responseUserMiniProfile,
  responseUserNotFound,
  responseUserProfile,
  responseUserUnfollowed,
} from '@src/helpers/responses/userResponses';
import {
  responseUserNoRoadmaps,
  responseUserRoadmaps,
} from '@src/helpers/responses/roadmapResponses';
import { addRoadmapImpression } from '@src/util/Views';
import logger from 'jet-logger';

/*
 ! Main route controllers
 */
export async function usersDelete(
  req: RequestWithSession,
  res: Response,
): Promise<unknown> {
  // get database
  const db = new DatabaseDriver();

  // get userId from request
  const userId = req.session?.userId;

  if (userId === undefined) return responseServerError(res);

  // delete user from database
  if (await deleteUser(db, userId)) return responseUserDeleted(res);

  // send error json
  return responseServerError(res);
}

/*
 ! UsersGet route controllers
 */
export async function usersGetProfile(
  req: RequestWithTargetUserId,
  res: Response,
): Promise<unknown> {
  // get database
  const db = new DatabaseDriver();

  // get userId from request
  const userId = req.targetUserId;
  const issuerUserId = req.issuerUserId;
  if (userId === undefined || issuerUserId === undefined)
    return responseServerError(res);

  // get user from database
  const user = await getUser(db, userId);
  const userInfo = await getUserInfo(db, userId);
  const stats = await getUserStats(db, userId);
  const isFollowing = await isUserFollowing(db, issuerUserId, userId);

  // check if user exists
  if (!user || !userInfo) return responseUserNotFound(res);

  // send user json
  return responseUserProfile(res, user, userInfo, stats, isFollowing);
}

export async function usersGetMiniProfile(
  req: RequestWithTargetUserId,
  res: Response,
): Promise<unknown> {
  // get database
  const db = new DatabaseDriver();

  // get userId from request
  const userId = req.targetUserId;
  if (!userId) return responseServerError(res);

  // get user from database
  const user = await getUser(db, userId);

  // check if user exists
  if (!user) return responseUserNotFound(res);

  // send user json
  return responseUserMiniProfile(res, user);
}

export async function userGetRoadmaps(
  req: RequestWithTargetUserId,
  res: Response,
): Promise<unknown> {
  // get database
  const db = new DatabaseDriver();

  // get userId from request
  const userId = req.targetUserId;
  if (!userId) return responseServerError(res);

  const user = await getUser(db, userId);

  if (!user) return responseUserNotFound(res);

  // get roadmaps from database
  const roadmaps = await getUserRoadmaps(db, userId);

  // check if user exists
  if (!roadmaps) return responseUserNoRoadmaps(res);

  const likes: bigint[] = [];
  const views: bigint[] = [];
  const isLiked: boolean[] = [];

  for (const roadmap of roadmaps) {
    likes.push(await db.countWhere('roadmapLikes', 'roadmapId', roadmap.id));
    views.push(await db.countWhere('roadmapViews', 'roadmapId', roadmap.id));
    isLiked.push(
      !!(
        await db.countWhere(
          'roadmapLikes',
          'roadmapId',
          roadmap.id,
          'userId',
          req.issuerUserId,
        )
      ),
    );
  }

  // add impressions to roadmaps
  addRoadmapImpression(
    db,
    roadmaps.map((roadmap) => roadmap.id),
    req.issuerUserId,
  ).catch((e) => logger.err(e));

  // send user json
  return responseUserRoadmaps(
    res,
    roadmaps.map(
      (roadmap, i) =>
        new ResRoadmap(roadmap, user, likes[i], views[i], isLiked[i]),
    ),
  );
}

export async function userFollow(
  req: RequestWithTargetUserId,
  res: Response,
): Promise<unknown> {
  // get database
  const db = new DatabaseDriver();

  // get userId from request
  const issuerId = req.issuerUserId;
  const targetId = req.targetUserId;
  if (!targetId || !issuerId || targetId === issuerId)
    return responseCantFollowYourself(res);

  // get user from database
  const user = await getUser(db, targetId);

  // check if user exists
  if (!user) return responseUserNotFound(res);

  // check if user is already following
  if (await isUserFollowing(db, issuerId, targetId))
    return responseAlreadyFollowing(res);

  // follow user
  await followUser(db, issuerId, targetId);

  // send user json
  return responseUserFollowed(res);
}

export async function userUnfollow(
  req: RequestWithTargetUserId,
  res: Response,
): Promise<unknown> {
  // get database
  const db = new DatabaseDriver();

  // get userId from request
  const issuerId = req.issuerUserId;
  const targetId = req.targetUserId;
  if (!targetId || !issuerId || targetId === issuerId)
    return responseCantFollowYourself(res);

  // get user from database
  const user = await getUser(db, targetId);

  // check if user exists
  if (!user) return responseUserNotFound(res);

  // check if user is already following
  if (!(await isUserFollowing(db, issuerId, targetId)))
    return responseAlreadyFollowing(res);

  // follow user
  await unfollowUser(db, issuerId, targetId);

  // send user json
  return responseUserUnfollowed(res);
}

/*
 ! UsersPost route controllers
 */
export async function usersPostProfile(
  req: RequestWithSession,
  res: Response,
): Promise<unknown> {
  // get variables
  const { name, githubUrl, websiteUrl, quote } = req.body as {
    [key: string]: string;
  };

  // get database
  const db = new DatabaseDriver();

  // get userId from request
  const userId = req.session?.userId;

  if (userId === undefined) return responseServerError(res);

  // get user from database
  const user = await getUser(db, userId);
  const userInfo = await getUserInfo(db, userId);

  // check if user exists
  if (!user || !userInfo) return responseServerError(res);

  user.set({
    name,
  });

  userInfo.set({
    githubUrl,
    websiteUrl,
    quote,
  });

  // save user to database
  if (await updateUser(db, userId, user, userInfo))
    return responseProfileUpdated(res);

  // send error json
  return responseServerError(res);
}

export async function usersPostProfileName(
  req: RequestWithSession,
  res: Response,
): Promise<unknown> {
  // get variables
  const { name } = req.body as { [key: string]: string };

  // get database
  const db = new DatabaseDriver();

  // get userId from request
  const userId = req.session?.userId;

  if (userId === undefined) return responseServerError(res);

  // get user from database
  const user = await getUser(db, userId);

  // check if user exists
  if (!user) return responseServerError(res);

  user.set({
    name,
  });

  // save user to database
  if (await updateUser(db, userId, user)) return responseProfileUpdated(res);

  // send error json
  return responseServerError(res);
}

export async function usersPostProfileGithubUrl(
  req: RequestWithSession,
  res: Response,
): Promise<unknown> {
  // get variables
  const { githubUrl } = req.body as { [key: string]: string };

  // get database
  const db = new DatabaseDriver();

  // get userId from request
  const userId = req.session?.userId;

  if (userId === undefined) return responseServerError(res);

  // get user from database
  const user = await getUser(db, userId);
  const userInfo = await getUserInfo(db, userId);

  // check if user exists
  if (!user || !userInfo) return responseServerError(res);

  userInfo.set({
    githubUrl,
  });

  // save user to database
  if (await updateUserInfo(db, userId, userInfo))
    return responseProfileUpdated(res);

  // send error json
  return responseServerError(res);
}

export async function usersPostProfileWebsiteUrl(
  req: RequestWithSession,
  res: Response,
): Promise<unknown> {
  // get variables
  const { websiteUrl } = req.body as { [key: string]: string };

  // get database
  const db = new DatabaseDriver();

  // get userId from request
  const userId = req.session?.userId;

  if (userId === undefined) return responseServerError(res);

  // get user from database
  const user = await getUser(db, userId);
  const userInfo = await getUserInfo(db, userId);

  // check if user exists
  if (!user || !userInfo) return responseServerError(res);

  userInfo.set({
    websiteUrl,
  });

  // save user to database
  if (await updateUserInfo(db, userId, userInfo))
    return responseProfileUpdated(res);

  // send error json
  return responseServerError(res);
}

export async function usersPostProfileQuote(
  req: RequestWithSession,
  res: Response,
): Promise<unknown> {
  // get variables
  const { quote } = req.body as { [key: string]: string };

  // get database
  const db = new DatabaseDriver();

  // get userId from request
  const userId = req.session?.userId;

  if (userId === undefined) return responseServerError(res);

  // get user from database
  const user = await getUser(db, userId);
  const userInfo = await getUserInfo(db, userId);

  // check if user exists
  if (!user || !userInfo) return responseServerError(res);

  userInfo.set({
    quote,
  });

  // save user to database
  if (await updateUserInfo(db, userId, userInfo))
    return responseProfileUpdated(res);

  // send error json
  return responseServerError(res);
}
