import { Response, Router } from 'express';
import Paths from '@src/routes/constants/Paths';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import DatabaseDriver from '@src/util/DatabaseDriver';
import { comparePassword, saltPassword } from '@src/util/LoginUtil';
import User, { UserRoles } from '@src/models/User';
import { randomBytes } from 'crypto';
import EnvVars from '@src/constants/EnvVars';
import { NodeEnvs } from '@src/constants/misc';
import axios, { AxiosError } from 'axios';
import logger from 'jet-logger';
import { UserInfo } from '@src/models/UserInfo';

const AuthRouter = Router();

interface GoogleUserData {
  id: string;
  email: string;
  name: string;
  picture: string;
}

interface GitHubUserData {
  login: string;
  id: number;
  name: string;
  email: string;
  avatar_url: string;
  bio: string;
  blog: string;
}

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

async function saveSession(res: Response, user: User): Promise<void> {
  // get session token
  const token = await createSession(user);

  // check if session was created
  if (!token) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'Internal server error',
    });
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    res.cookie('token', token, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
      httpOnly: true,
      secure: EnvVars.NodeEnv === NodeEnvs.Production,
    });

    res.status(HttpStatusCodes.OK).json({
      message: 'Login successful',
    });
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function handleExternalAuthError(error, res: Response):
  void {
  if (!(error instanceof Error)) return;
  logger.err(error);
  if (error instanceof AxiosError) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'Couldn\'t get access token from external service',
    });
  } else {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message || 'Internal server error',
    });
  }
}

AuthRouter.get(Paths.Auth.Login,
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

    // save session
    return await saveSession(res, user);
  });
AuthRouter.get(Paths.Auth.GoogleLogin,
  (req, res) => {
    res.redirect('https://accounts.google.com/o/oauth2/v2/auth?client_id='
      + EnvVars.Google.ClientID
      + '&redirect_uri='
      + EnvVars.Google.RedirectUri
      + '&response_type=code&scope=email%20profile');
  });

AuthRouter.get(Paths.Auth.GoogleCallback,
  async (req, res) => {
    const code = req.query.code as string;

    if (!code) {
      return res.status(HttpStatusCodes.FORBIDDEN).json({
        error: 'Error while logging in with Google',
      });
    }

    try {
      let response =
        await axios.post('https://oauth2.googleapis.com/token', {
          client_id: EnvVars.Google.ClientID,
          client_secret: EnvVars.Google.ClientSecret,
          redirect_uri: EnvVars.Google.RedirectUri,
          grant_type: 'authorization_code',
          code,
        });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const accessToken = response?.data?.access_token as string;

      if (!accessToken) throw new Error('No access token');

      response =
        await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

      if (!response.data) throw new Error('No user data');

      const userData = response.data as GoogleUserData;

      res.status(HttpStatusCodes.OK).json({
        message: 'Login successful',
        data: userData,
      });
    } catch (e) {
      handleExternalAuthError(e, res);
    }
  })
;
AuthRouter.get(Paths.Auth.GithubLogin,
  (req, res) => {
    res.redirect('https://github.com/login/oauth/authorize?client_id='
      + EnvVars.GitHub.ClientID
      + '&redirect_uri='
      + EnvVars.GitHub.RedirectUri);

  });

AuthRouter.get(Paths.Auth.GithubCallback,
  async (req, res) => {
    const code = req.query.code as string;

    if (!code) {
      return res.status(HttpStatusCodes.FORBIDDEN).json({
        error: 'Error while logging in with GitHub',
      });
    }

    try {
      const response =
        await axios.post('https://github.com/login/oauth/access_token', {
          client_id: EnvVars.GitHub.ClientID,
          client_secret: EnvVars.GitHub.ClientSecret,
          code: code,
          redirect_uri: EnvVars.GitHub.RedirectUri,
        }, {
          headers: {
            Accept: 'application/json',
          },
        });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const accessToken = (response?.data?.access_token as string);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const response1 =
        await axios.get('https://api.github.com/user', {
          headers: {
            Authorization: `token ${accessToken}`,
            Accept: 'application/json',
          },
        });

      const data = response1.data as GitHubUserData;

      // get database
      const db = new DatabaseDriver();

      // check if user exists
      let user =
        await db.getObjByKey<User>('users', 'email', data.email);

      if (!user) {
        // create user
        const userId = await db.insert('users', {
          name: data.name,
          email: data.email,
          pwdHash: '',
          role: 0,
          githubId: data.id,
        });

        // check if user was created
        if (userId < 0) throw new Error('Could not create user');

        // get user
        user = new User(
          data.name,
          data.email,
          0,
          '',
          userId,
          null,
          data.id.toString());
      }

      // check if user has githubId if not,
      // update user with githubId merging accounts
      if (!user.githubId) {
        // update user
        const userId = await db.update('users', user.id, {
          githubId: data.id,
        });

        // check if user was updated
        if (!userId) throw new Error('Could not update user');
      }

      //check if user has userInfo
      const userInfo =
        await db.getObjByKey<UserInfo>(
          'userInfo',
          'userId',
          user.id);

      // if not, create userInfo
      if (!userInfo) {
        const userInfoId = await db.insert('userInfo', {
          userId: user.id,
          profilePictureUrl: data.avatar_url,
          bio: data.bio,
          quote: '',
          blogUrl: data.blog,
          websiteUrl: '',
          githubUrl: `https://github.com/${data.login}`,
        });

        // check if userInfo was created
        if (userInfoId < 0) throw new Error('Could not create userInfo');
      }

      // save session
      return await saveSession(res, user);
    } catch (error) {
      handleExternalAuthError(error, res);
    }
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
    return res.status(HttpStatusCodes.UNAUTHORIZED).json({
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
    // save session
    return await saveSession(res, newUser);
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