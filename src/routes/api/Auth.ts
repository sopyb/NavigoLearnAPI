import { Router } from 'express';
import Paths from '@src/routes/constants/Paths';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import DatabaseDriver from '@src/util/DatabaseDriver';
import { comparePassword, saltPassword } from '@src/util/LoginUtil';
import User, { UserRoles } from '@src/models/User';
import { randomBytes } from 'crypto';
import EnvVars from '@src/constants/EnvVars';
import { NodeEnvs } from '@src/constants/misc';

const AuthRouter = Router();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getInfoFromRequest(req: any): { email: string, password: string } {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const email = req?.body?.email as string;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const password = req?.body?.password as string;
  return { email, password };
}

async function createSession(user: User): Promise<string> {
  const token = randomBytes(32).toString('hex');

  // get database
  const db = new DatabaseDriver();

  // check if token is already in use - statistically unlikely but possible
  const session = await db.getObjByKey('sessions', 'token', token);
  if (!!session) {
    return '';
  }

  // save session
  const sessionId = await db.insert('sessions', {
    token,
    userId: user.id,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
  });

  // check if session was saved
  if (sessionId < 0) {
    return '';
  }

  return token;
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

    const token = await createSession(user);
    if (!token) {
      return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        error: 'Could not create session',
      });
    }

    // save token in cookie
    res.cookie('token', token, {
      httpOnly: false,
      secure: EnvVars.NodeEnv === NodeEnvs.Production,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

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
    // create session
    const token = await createSession(newUser);
    if (!token) {
      return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        error: 'Could not create session',
      });
    }

    // save token in cookie
    res.cookie('token', token, {
      httpOnly: false,
      secure: EnvVars.NodeEnv === NodeEnvs.Production,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
    return res.status(HttpStatusCodes.OK).json({
      message: 'User created successfully',
    });
  }

  return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
    error: 'Something went wrong',
  });

});

AuthRouter.delete(Paths.Auth.Logout, (req, res) => {
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

  // TODO: send email with reset code

  return res.status(HttpStatusCodes.OK).json({
    message: 'Password reset email sent',
  });
});

export default AuthRouter;