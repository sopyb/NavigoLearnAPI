import { Response } from 'express';
import { RequestWithSession } from '@src/middleware/session';
import {
  serverError,
  userDeleted,
  userMiniProfile,
  userNotFound,
  userProfile,
} from '@src/helpers/apiResponses';
import DatabaseDriver from '@src/util/DatabaseDriver';
import {
  deleteUser,
  getUser,
  getUserInfo,
  getUserStats,
  isUserFollowing,
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

  if (userId === undefined) return serverError(res);

  // delete user from database
  if (await deleteUser(db, userId)) return userDeleted(res);

  // send error json
  return serverError(res);
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
    return serverError(res);

  // get user from database
  const user = await getUser(db, userId);
  const userInfo = await getUserInfo(db, userId);
  const stats = await getUserStats(db, userId);
  const isFollowing = await isUserFollowing(db, issuerUserId, userId);

  // check if user exists
  if (!user || !userInfo) return userNotFound(res);

  // send user json
  return userProfile(res, user, userInfo, stats, isFollowing);
}

export async function usersGetMiniProfile(
  req: RequestWithTargetUserId,
  res: Response,
): Promise<unknown> {
  // get database
  const db = new DatabaseDriver();

  // get userId from request
  const userId = req.targetUserId;
  if (!userId) return serverError(res);

  // get user from database
  const user = await getUser(db, userId);

  // check if user exists
  if (!user) return userNotFound(res);

  // send user json
  return userMiniProfile(res, user);
}
