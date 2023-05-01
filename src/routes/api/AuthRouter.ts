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
import {
  RequestWithSession,
  requireSessionMiddleware,
} from '@src/middleware/session';
import { checkEmail } from '@src/util/EmailUtil';

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
function getInfoFromRequest(req: any): { email: string; password: string } {
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
  const session = await db.getWhere('sessions', 'token', token);
  if (!!session) {
    return createSession(user);
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

async function saveSession(
  res: Response,
  user: User,
  register = false,
): Promise<void> {
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
      httpOnly: false,
      secure: EnvVars.NodeEnv === NodeEnvs.Production,
    });

    res.status(register ? HttpStatusCodes.CREATED : HttpStatusCodes.OK).json({
      message: `${register ? 'Registe' : 'Login'} successful`,
    });
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function handleExternalAuthError(error, res: Response): void {
  if (!(error instanceof Error)) return;
  if (EnvVars.NodeEnv !== NodeEnvs.Test) logger.err(error);
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

AuthRouter.post(Paths.Auth.Login, async (req, res) => {
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
  const user = await db.getWhere<User>('users', 'email', email);
  // if not, return error
  if (!user) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({
      error: 'Invalid email or password',
    });
  }

  // check if the password is correct
  const isPasswordCorrect = comparePassword(password, user.pwdHash || '');
  // if not, return error
  if (!isPasswordCorrect) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({
      error: 'Invalid email or password',
    });
  }

  // check if user has userInfo
  const userInfo = db.getWhere('userInfo', 'userId', user.id);

  if (!userInfo) {
    // create userInfo
    const row = await db.insert('userInfo', {
      userId: user.id,
      name: user.name,
      email: user.email,
      bio: '',
      website: '',
      profilePicture: '',
    });

    if (row < 0)
      return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        error: 'Internal server error',
      });
  }

  // save session
  return await saveSession(res, user);
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

  // check if email is valid
  // https://datatracker.ietf.org/doc/html/rfc5322#section-3.4.1
  if (!checkEmail(email))
    return res.status(HttpStatusCodes.BAD_REQUEST).json({
      error: 'Invalid Email',
    });

  // get database
  const db = new DatabaseDriver();

  // check if user exists
  const user = await db.getWhere<User>('users', 'email', email);
  // if yes, return error
  if (!!user) {
    return res.status(HttpStatusCodes.CONFLICT).json({
      error: 'User with this Email already exists',
    });
  }

  // parse email for username
  const username = email.split('@')[0];
  const saltedPassword = saltPassword(password);

  // create user
  const newUser = new User(username, email, UserRoles.Standard, saltedPassword);

  // save user
  const result = await db.insert('users', newUser);
  newUser.id = result;

  // check result
  if (result >= 0) {
    // create userInfo
    const userInfo = new UserInfo(newUser.id, '', '', '', '', '', '');

    // save userInfo
    const userInfoResult = await db.insert('userInfo', userInfo);

    // check if userInfo was created
    if (userInfoResult < 0)
      return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        error: 'Something went wrong',
      });

    // save session
    return await saveSession(res, newUser, true);
  }

  return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
    error: 'Something went wrong',
  });
});

AuthRouter.use(Paths.Auth.ChangePassword, requireSessionMiddleware);
AuthRouter.post(
  Paths.Auth.ChangePassword,
  async (req: RequestWithSession, res) => {
    // check if data is valid
    const { password } = getInfoFromRequest(req);

    // get new password from body
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { newPassword } = req?.body || {};

    // if not, return error
    if (!password || !newPassword || !req.session?.userId) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        error: 'A valid session, the old and the new password are required',
      });
    }

    // get database
    const db = new DatabaseDriver();

    // check if user exists
    const user = await db.get<User>('users', req.session.userId);

    // if not, return error
    if (!user) {
      return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        error: 'Invalid user',
      });
    }

    // check if the password is correct
    const isPasswordCorrect = comparePassword(password, user.pwdHash || '');

    // if not, return error - if password is empty, allow change
    if (!isPasswordCorrect && user.pwdHash !== '') {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        error: 'Incorrect password',
      });
    }

    // change password
    const saltedPassword = saltPassword(newPassword as string);

    // update user
    const result = await db.update('users', req.session.userId, {
      pwdHash: saltedPassword,
    });

    // check result
    if (result) {
      return res.status(HttpStatusCodes.OK).json({
        message: 'Password changed successfully',
      });
    } else {
      return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        error: 'Something went wrong',
      });
    }
  },
);

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
  const user = await db.getWhere<User>('users', 'email', email);

  // if not, return error
  if (!user) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({
      error: 'User with this Email does not exist',
    });
  }

  // TODO: send email with reset code
  return res.status(HttpStatusCodes.NOT_IMPLEMENTED).json({
    error: 'Not implemented',
  });
});

