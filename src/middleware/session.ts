import { NextFunction, Request, Response } from 'express';
import DatabaseDriver from '@src/util/Database/DatabaseDriver';
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

interface RequestWithCookies extends RequestWithSession {
  cookies: {
    [COOKIE_NAME: string]: string | undefined;
  };
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
  req: RequestWithCookies,
  res: Response,
  next: NextFunction,
): Promise<void> {
  // get token cookie
  const token = req.cookies?.[COOKIE_NAME] ?? '';

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
  if (!!session) {
    req.session = session;
    // if session is expired, delete it
    if (session.expires < new Date()) {
      await db.delete('sessions', session.id);
      req.session = undefined;
      res.cookie('token', '', {
        httpOnly: false,
        secure: EnvVars.NodeEnv === NodeEnvs.Production,
        maxAge: 0,
        sameSite: 'strict',
      });

      req.session = undefined;
    } else {
      await extendSession(db, req, res);
    }
  } else {
    req.session = undefined;
    res.cookie('token', '', {
      httpOnly: false,
      secure: EnvVars.NodeEnv === NodeEnvs.Production,
      maxAge: 0,
      sameSite: 'strict',
    });
  }
  next();
}
