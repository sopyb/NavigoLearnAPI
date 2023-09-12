import Paths from '@src/constants/Paths';
import { Router } from 'express';
import { RequestWithSession } from '@src/middleware/session';
import validateSession from '@src/middleware/validators/validateSession';
import {
  responseNotImplemented,
} from '@src/helpers/responses/generalResponses';
import validateBody from '@src/middleware/validators/validateBody';
import {
  usersPostProfile,
  usersPostProfileGithubUrl,
  usersPostProfileName,
  usersPostProfileQuote,
  usersPostProfileWebsiteUrl,
} from '@src/controllers/usersController';

const UsersUpdate = Router();

UsersUpdate.post('*', validateSession); // ! Global middleware for file

UsersUpdate.post(
  Paths.Users.Update.All,
  validateBody('name', 'githubUrl', 'websiteUrl', 'bio'),
  usersPostProfile,
);

UsersUpdate.post(
  Paths.Users.Update.Name,
  validateBody('name'),
  usersPostProfileName,
);

UsersUpdate.post(
  Paths.Users.Update.GithubUrl,
  validateBody('githubUrl'),
  usersPostProfileGithubUrl,
);

UsersUpdate.post(
  Paths.Users.Update.WebsiteUrl,
  validateBody('websiteUrl'),
  usersPostProfileWebsiteUrl,
);

UsersUpdate.post(
  Paths.Users.Update.Quote,
  validateBody('quote'),
  usersPostProfileQuote,
);

UsersUpdate.post(
  Paths.Users.Update.ProfilePicture,
  (req: RequestWithSession, res) => {
    return responseNotImplemented(res);
  },
);

export default UsersUpdate;
