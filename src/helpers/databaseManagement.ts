import DatabaseDriver from '@src/util/Database/DatabaseDriver';
import { IUserInfo, UserInfo } from '@src/types/models/UserInfo';
import { IUser, User } from '@src/types/models/User';
import { Roadmap } from '@src/types/models/Roadmap';
import { Follower } from '@src/types/models/Follower';
import { IRoadmapLike, RoadmapLike } from '@src/types/models/RoadmapLike';

/*
 * Interfaces
 */
export interface UserStats {
  roadmapsCount: bigint;
  roadmapsViews: bigint;
  roadmapsLikes: bigint;
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
): Promise<User | null> {
  const user = await db.get<IUser>('users', userId);
  if (!user) return null;
  return new User(user);
}

export async function getUserByEmail(
  db: DatabaseDriver,
  email: string,
): Promise<User | null> {
  const user = await db.getWhere<IUser>('users', 'email', email);
  if (!user) return null;
  return new User(user);
}

export async function getUserInfo(
  db: DatabaseDriver,
  userId: bigint,
): Promise<UserInfo | null> {
  const userInfo = await db.getWhere<IUserInfo>('userInfo', 'userId', userId);
  if (!userInfo) return null;
  return new UserInfo(userInfo);
}

export async function getUserStats(
  db: DatabaseDriver,
  userId: bigint,
): Promise<UserStats> {
  const roadmapsCount = await db.countWhere('roadmaps', 'userId', userId);
  const roadmapsViews = await db.countQuery(
    `
        SELECT SUM(rl.value) AS 'result'
        FROM users u
                 LEFT JOIN roadmaps r ON u.id = r.userId
                 LEFT JOIN roadmapLikes rl ON r.id = rl.roadmapId
        WHERE u.id = ?;
    `,
    [userId],
  );
  const roadmapsLikes = await db.countQuery(
    `
        SELECT COUNT(rv.userId) AS 'result'
        FROM roadmaps r
                 JOIN roadmapViews rv ON r.id = rv.roadmapId
        WHERE rv.full = 1
          AND r.userId = ?;
    `,
    [userId],
  );
  const followerCount = await db.countWhere('followers', 'userId', userId);
  const followingCount = await db.countWhere('followers', 'followerId', userId);

  return {
    roadmapsCount,
    roadmapsViews,
    roadmapsLikes,
    followerCount,
    followingCount,
  };
}

export async function getUserRoadmaps(
  db: DatabaseDriver,
  userId: bigint,
): Promise<Roadmap[] | null> {
  const roadmaps = await db.getAllWhere<Roadmap>('roadmaps', 'userId', userId);
  if (!roadmaps) return null;
  return roadmaps.map((roadmap) => new Roadmap(roadmap));
}

export async function followUser(
  db: DatabaseDriver,
  targetId: bigint,
  authUserId: bigint,
): Promise<boolean> {
  if (targetId === authUserId) return false;
  return (
    (await db.insert(
      'followers',
      new Follower({
        userId: targetId,
        followerId: authUserId,
      }),
    )) >= 0
  );
}

export async function unfollowUser(
  db: DatabaseDriver,
  targetId: bigint,
  authUserId: bigint,
): Promise<boolean> {
  if (targetId === authUserId) return false;
  return await db.deleteWhere(
    'followers',
    'userId',
    targetId,
    'followerId',
    authUserId,
  );
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
  user: User,
  userInfo?: UserInfo,
): Promise<bigint> {
  user.set({ id: await db.insert('users', user) });

  if (await insertUserInfo(db, user.id, userInfo)) {
    return user.id;
  } else {
    return -1n;
  }
}

export async function insertUserInfo(
  db: DatabaseDriver,
  userId: bigint,
  userInfo?: UserInfo,
): Promise<boolean> {
  if (!userInfo) userInfo = new UserInfo({ userId });
  userInfo.set({ userId });
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

export async function getRoadmapData(
  db: DatabaseDriver,
  roadmapId: bigint,
): Promise<Roadmap | null> {
  const roadmap = await db.get<Roadmap>('roadmaps', roadmapId);
  if (!roadmap) return null;
  return new Roadmap(roadmap);
}

export async function insertRoadmap(
  db: DatabaseDriver,
  roadmap: Roadmap,
): Promise<bigint> {
  return await db.insert('roadmaps', roadmap);
}

export async function updateRoadmap(
  db: DatabaseDriver,
  roadmapId: bigint,
  roadmap: Roadmap,
): Promise<boolean> {
  return await db.update('roadmaps', roadmapId, roadmap);
}

export async function deleteRoadmap(
  db: DatabaseDriver,
  roadmapId: bigint,
): Promise<boolean> {
  return await db.delete('roadmaps', roadmapId);
}

export async function getRoadmapLike(
  db: DatabaseDriver,
  userId: bigint,
  roadmapId: bigint,
): Promise<RoadmapLike | null> {
  const like = await db.getWhere<IRoadmapLike>(
    'roadmapLikes',
    'userId',
    userId,
    'roadmapId',
    roadmapId,
  );

  if (!like) return null;

  return new RoadmapLike(like);
}

export async function insertRoadmapLike(
  db: DatabaseDriver,
  data: IRoadmapLike,
) {
  return await db.insert('roadmapLikes', data);
}

export async function updateRoadmapLike(
  db: DatabaseDriver,
  id: bigint,
  data: IRoadmapLike,
): Promise<boolean> {
  return await db.update('roadmapLikes', id, data);
}

export async function deleteRoadmapLike(
  db: DatabaseDriver,
  data: IRoadmapLike,
): Promise<boolean> {
  return await db.deleteWhere(
    'roadmapLikes',
    'userId',
    data.userId,
    'roadmapId',
    data.roadmapId,
  );
}
