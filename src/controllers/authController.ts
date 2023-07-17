import { RequestWithBody } from '@src/validators/validateBody';
import { Response } from 'express';
import DatabaseDriver from '@src/util/DatabaseDriver';
import User from '@src/models/User';
import { HttpStatusCode } from 'axios';
import { comparePassword, saltPassword } from '@src/util/LoginUtil';
import { createSaveSession } from '@src/util/sessionManager';
import { UserInfo } from '@src/models/UserInfo';
import { checkEmail } from '@src/util/EmailUtil';

/*
 * Interfaces
 */
interface GoogleUserData {
  id: string;
  email: string;
  name: string;
  picture: string;
}

interface GitHubUserData {
  login: string;
  id: number;
  name: string;
  email: string;
  avatar_url: string;
  bio: string;
  blog: string;
}

/*
 * Helpers
 */
function _invalidLogin(res: Response): void {
  res.status(HttpStatusCode.BadRequest).json({
    error: 'Invalid email or password',
    success: false,
  });
}

function _invalidBody(res: Response): void {
  res.status(HttpStatusCode.BadRequest).json({
    error: 'Invalid request body',
    success: false,
  });
}

function _conflict(res: Response): void {
  res.status(HttpStatusCode.Conflict).json({
    error: 'Email already in use',
    success: false,
  });
}

function _serverError(res: Response): void {
  res.status(HttpStatusCode.InternalServerError).json({
    error: 'Internal server error',
    success: false,
  });
}

async function insertUser(
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

async function insertUserInfo(
  db: DatabaseDriver,
  userId: bigint,
  userInfo?: UserInfo,
): Promise<boolean> {
  if (!userInfo) userInfo = new UserInfo(userId);
  userInfo.userId = userId;
  return (await db.insert('userInfo', userInfo)) >= 0;
}

/*
 * Controllers
 */
export async function authLogin(
  req: RequestWithBody,
  res: Response,
): Promise<unknown> {
  const { email, password } = req.body;

  if (typeof password !== 'string') return _invalidLogin(res);

  // get database
  const db = new DatabaseDriver();

  // check if user exists
  const user = await db.getWhere<User>('users', 'email', email);
  if (!user) return _invalidLogin(res);

  // check if password is correct
  const isCorrect = comparePassword(password, user.pwdHash || '');
  if (!isCorrect) return _invalidLogin(res);

  // check userInfo table for user
  const userInfo = await db.getWhere('userInfo', 'userId', user.id);
  if (!userInfo)
    if (!(await insertUserInfo(db, user.id, new UserInfo(user.id))))
      return _serverError(res);

  // create session and save it
  if (await createSaveSession(res, user.id))
    return res
      .status(HttpStatusCode.Ok)
      .json({ message: 'Login successful', success: true });
}

export async function authRegister(
  req: RequestWithBody,
  res: Response,
): Promise<unknown> {
  const { email, password, name } = req.body;

  if (
    typeof password !== 'string' ||
    typeof email !== 'string' ||
    typeof name !== 'string'
  )
    return _invalidBody(res);

  // get database
  const db = new DatabaseDriver();

  // check if user exists
  const user = await db.getWhere<User>('users', 'email', email);
  if (!!user) return _conflict(res);

  if (!checkEmail(email) || password.length < 8) return _invalidBody(res);

  // create user
  const userId = await insertUser(db, email, name, saltPassword(password));
  if (userId === -1n) return _serverError(res);

  // create session and save it
  if (await createSaveSession(res, BigInt(userId)))
    return res
      .status(HttpStatusCode.Ok)
      .json({ message: 'Registration successful', success: true });
}
