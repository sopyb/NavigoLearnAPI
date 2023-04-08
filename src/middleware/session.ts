import { NextFunction, Request, Response } from 'express';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import DatabaseDriver from '@src/util/DatabaseDriver';
import EnvVars from '@src/constants/EnvVars';
import { NodeEnvs } from '@src/constants/misc';

const COOKIE_NAME = 'token';

/** interfaces **/
export interface ISession {
  id: bigint;
  userId: bigint;
  token: string;
  expires: Date;
}

export interface RequestWithSession extends Request {
  session?: ISession;
}

/** functions **/
async function extendSession(
  db: DatabaseDriver,
  req: RequestWithSession,
  res: Response,
): Promise<void> {
  const { session } = req;
  if (!session) {
    return;
  }
  // update token expiration
  session.expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
  await db.update('sessions', session.id, session);

  // add session to request
  req.session = session;

  // set cookie
  res.cookie(COOKIE_NAME, session.token, {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: false,
    secure: EnvVars.NodeEnv === NodeEnvs.Production,
  });
}

export async function sessionMiddleware(
  req: RequestWithSession,
  res: Response,
  next: NextFunction,
): Promise<void> {
  // get token cookie
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const token = req?.cookies?.[COOKIE_NAME] as string;

  if (!token) {
    req.session = undefined;
    next();
    return;
  }

  // get Database
  const db = new DatabaseDriver();

  // get user from database
  const session = await db.getWhere<ISession>('sessions', 'token', token);

  // if session exists, extend it
  if (session) {
    req.session = session;
    await extendSession(db, req, res);
  } else {
    req.session = undefined;
  }

  // if the token is valid, call next()
  next();
}

export function requireSessionMiddleware(
  req: RequestWithSession,
  res: Response,
  next: NextFunction,
): void {
  // if session isn't set, return forbidden
  if (!req.session) {
    res.status(HttpStatusCodes.FORBIDDEN).send('Token not found, please login');
    return;
  }

  // call next()
  next();
}