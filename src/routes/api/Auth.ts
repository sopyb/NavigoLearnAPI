import { Router } from 'express';
import Paths from '@src/routes/constants/Paths';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import DatabaseDriver from '@src/util/DatabaseDriver';
import { comparePassword, saltPassword } from '@src/util/LoginUtil';
import User, { UserRoles } from '@src/models/User';

const AuthRouter = Router();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getInfoFromRequest(req: any): { email: string, password: string } {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const email = req?.body?.email as string;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const password = req?.body?.password as string;
  return { email, password };
}

AuthRouter.post(Paths.Auth.Login,
  async (req, res) => {
    // check if data is valid
    const { email, password } = getInfoFromRequest(req);
    // if not, return error
    if (!email || !password) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        error: 'Email and password are required',
      });
    }

    // get database
    const db = new DatabaseDriver();

    // check if user exists
    const user =
      await db.getObjByKey<User>('users', 'email', email);
    // if not, return error
    if (!user) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        error: 'Invalid email or password',
      });
    }

    // check if password is correct
    const isPasswordCorrect = comparePassword(password, user.pwdHash || '');
    // if not, return error
    if (!isPasswordCorrect) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        error: 'Invalid email or password',
      });
    }

    // TODO: create session and return cookie
    return res.status(HttpStatusCodes.OK).json({
      message: 'Login successful',
    });
  });

AuthRouter.post(Paths.Auth.GoogleLogin,
  (req, res) => {
    // handle Google login TODO
    return res.status(HttpStatusCodes.OK)
      .json({ message: 'Google login successful' });
  });

AuthRouter.post(Paths.Auth.GithubLogin,
  (req, res) => {
    // handle GitHub login TODO
    return res.status(HttpStatusCodes.OK)
      .json({ message: 'GitHub login successful' });
  });

AuthRouter.post(Paths.Auth.Register, async (req, res) => {
  // check if data is valid
  const { email, password } = getInfoFromRequest(req);
  // if not, return error
  if (!email || !password) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({
      error: 'Email and password are required',
    });
  }

  // get database
  const db = new DatabaseDriver();

  // check if user exists
  const user = await db.getObjByKey<User>('users', 'email', email);
  // if yes, return error
  if (!!user) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({
      error: 'User with this Email already exists',
    });
  }

  // parse email for username
  const username = email.split('@')[0];
  const saltedPassword = saltPassword(password);

  // create user
  const newUser = new User(
    username,
    email,
    UserRoles.Standard,
    saltedPassword,
  );

  // save user
  const result = await db.insert('users', newUser);

  // check result
  if (result >= 0) {
    // TODO: create session and return cookie
    return res.status(HttpStatusCodes.OK).json({
      message: 'User created successfully',
    });
  }

  return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
    error: 'Something went wrong',
  });

});

AuthRouter.delete(Paths.Auth.Logout, (req, res) => {
  // Remove session TODO

  // remove cookie
  res.clearCookie('session');
  return res.status(HttpStatusCodes.OK).json({
    message: 'Logout successful',
  });
});

AuthRouter.post(Paths.Auth.ForgotPassword, async (req, res) => {
  // check if data is valid
  const { email } = getInfoFromRequest(req);

  // if not, return error
  if (!email) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({
      error: 'Email is required',
    });
  }

  // get database
  const db = new DatabaseDriver();

  // check if user exists
  const user = await db.getObjByKey<User>('users', 'email', email);

  // if not, return error
  if (!user) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({
      error: 'User with this Email does not exist',
    });
  }

  // TODO: send email with reset link

  return res.status(HttpStatusCodes.OK).json({
    message: 'Password reset email sent',
  });
});

export default AuthRouter;