import { Response, Router } from 'express';
import Paths from '@src/constants/Paths';
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
import { RequestWithSession } from '@src/middleware/session';
import { checkEmail } from '@src/util/EmailUtil';
import validateSession from '@src/validators/validateSession';
import { authLogin, authRegister } from '@src/controllers/authController';
import validateBody from '@src/validators/validateBody';

const AuthRouter = Router();

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function handleExternalAuthError(error, res: Response): void {
  if (!(error instanceof Error)) return;
  if (EnvVars.NodeEnv !== NodeEnvs.Test) logger.err(error);
  if (error instanceof AxiosError) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Couldn't get access token from external service",
    });
  } else {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message || 'Internal server error',
    });
  }
}

AuthRouter.post(Paths.Auth.Login, validateBody('email', 'password'), authLogin);

AuthRouter.post(
  Paths.Auth.Register,
  validateBody('email', 'password', 'name'),
  authRegister,
);

AuthRouter.use(Paths.Auth.ChangePassword, validateSession);
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

    // if no userDisplay data, return error
    if (!userData) throw new Error('No userDisplay data received');

    // get database
    const db = new DatabaseDriver();

    // check if userDisplay exists
    let user = await db.getWhere<User>('users', 'email', userData.email);

    // if a userDisplay doesn't exist, create a new userDisplay
    if (!user) {
      const userId = await db.insert('users', {
        email: userData.email,
        name: userData.name,
        googleId: userData.id,
      });

      user = await db.get<User>('users', userId);

      if (!user) throw new Error('User not found');
    } else if (!user.googleId) {
      // if a userDisplay exists but doesn't have a Google id, add it
      await db.update('users', user.id, {
        googleId: userData.id,
      });
    }

    //check if userDisplay has userInfo
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
      EnvVars.GitHub.RedirectUri +
      '&scope=user:email',
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
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    // get userDisplay email
    const response2 = await axios.get('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
        'X-OAuth-Scopes': 'userDisplay:email',
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
    data.email = primaryEmail.email;

    // get database
    const db = new DatabaseDriver();

    // check if userDisplay exists
    let user = await db.getWhere<User>('users', 'email', data.email);

    if (!user) {
      // create userDisplay
      const userId = await db.insert('users', {
        name: data.name || data.login,
        email: data.email,
        githubId: data.id,
      });

      // check if userDisplay was created
      if (userId < 0) throw new Error('Could not create userDisplay');

      // get userDisplay
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

    // check if userDisplay has githubId if not,
    // update userDisplay with githubId merging accounts
    if (!user.githubId) {
      // update userDisplay
      const userId = await db.update('users', user.id, {
        githubId: data.id,
      });

      // check if userDisplay was updated
      if (!userId) throw new Error('Could not update userDisplay');
    }

    //check if userDisplay has userInfo
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

AuthRouter.delete(Paths.Auth.Logout, validateSession);
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

  // clear previous cookie header
  res.header('Set-Cookie', '');

  // set cookie
  return res
    .cookie('token', '', {
      httpOnly: false,
      secure: EnvVars.NodeEnv === NodeEnvs.Production,
      maxAge: 0,
      sameSite: 'strict',
    })
    .status(HttpStatusCodes.OK)
    .json({
      message: 'Logout successful',
    });
});

export default AuthRouter;
