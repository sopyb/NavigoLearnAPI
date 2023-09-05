import { Response } from 'express';
import { RequestWithSession } from '@src/middleware/session';
import {
  responseAlreadyFollowing,
  responseCantFollowYourself,
  responseServerError,
  responseUserDeleted,
  responseUserFollowed,
  responseUserMiniProfile,
  responseUserNotFound,
  responseUserProfile,
  responseUserRoadmaps,
  responseUserUnfollowed,
} from '@src/helpers/apiResponses';
import DatabaseDriver from '@src/util/DatabaseDriver';
import {
  deleteUser,
  followUser,
  getUser,
  getUserInfo,
  getUserRoadmaps,
  getUserStats,
  isUserFollowing,
  unfollowUser,
} from '@src/helpers/databaseManagement';
import { RequestWithTargetUserId } from '@src/validators/validateUser';

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

  // get user from database
  const user = await getUserRoadmaps(db, userId);

  // check if user exists
  if (!user) return responseUserNotFound(res);

  // send user json
  return responseUserRoadmaps(res, user);
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
