import {Router} from 'express';
import Paths from '@src/routes/constants/Paths';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';

const AuthRouter = Router();

AuthRouter.post(Paths.Auth.Login,
  (req, res, next) => {
    // check if data is valid
    // if not, return error
    const {email, password} = req.body;
    if (!email || !password) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        error: 'Email and password are required',
      });
    }
  });

AuthRouter.post(Paths.Auth.GoogleLogin,
  (req, res, next) => {
    // handle Google login TODO
    return res.status(HttpStatusCodes.OK)
      .json({message: 'Google login successful'});
  });

AuthRouter.post(Paths.Auth.GithubLogin,
  (req, res, next) => {
    // handle GitHub login TODO
    return res.status(HttpStatusCodes.OK)
      .json({message: 'GitHub login successful'});
  });

AuthRouter.post(Paths.Auth.Register, (req, res, next) => {
  // handle registration
});

AuthRouter.delete(Paths.Auth.Logout, (req, res, next) => {
  // handle logout
});

AuthRouter.post(Paths.Auth.ForgotPassword, (req, res, next) => {
  // handle forgot password
});

export default AuthRouter;