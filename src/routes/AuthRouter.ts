import { Router } from 'express';
import Paths from '@src/constants/Paths';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import DatabaseDriver from '@src/util/DatabaseDriver';
import User from '@src/models/User';
import EnvVars from '@src/constants/EnvVars';
import { NodeEnvs } from '@src/constants/misc';
import axios from 'axios';
import { UserInfo } from '@src/models/UserInfo';
import { RequestWithSession } from '@src/middleware/session';
import validateSession from '@src/validators/validateSession';
import {
  authChangePassword,
  authForgotPassword,
  authGoogle,
  authGoogleCallback,
  authLogin,
  authRegister,
} from '@src/controllers/authController';
import validateBody from '@src/validators/validateBody';

const AuthRouter = Router();

AuthRouter.post(Paths.Auth.Login, validateBody('email', 'password'), authLogin);

AuthRouter.post(
  Paths.Auth.Register,
  validateBody('email', 'password', 'name'),
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
