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
import validateSession from '@src/middleware/validators/validateSession';

// ! What would I do without StackOverflow?
// ! https://stackoverflow.com/a/60848873
const UsersGet = Router({ mergeParams: true, strict: true });

UsersGet.get(Paths.Users.Get.Profile, validateUser(), usersGetProfile);

UsersGet.get(Paths.Users.Get.MiniProfile, validateUser(), usersGetMiniProfile);

UsersGet.get(Paths.Users.Get.UserRoadmaps, validateUser(), userGetRoadmaps);

UsersGet.get(
  Paths.Users.Get.Follow,
  validateSession,
  validateUser(),
  userFollow,
);

UsersGet.delete(
  Paths.Users.Get.Follow,
  validateSession,
  validateUser(),
  userUnfollow,
);

// TODO: Following and followers lists

export default UsersGet;
