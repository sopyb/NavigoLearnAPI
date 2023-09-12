import { RequestWithSession } from '@src/middleware/session';
import { NextFunction, Response } from 'express';
import { HttpStatusCode } from 'axios';

interface IBody {
  [key: string]: string | number | boolean | object | null;
}

export interface RequestWithBody extends RequestWithSession {
  body: IBody;
}

export default function (
  ...requiredFields: string[]
): (req: RequestWithBody, res: Response, next: NextFunction) => unknown {
  return (req: RequestWithBody, res: Response, next: NextFunction): unknown => {
    const body = req.body;

    if (!body) {
      return res
        .status(HttpStatusCode.BadRequest)
        .json({ error: 'Missing request body' });
    }

    for (const item of requiredFields) {
      if (body[item] === null || body[item] === undefined) {
        return res
          .status(HttpStatusCode.BadRequest)
          .json({ error: `Missing required field: ${item}` });
      }
    }

    return next();
  };
}
