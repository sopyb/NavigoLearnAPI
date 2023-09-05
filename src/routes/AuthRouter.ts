import { Router } from 'express';
import Paths from '@src/constants/Paths';
import validateSession from '@src/middleware/validators/validateSession';
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
import validateBody from '@src/middleware/validators/validateBody';
import { rateLimit } from 'express-rate-limit';
import EnvVars from '@src/constants/EnvVars';
import { NodeEnvs } from '@src/constants/misc';

const AuthRouter = Router();
const LoginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: EnvVars.NodeEnv === NodeEnvs.Production ? 10 : 99999,
    message: 'Too many login attempts, please try again later.',
  }),
  RegisterLimiter = rateLimit({
    windowMs: 360 * 1000, // 1 hour
    max: EnvVars.NodeEnv === NodeEnvs.Production ? 5 : 99999,
    message: 'Too many register attempts, please try again later.',
  }),
  ResetPasswordLimiter = rateLimit({
    windowMs: 360 * 1000, // 1 hour
    max: EnvVars.NodeEnv === NodeEnvs.Production ? 10 : 99999,
    message: 'Too many reset password attempts, please try again later.',
  });

AuthRouter.post(
  Paths.Auth.Login,
  LoginLimiter,
  validateBody('email', 'password'),
  authLogin,
);

AuthRouter.post(
  Paths.Auth.Register,
  RegisterLimiter,
  validateBody('email', 'password'),
  authRegister,
);

AuthRouter.post(
  Paths.Auth.ChangePassword,
  ResetPasswordLimiter,
  validateSession,
  validateBody('password', 'newPassword'),
  authChangePassword,
);

AuthRouter.post(
  Paths.Auth.ForgotPassword,
  ResetPasswordLimiter,
  authForgotPassword,
);

AuthRouter.get(Paths.Auth.GoogleLogin, authGoogle);
AuthRouter.get(Paths.Auth.GoogleCallback, authGoogleCallback);

AuthRouter.get(Paths.Auth.GithubLogin, authGitHub);
AuthRouter.get(Paths.Auth.GithubCallback, authGitHubCallback);

AuthRouter.delete(Paths.Auth.Logout, validateSession, authLogout);

export default AuthRouter;
