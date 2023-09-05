import { NextFunction, Response } from 'express';
import { RequestWithSession } from '@src/middleware/session';
import { responseInvalidParameters } from '@src/helpers/apiResponses';

export interface RequestWithTargetUserId extends RequestWithSession {
  targetUserId?: bigint;
  issuerUserId?: bigint;
}

export default function validateUser(
  ownUserOnly = false,
): (
  req: RequestWithTargetUserId,
  res: Response,
  next: NextFunction,
) => unknown {
  return (
    req: RequestWithTargetUserId,
    res: Response,
    next: NextFunction,
  ): unknown => {
    // get userId from request :userId param
    req.targetUserId = BigInt(req.params.userId ?? req.session?.userId ?? -1n);
    req.issuerUserId = BigInt(req.session?.userId ?? -1n);

    // if userId is -1n, return error
    if (req.targetUserId === -1n) return responseInvalidParameters(res);

    // if ownUserOnly is true, set targetUserId to issuerUserId
    if (req.issuerUserId !== req.targetUserId && ownUserOnly)
      req.targetUserId = req.issuerUserId;

    next();
  };
}