AuthRouter.get(Paths.Auth.GoogleLogin, (req, res) => {
  res.redirect(
    'https://accounts.google.com/o/oauth2/v2/auth?client_id=' +
      EnvVars.Google.ClientID +
      '&redirect_uri=' +
      EnvVars.Google.RedirectUri +
      '&response_type=code&scope=email%20profile',
  );
});

AuthRouter.get(Paths.Auth.GoogleCallback, async (req, res) => {
  const code = req.query.code as string;

  if (!code) {
    return res.status(HttpStatusCodes.FORBIDDEN).json({
      error: 'Error while logging in with Google',
    });
  }

  try {
    // get access token
    let response = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: EnvVars.Google.ClientID,
      client_secret: EnvVars.Google.ClientSecret,
      redirect_uri: EnvVars.Google.RedirectUri,
      grant_type: 'authorization_code',
      code,
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const accessToken = response?.data?.access_token as string;

    // if no token, return error
    if (!accessToken) throw new AxiosError('No access token received');

    // get user data
    response = await axios.get(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const userData = response?.data as GoogleUserData;

    // if no user data, return error
    if (!userData) throw new Error('No user data received');

    // get database
    const db = new DatabaseDriver();

    // check if user exists
    let user = await db.getWhere<User>('users', 'email', userData.email);

    // if a user doesn't exist, create a new user
    if (!user) {
      const userId = await db.insert('users', {
        email: userData.email,
        name: userData.name,
        googleId: userData.id,
      });

      user = await db.get<User>('users', userId);

      if (!user) throw new Error('User not found');
    } else if (!user.googleId) {
      // if a user exists but doesn't have a Google id, add it
      await db.update('users', user.id, {
        googleId: userData.id,
      });
    }

    //check if user has userInfo
    const userInfo = await db.getWhere<UserInfo>('userInfo', 'userId', user.id);

    // if not, create userInfo
    if (!userInfo) {
      const userInfoId = await db.insert('userInfo', {
        userId: user.id,
        profilePictureUrl: '',
        bio: '',
        quote: '',
        blogUrl: '',
        websiteUrl: '',
        githubUrl: '',
      });

      // check if userInfo was created
      if (userInfoId < 0) throw new Error('Could not create userInfo');
    }

    // save session
    return await saveSession(res, user);
  } catch (e) {
    handleExternalAuthError(e, res);
  }
});
AuthRouter.get(Paths.Auth.GithubLogin, (req, res) => {
  res.redirect(
    'https://github.com/login/oauth/authorize?client_id=' +
      EnvVars.GitHub.ClientID +
      '&redirect_uri=' +
      EnvVars.GitHub.RedirectUri,
  );
});

AuthRouter.get(Paths.Auth.GithubCallback, async (req, res) => {
  const code = req.query.code as string;

  if (!code) {
    return res.status(HttpStatusCodes.FORBIDDEN).json({
      error: 'Error while logging in with GitHub',
    });
  }

  try {
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: EnvVars.GitHub.ClientID,
        client_secret: EnvVars.GitHub.ClientSecret,
        code: code,
        redirect_uri: EnvVars.GitHub.RedirectUri,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      },
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const accessToken = response?.data?.access_token as string;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response1 = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: 'application/json',
      },
    });

    // get user email
    const response2 = await axios.get('https://api.github.com/user/emails', {
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: 'application/json',
      },
    });

    // array of {email:string, primary:boolean, verified:boolean}
    const emails = response2.data as {
      email: string;
      primary: boolean;
      verified: boolean;
    }[];

    // get primary email
    const primaryEmail = emails.find(
      (email) => email.primary && email.verified,
    );

    // if no primary email, return error
    if (!primaryEmail)
      return res.status(HttpStatusCodes.FORBIDDEN).json({
        error: 'No primary email found',
      });

    const data = response1.data as GitHubUserData;

    // get database
    const db = new DatabaseDriver();

    // check if user exists
    let user = await db.getWhere<User>('users', 'email', data.email);

    if (!user) {
      // create user
      const userId = await db.insert('users', {
        name: data.name || data.login,
        email: data.email,
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
        data.id.toString(),
      );
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
    const userInfo = await db.getWhere<UserInfo>('userInfo', 'userId', user.id);

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

AuthRouter.delete(Paths.Auth.Logout, requireSessionMiddleware);
AuthRouter.delete(Paths.Auth.Logout, async (req: RequestWithSession, res) => {
  // get session
  const token = req.session?.token;

  // if no session, return error
  if (!token) {
    return res.status(HttpStatusCodes.UNAUTHORIZED).json({
      error: 'No session found',
    });
  }

  // get database
  const db = new DatabaseDriver();

  // delete session
  const session = await db.getWhere<{ id: bigint }>('sessions', 'token', token);

  if (!session)
    return res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Session not found' });

  await db.delete('sessions', session.id);

  // remove cookie
  res.clearCookie('session');
  return res.status(HttpStatusCodes.OK).json({
    message: 'Logout successful',
  });
});

export default AuthRouter;
