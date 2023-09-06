import { Response } from 'express';
import { User } from '@src/types/models/User';
import { UserInfo } from '@src/types/models/UserInfo';
import { UserStats } from '@src/helpers/databaseManagement';
import JSONStringify from '@src/util/JSONStringify';
import { ResUserMiniProfile } from '@src/types/response/ResUserMiniProfile';
import { ResUserProfile } from '@src/types/response/ResUserProfile';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';

/*
 ! User responses
 */

export function responseUserNotFound(res: Response): void {
  res.status(HttpStatusCodes.NOT_FOUND).json({
    message: 'User couldn\'t be found',
    success: false,
  });
}

export function responseCantFollowYourself(res: Response): void {
  res.status(HttpStatusCodes.BAD_REQUEST).json({
    message: 'You can\'t follow yourself',
    success: false,
  });
}

export function responseAlreadyFollowing(res: Response): void {
  res.status(HttpStatusCodes.BAD_REQUEST).json({
    message: 'Already following',
    success: false,
  });
}

export function responseNotFollowing(res: Response): void {
  res.status(HttpStatusCodes.BAD_REQUEST).json({
    message: 'Not following',
    success: false,
  });
}

export function responseUserDeleted(res: Response): void {
  res
    .status(HttpStatusCodes.OK)
    .json({ message: 'Account successfully deleted', success: true });
}

export function responseUserProfile(
  res: Response,
  user: User,
  userInfo: UserInfo,
  userStats: UserStats,
  isFollowing: boolean,
): void {
  res
    .status(HttpStatusCodes.OK)
    .contentType('application/json')
    .send(
      JSONStringify({
        data: new ResUserProfile(user, userInfo, userStats, isFollowing),
        message: 'User found',
        success: true,
      }),
    );
}

export function responseUserMiniProfile(res: Response, user: User): void {
  res
    .status(HttpStatusCodes.OK)
    .contentType('application/json')
    .send(
      JSONStringify({
        data: new ResUserMiniProfile(user),
        message: 'User found',
        success: true,
      }),
    );
}

export function responseUserFollowed(res: Response): void {
  res
    .status(HttpStatusCodes.OK)
    .json({ message: 'User followed', success: true });
}

export function responseUserUnfollowed(res: Response): void {
  res
    .status(HttpStatusCodes.OK)
    .json({ message: 'User unfollowed', success: true });
}

export function responseProfileUpdated(res: Response): void {
  res
    .status(HttpStatusCodes.OK)
    .json({ message: 'Profile updated', success: true });
}
