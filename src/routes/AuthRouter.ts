import { Router } from 'express';
import Paths from '@src/constants/Paths';
import validateSession from '@src/validators/validateSession';
import {
  authChangePassword,
  authForgotPassword,
  authGitHub,
  authGitHubCallback,
  authGoogle,
  authGoogleCallback,
  authLogin,
  authLogout,
  authRegister,
} from '@src/controllers/authController';
import validateBody from '@src/validators/validateBody';

const AuthRouter = Router();

AuthRouter.post(Paths.Auth.Login, validateBody('email', 'password'), authLogin);

AuthRouter.post(
  Paths.Auth.Register,
  validateBody('email', 'password'),
  authRegister,
);

AuthRouter.post(
  Paths.Auth.ChangePassword,
  validateSession,
  validateBody('password', 'newPassword'),
  authChangePassword,
);

AuthRouter.post(Paths.Auth.ForgotPassword, authForgotPassword);

AuthRouter.get(Paths.Auth.GoogleLogin, authGoogle);
AuthRouter.get(Paths.Auth.GoogleCallback, authGoogleCallback);

AuthRouter.get(Paths.Auth.GithubLogin, authGitHub);
AuthRouter.get(Paths.Auth.GithubCallback, authGitHubCallback);

AuthRouter.delete(Paths.Auth.Logout, validateSession, authLogout);

export default AuthRouter;
