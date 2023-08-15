import { randomBytes } from 'crypto';
import DatabaseDriver from '@src/util/DatabaseDriver';
import { Response } from 'express';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import EnvVars from '@src/constants/EnvVars';
import { NodeEnvs } from '@src/constants/misc';

export async function createSession(userId: bigint): Promise<string> {
  const token = randomBytes(32).toString('hex');

  // get database
  const db = new DatabaseDriver();

  // check if token is already in use - statistically unlikely but possible
  const session = await db.getWhere('sessions', 'token', token);
  if (!!session) {
    return await createSession(userId);
  }

  // save session
  const sessionId = await db.insert('sessions', {
    token,
    userId,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
  });

  // check if session was saved
  if (sessionId < 0) {
    return '';
  }

  return token;
}

export function saveSession(res: Response, token: string): boolean {
  // check if session was created
  if (!token) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'Internal server error',
    });
    return false;
  } else {
    res.cookie('token', token, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
      httpOnly: false,
      secure: EnvVars.NodeEnv === NodeEnvs.Production,
      sameSite: 'strict',
    });
    return true;
  }
}

export async function deleteSession(token: string): Promise<boolean> {
  // get database
  const db = new DatabaseDriver();

  // delete session
  const session = await db.getWhere<{ id: bigint }>('sessions', 'token', token);

  if (!session) {
    return false;
  }

  await db.delete('sessions', session.id);

  return true;
}

export async function deleteClearSession(
  res: Response,
  token: string,
): Promise<boolean> {
  // delete session
  const deleted = await deleteSession(token);

  if (!deleted) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'Internal server error',
    });
    return false;
  }

  // clear previous cookie header
  res.header('Set-Cookie', '');

  // set cookie
  res.cookie('token', '', {
    httpOnly: false,
    secure: EnvVars.NodeEnv === NodeEnvs.Production,
    maxAge: 0,
    sameSite: 'strict',
  });

  return true;
}

export async function createSaveSession(
  res: Response,
  userId: bigint,
): Promise<boolean> {
  return saveSession(res, await createSession(userId));
}
