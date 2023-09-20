import { Response } from 'express';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';

/*
 ! General responses
 */

export function responseExternalBadGateway(res: Response): void {
  res.status(HttpStatusCodes.BAD_GATEWAY).json({
    message: 'Remote resource error',
    success: false,
  });
}

export function responseInvalidBody(
  res: Response,
  message?: string,
): void {
  res.status(HttpStatusCodes.BAD_REQUEST).json({
    message: `Invalid request body${message ? `: ${message}` : ''}`,
    success: false,
  });
}

export function responseInvalidParameters(
  res: Response,
  message?: string,
): void {
  res.status(HttpStatusCodes.BAD_REQUEST).json({
    message: `Invalid request parameters${message ? `: ${message}` : ''}`,
    success: false,
  });
}

export function responseNotImplemented(res: Response): void {
  res.status(HttpStatusCodes.NOT_IMPLEMENTED).json({
    message: 'Not implemented',
    success: false,
  });
}

export function responseServerError(res: Response): void {
  res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
    message: 'Internal server error',
    success: false,
  });
}

export function responseUnauthorized(res: Response): void {
  res.status(HttpStatusCodes.UNAUTHORIZED).json({
    message: 'Unauthorized',
    success: false,
  });
}
