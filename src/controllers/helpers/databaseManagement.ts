import DatabaseDriver from '@src/util/DatabaseDriver';
import { UserInfo } from '@src/models/UserInfo';
import User from '@src/models/User';

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
  return await db.get<UserInfo>('userInfo', userId);
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
