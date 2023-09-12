import { Response } from 'express';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';

/*
 ! Authentication responses
 */

export function responseInvalidLogin(res: Response): void {
  res.status(HttpStatusCodes.BAD_REQUEST).json({
    message: 'Invalid email or password',
    success: false,
  });
}

export function responseEmailConflict(res: Response): void {
  res.status(HttpStatusCodes.CONFLICT).json({
    message: 'Email already in use',
    success: false,
  });
}

export function responseAccountCreated(res: Response): void {
  res
    .status(HttpStatusCodes.CREATED)
    .json({ message: 'Registration successful', success: true });
}

export function responseLoginSuccessful(res: Response): void {
  res
    .status(HttpStatusCodes.OK)
    .json({ message: 'Login successful', success: true });
}

export function responseLogoutSuccessful(res: Response): void {
  res
    .status(HttpStatusCodes.OK)
    .json({ message: 'Logout successful', success: true });
}

export function responsePasswordChanged(res: Response): void {
  res
    .status(HttpStatusCodes.OK)
    .json({ message: 'Password changed successfully', success: true });
}
