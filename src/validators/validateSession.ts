import { NextFunction, Response } from 'express';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { RequestWithSession } from '@src/middleware/session';
import DatabaseDriver from '@src/util/DatabaseDriver';

function invalidSession(res: Response): void {
  res.status(HttpStatusCodes.UNAUTHORIZED).json({
    error: 'Invalid session',
    success: false,
  });
}

export default async function (
  req: RequestWithSession,
  res: Response,
  next: NextFunction,
): Promise<void> {
  // if session isn't set, return forbidden
  if (!req.session) {
    return invalidSession(res);
  }

  // get db session
  const db = new DatabaseDriver();

  // count how maynt sessions there are with token
  if ((await db.countWhere('sessions', 'token', req.session.token)) !== 1n)
    return invalidSession(res);

  // call next()
  next();
}
