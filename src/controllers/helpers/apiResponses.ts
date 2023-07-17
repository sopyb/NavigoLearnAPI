import { Response } from 'express';
import { HttpStatusCode } from 'axios';

/*
 ! Failure responses
 */

export function emailConflict(res: Response): void {
  res.status(HttpStatusCode.Conflict).json({
    error: 'Email already in use',
    success: false,
  });
}

export function externalBadGateway(res: Response): void {
  res.status(HttpStatusCode.BadGateway).json({
    error: 'Remote resource error',
    success: false,
  });
}

export function invalidBody(res: Response): void {
  res.status(HttpStatusCode.BadRequest).json({
    error: 'Invalid request body',
    success: false,
  });
}

export function invalidLogin(res: Response): void {
  res.status(HttpStatusCode.BadRequest).json({
    error: 'Invalid email or password',
    success: false,
  });
}

export function notImplemented(res: Response): void {
  res.status(HttpStatusCode.NotImplemented).json({
    error: 'Not implemented',
    success: false,
  });
}

export function serverError(res: Response): void {
  res.status(HttpStatusCode.InternalServerError).json({
    error: 'Internal server error',
    success: false,
  });
}

export function unauthorized(res: Response): void {
  res.status(HttpStatusCode.Unauthorized).json({
    error: 'Unauthorized',
    success: false,
  });
}

/*
 ? Success responses
 */
// ! Authentication Responses
export function accountCreated(res: Response): void {
  res
    .status(HttpStatusCode.Created)
    .json({ message: 'Registration successful', success: true });
}

export function loginSuccessful(res: Response): void {
  res
    .status(HttpStatusCode.Ok)
    .json({ message: 'Login successful', success: true });
}

export function logoutSuccessful(res: Response): void {
  res
    .status(HttpStatusCode.Ok)
    .json({ message: 'Logout successful', success: true });
}

export function passwordChanged(res: Response): void {
  res
    .status(HttpStatusCode.Ok)
    .json({ message: 'Password changed successfully', success: true });
}

// ! User Responses
export function userDeleted(res: Response): void {
  res
    .status(HttpStatusCode.Ok)
    .json({ message: 'Account successfully deleted', success: true });
}
