import { Router } from 'express';
import Paths from '@src/constants/Paths';
import validateUser from '@src/middleware/validators/validateUser';
import {
  userFollow,
  userGetRoadmaps,
  usersGetMiniProfile,
  usersGetProfile,
  userUnfollow,
} from '@src/controllers/usersController';

// ! What would I do without StackOverflow?
// ! https://stackoverflow.com/a/60848873
const UsersGet = Router({ mergeParams: true, strict: true });

UsersGet.get(Paths.Users.Get.Profile, validateUser(), usersGetProfile);

UsersGet.get(Paths.Users.Get.MiniProfile, validateUser(), usersGetMiniProfile);

UsersGet.get(Paths.Users.Get.UserRoadmaps, validateUser(), userGetRoadmaps);

UsersGet.get(Paths.Users.Get.Follow, validateUser(), userFollow);

UsersGet.delete(Paths.Users.Get.Follow, validateUser(), userUnfollow);

// TODO: Following and followers lists
// UsersGet.get(
//   Paths.Users.Get.UserFollowers,
//   async (req: RequestWithSession, res) => {
//     const userId = getUserId(req);
//
//     if (userId === undefined)
//       return res
//         .status(HttpStatusCodes.BAD_REQUEST)
//         .json({ error: 'No user specified' });
//
//     const db = new DatabaseDriver();
//
//     const followers = await db.getAllWhere<Follower>(
//       'followers',
//       'userId',
//       userId,
//     );
//
//     res.status(HttpStatusCodes.OK).json(
//       JSON.stringify(
//         {
//           type: 'followers',
//           userId: userId.toString(),
//           followers: followers,
//         },
//         (_, value) => {
//           if (typeof value === 'bigint') {
//             return value.toString();
//           }
//           // eslint-disable-next-line @typescript-eslint/no-unsafe-return
//           return value;
//         },
//       ),
//     );
//   },
// );
//
// UsersGet.get(
//   Paths.Users.Get.UserFollowing,
//   async (req: RequestWithSession, res) => {
//     const userId = getUserId(req);
//
//     if (userId === undefined)
//       return res
//         .status(HttpStatusCodes.BAD_REQUEST)
//         .json({ error: 'No user specified' });
//
//     const db = new DatabaseDriver();
//
//     const following = await db.getAllWhere<Follower>(
//       'followers',
//       'followerId',
//       userId,
//     );
//
//     res.status(HttpStatusCodes.OK).json(
//       JSON.stringify(
//         {
//           type: 'following',
//           userId: userId.toString(),
//           following: following,
//         },
//         (_, value) => {
//           if (typeof value === 'bigint') {
//             return value.toString();
//           }
//           // eslint-disable-next-line @typescript-eslint/no-unsafe-return
//           return value;
//         },
//       ),
//     );
//   },
// );

export default UsersGet;
