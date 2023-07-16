import { NextFunction, Response } from 'express';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { RequestWithSession } from '@src/middleware/session';

export default function (
  req: RequestWithSession,
  res: Response,
  next: NextFunction,
): void {
  // if session isn't set, return forbidden
  if (!req.session) {
    res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ error: 'Token not found, please login' });
    return;
  }

  // call next()
  next();
}