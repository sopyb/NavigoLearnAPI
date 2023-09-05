// import { Response } from 'express';
// import { HttpStatusCode } from 'axios';
// import { User } from '@src/types/models/User';
// import { UserInfo } from '@src/types/models/UserInfo';
// import { UserStats } from '@src/helpers/databaseManagement';
// import JSONStringify from '@src/util/JSONStringify';
// import { ResUserMiniProfile } from '@src/types/response/ResUserMiniProfile';
// import { ResUserProfile } from '@src/types/response/ResUserProfile';
// import { ResRoadmap } from '@src/types/response/ResRoadmap';
//
// /*
//  ! Failure responses
//  */
//
// export function responseEmailConflict(res: Response): void {
//   res.status(HttpStatusCode.Conflict).json({
//     message: 'Email already in use',
//     success: false,
//   });
// }
//
// export function responseExternalBadGateway(res: Response): void {
//   res.status(HttpStatusCode.BadGateway).json({
//     message: 'Remote resource error',
//     success: false,
//   });
// }
//
// export function responseInvalidBody(res: Response): void {
//   res.status(HttpStatusCode.BadRequest).json({
//     message: 'Invalid request body',
//     success: false,
//   });
// }
//
//
// export function responseInvalidParameters(res: Response): void {
//   res.status(HttpStatusCode.BadRequest).json({
//     message: 'Invalid request paramteres',
//     success: false,
//   });
// }
//
// export function responseNotImplemented(res: Response): void {
//   res.status(HttpStatusCode.NotImplemented).json({
//     message: 'Not implemented',
//     success: false,
//   });
// }
//
// export function responseServerError(res: Response): void {
//   res.status(HttpStatusCode.InternalServerError).json({
//     message: 'Internal server error',
//     success: false,
//   });
// }
//
// export function responseUserNotFound(res: Response): void {
//   res.status(HttpStatusCode.NotFound).json({
//     message: 'User couldn\'t be found',
//     success: false,
//   });
// }
//
// export function responseUnauthorized(res: Response): void {
//   res.status(HttpStatusCode.Unauthorized).json({
//     message: 'Unauthorized',
//     success: false,
//   });
// }
//
// export function responseCantFollowYourself(res: Response): void {
//   res.status(HttpStatusCode.BadRequest).json({
//     message: 'You can\'t follow yourself',
//     success: false,
//   });
// }
//
// export function responseAlreadyFollowing(res: Response): void {
//   res.status(HttpStatusCode.BadRequest).json({
//     message: 'Already following',
//     success: false,
//   });
// }
//
// export function responseNotFollowing(res: Response): void {
//   res.status(HttpStatusCode.BadRequest).json({
//     message: 'Not following',
//     success: false,
//   });
// }
//
// /*
//  ? Success responses
//  */
//
// // ! Authentication Responses
//
// export function responseAccountCreated(res: Response): void {
//   res
//     .status(HttpStatusCode.Created)
//     .json({ message: 'Registration successful', success: true });
// }
//
//
// export function responseLogoutSuccessful(res: Response): void {
//   res
//     .status(HttpStatusCode.Ok)
//     .json({ message: 'Logout successful', success: true });
// }
//
// export function responsePasswordChanged(res: Response): void {
//   res
//     .status(HttpStatusCode.Ok)
//     .json({ message: 'Password changed successfully', success: true });
// }
//
// // ! User Responses
//
// export function responseUserDeleted(res: Response): void {
//   res
//     .status(HttpStatusCode.Ok)
//     .json({ message: 'Account successfully deleted', success: true });
// }
//
// export function responseUserProfile(
//   res: Response,
//   user: User,
//   userInfo: UserInfo,
//   userStats: UserStats,
//   isFollowing: boolean,
// ): void {
//   res
//     .status(HttpStatusCode.Ok)
//     .contentType('application/json')
//     .send(
//       JSONStringify({
//         data: new ResUserProfile(user, userInfo, userStats, isFollowing),
//         message: 'User found',
//         success: true,
//       }),
//     );
// }
//
// export function responseUserMiniProfile(res: Response, user: User): void {
//   res
//     .status(HttpStatusCode.Ok)
//     .contentType('application/json')
//     .send(
//       JSONStringify({
//         data: new ResUserMiniProfile(user),
//         message: 'User found',
//         success: true,
//       }),
//     );
// }
//
// export function responseUserNoRoadmaps(res: Response): void {
//   res
//     .status(HttpStatusCode.Ok)
//     .contentType('application/json')
//     .send(
//       JSONStringify({
//         data: [],
//         message: 'User has no roadmaps',
//         success: true,
//       }),
//     );
// }
//
// export function responseUserRoadmaps(
//   res: Response,
//   roadmaps: ResRoadmap[],
// ): void {
//   res
//     .status(HttpStatusCode.Ok)
//     .contentType('application/json')
//     .send(
//       JSONStringify({
//         data: roadmaps,
//         message: 'Roadmaps found',
//         success: true,
//       }),
//     );
// }
//
// export function responseUserFollowed(res: Response): void {
//   res
//     .status(HttpStatusCode.Ok)
//     .json({ message: 'User followed', success: true });
// }
//
// export function responseUserUnfollowed(res: Response): void {
//   res
//     .status(HttpStatusCode.Ok)
//     .json({ message: 'User unfollowed', success: true });
// }
