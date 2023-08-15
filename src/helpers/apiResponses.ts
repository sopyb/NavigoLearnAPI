import { Response } from 'express';
import { HttpStatusCode } from 'axios';
import User from '@src/models/User';
import { UserInfo } from '@src/models/UserInfo';
import { UserStats } from '@src/helpers/databaseManagement';
import JSONStringify from '@src/util/JSONStringify';

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

export function invalidParameters(res: Response): void {
  res.status(HttpStatusCode.BadRequest).json({
    error: 'Invalid request paramteres',
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

export function userNotFound(res: Response): void {
  res.status(HttpStatusCode.NotFound).json({
    error: "User couldn't be found",
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

export function userProfile(
  res: Response,
  user: User,
  userInfo: UserInfo,
  userStats: UserStats,
  isFollowing: boolean,
): void {
  const { roadmapsCount, issueCount, followerCount, followingCount } =
      userStats,
    { profilePictureUrl, bio, quote, blogUrl, websiteUrl, githubUrl } =
      userInfo,
    { name, githubId, googleId } = user;
  res
    .status(HttpStatusCode.Ok)
    .contentType('application/json')
    .send(
      JSONStringify({
        name,
        profilePictureUrl,
        userId: user.id,
        bio,
        quote,
        blogUrl,
        websiteUrl,
        githubUrl,
        roadmapsCount,
        issueCount,
        followerCount,
        followingCount,
        isFollowing,
        githubLink: !!githubId,
        googleLink: !!googleId,
        success: true,
      }),
    );
}

export function userMiniProfile(
  res: Response,
  user: User,
  userInfo: UserInfo,
): void {
  const { profilePictureUrl } = userInfo,
    { name } = user;
  res
    .status(HttpStatusCode.Ok)
    .contentType('application/json')
    .send(
      JSONStringify({
        name,
        profilePictureUrl,
        userId: user.id,
        success: true,
      }),
    );
}
