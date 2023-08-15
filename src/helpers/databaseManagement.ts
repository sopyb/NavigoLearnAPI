import DatabaseDriver from '@src/util/DatabaseDriver';
import { UserInfo } from '@src/models/UserInfo';
import User from '@src/models/User';

/*
 * Interfaces
 */
export interface UserStats {
  roadmapsCount: bigint;
  issueCount: bigint;
  followerCount: bigint;
  followingCount: bigint;
}

/*
 * Functions
 */

// TODO: add the annoying grace period for deleting users
export async function deleteUser(
  db: DatabaseDriver,
  userId: bigint,
): Promise<boolean> {
  return await db.delete('users', userId);
}

// ! uncomment if needed in the future deleteUser cascade deletes
// ! should handle this
// export async function deleteUserInfo(
//   db: DatabaseDriver,
//   userId: bigint,
// ): Promise<boolean> {
//   return await db.delete('userInfo', userId);
// }

export async function getUser(
  db: DatabaseDriver,
  userId: bigint,
): Promise<User | undefined> {
  return await db.get<User>('users', userId);
}

export async function getUserByEmail(
  db: DatabaseDriver,
  email: string,
): Promise<User | undefined> {
  return await db.getWhere<User>('users', 'email', email);
}

export async function getUserInfo(
  db: DatabaseDriver,
  userId: bigint,
): Promise<UserInfo | undefined> {
  return await db.getWhere<UserInfo>('userInfo', 'userId', userId);
}

export async function getUserStats(
  db: DatabaseDriver,
  userId: bigint,
): Promise<UserStats> {
  const roadmapsCount = await db.countWhere('roadmaps', 'ownerId', userId);
  const issueCount = await db.countWhere('issues', 'userId', userId);
  const followerCount = await db.countWhere('followers', 'userId', userId);
  const followingCount = await db.countWhere('followers', 'followerId', userId);

  return {
    roadmapsCount,
    issueCount,
    followerCount,
    followingCount,
  };
}

export async function isUserFollowing(
  db: DatabaseDriver,
  targetId: bigint,
  authUserId: bigint,
): Promise<boolean> {
  if (targetId === authUserId) return true;
  return (
    (await db.countWhere(
      'followers',
      'userId',
      targetId,
      'followerId',
      authUserId,
    )) > 0
  );
}

export async function insertUser(
  db: DatabaseDriver,
  email: string,
  name: string,
  pwdHash: string,
  userInfo?: UserInfo,
): Promise<bigint> {
  const userId = await db.insert('users', {
    email,
    name,
    pwdHash,
  });

  if (await insertUserInfo(db, userId, userInfo)) {
    return userId;
  } else {
    return -1n;
  }
}

export async function insertUserInfo(
  db: DatabaseDriver,
  userId: bigint,
  userInfo?: UserInfo,
): Promise<boolean> {
  if (!userInfo) userInfo = new UserInfo(userId);
  userInfo.userId = userId;
  return (await db.insert('userInfo', userInfo)) >= 0;
}

export async function updateUser(
  db: DatabaseDriver,
  userId: bigint,
  user: User,
  userInfo?: UserInfo,
): Promise<boolean> {
  if (userInfo) if (!(await updateUserInfo(db, userId, userInfo))) return false;

  return await db.update('users', userId, user);
}

export async function updateUserInfo(
  db: DatabaseDriver,
  userId: bigint,
  userInfo: UserInfo,
): Promise<boolean> {
  return await db.update('userInfo', userId, userInfo);
}
