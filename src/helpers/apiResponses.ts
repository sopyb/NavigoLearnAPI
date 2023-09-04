import { Response } from 'express';
import { HttpStatusCode } from 'axios';
import { User } from '@src/types/models/User';
import { UserInfo } from '@src/types/models/UserInfo';
import { UserStats } from '@src/helpers/databaseManagement';
import JSONStringify from '@src/util/JSONStringify';

/*
 ! Failure responses
 */

export function emailConflict(res: Response): void {
  res.status(HttpStatusCode.Conflict).json({
    message: 'Email already in use',
    success: false,
  });
}

export function externalBadGateway(res: Response): void {
  res.status(HttpStatusCode.BadGateway).json({
    message: 'Remote resource error',
    success: false,
  });
}

export function invalidBody(res: Response): void {
  res.status(HttpStatusCode.BadRequest).json({
    message: 'Invalid request body',
    success: false,
  });
}

export function invalidLogin(res: Response): void {
  res.status(HttpStatusCode.BadRequest).json({
    message: 'Invalid email or password',
    success: false,
  });
}

export function invalidParameters(res: Response): void {
  res.status(HttpStatusCode.BadRequest).json({
    message: 'Invalid request paramteres',
    success: false,
  });
}

export function notImplemented(res: Response): void {
  res.status(HttpStatusCode.NotImplemented).json({
    message: 'Not implemented',
    success: false,
  });
}

export function serverError(res: Response): void {
  res.status(HttpStatusCode.InternalServerError).json({
    message: 'Internal server error',
    success: false,
  });
}

export function userNotFound(res: Response): void {
  res.status(HttpStatusCode.NotFound).json({
    message: 'User couldn\'t be found',
    success: false,
  });
}

export function unauthorized(res: Response): void {
  res.status(HttpStatusCode.Unauthorized).json({
    message: 'Unauthorized',
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

export function userProfile(
  res: Response,
  user: User,
  userInfo: UserInfo,
  userStats: UserStats,
  isFollowing: boolean,
): void {
  const { roadmapsCount, issueCount, followerCount, followingCount } =
      userStats,
    { bio, quote, websiteUrl, githubUrl } = userInfo,
    { name, avatar, githubId, googleId } = user;
  res
    .status(HttpStatusCode.Ok)
    .contentType('application/json')
    .send(
      JSONStringify({
        data: {
          name,
          avatar,
          userId: user.id,
          bio,
          quote,
          websiteUrl,
          githubUrl,
          roadmapsCount,
          issueCount,
          followerCount,
          followingCount,
          isFollowing,
          githubLink: !!githubId,
          googleLink: !!googleId,
        },
        message: 'User found',
        success: true,
      }),
    );
}

export function userMiniProfile(res: Response, user: User): void {
  res
    .status(HttpStatusCode.Ok)
    .contentType('application/json')
    .send(
      JSONStringify({
        data: user.toObject(),
        message: 'User found',
        success: true,
      }),
    );
}
