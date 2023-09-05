import { RequestWithBody } from '@src/validators/validateBody';
import { Response } from 'express';
import DatabaseDriver from '@src/util/DatabaseDriver';
import { User } from '@src/types/models/User';
import axios, { HttpStatusCode } from 'axios';
import { comparePassword, saltPassword } from '@src/util/LoginUtil';
import {
  createSaveSession,
  deleteClearSession,
} from '@src/util/sessionManager';
import { UserInfo } from '@src/types/models/UserInfo';
import { checkEmail } from '@src/util/EmailUtil';
import EnvVars from '@src/constants/EnvVars';
import logger from 'jet-logger';
import { RequestWithSession } from '@src/middleware/session';
import {
  getUser,
  getUserByEmail,
  getUserInfo,
  insertUser,
  insertUserInfo,
  updateUser,
} from '@src/helpers/databaseManagement';
import {
  responseAccountCreated,
  responseEmailConflict,
  responseExternalBadGateway,
  responseInvalidBody,
  responseInvalidLogin,
  responseLoginSuccessful,
  responseLogoutSuccessful,
  responseNotImplemented,
  responsePasswordChanged,
  responseServerError,
  responseUnauthorized,
} from '@src/helpers/apiResponses';
import { NodeEnvs } from '@src/constants/misc';

/*
 * Interfaces
 */
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

/*
 * Helpers
 */
export function _handleNotOkay(res: Response, error: number): unknown {
  if (EnvVars.NodeEnv !== NodeEnvs.Test) logger.err(error, true);

  if (error >= (HttpStatusCode.InternalServerError as number))
    return responseExternalBadGateway(res);

  if (error === (HttpStatusCode.Unauthorized as number))
    return responseUnauthorized(res);

  return responseServerError(res);
}

/*
 * Controllers
 */
export async function authLogin(
  req: RequestWithBody,
  res: Response,
): Promise<unknown> {
  const { email, password } = req.body;

  if (typeof email !== 'string' || typeof password !== 'string')
    return responseInvalidLogin(res);

  // get database
  const db = new DatabaseDriver();

  // check if user exists
  const user = await getUserByEmail(db, email);
  if (!user) return responseInvalidLogin(res);

  // check if password is correct
  const isCorrect = comparePassword(password, user.pwdHash || '');
  if (!isCorrect) return responseInvalidLogin(res);

  // check userInfo table for user
  const userInfo = await getUserInfo(db, user.id);
  if (!userInfo)
    if (!(await insertUserInfo(db, user.id, new UserInfo({ userId: user.id }))))
      return responseServerError(res);

  // create session and save it
  if (await createSaveSession(res, user.id))
    return responseLoginSuccessful(res);

  return responseServerError(res);
}

export async function authRegister(
  req: RequestWithBody,
  res: Response,
): Promise<unknown> {
  const { email, password } = req.body;

  if (typeof password !== 'string' || typeof email !== 'string')
    return responseInvalidBody(res);

  // get database
  const db = new DatabaseDriver();

  // check if user exists
  const user = await getUserByEmail(db, email);
  if (!!user) return responseEmailConflict(res);

  if (!checkEmail(email) || password.length < 8)
    return responseInvalidBody(res);

  // create user
  const userId = await insertUser(
    db,
    new User({
      email,
      name: email.split('@')[0],
      pwdHash: saltPassword(password),
    }),
  );
  if (userId === -1n) return responseServerError(res);

  // create session and save it
  if (await createSaveSession(res, BigInt(userId)))
    return responseAccountCreated(res);

  return responseServerError(res);
}

export async function authChangePassword(
  req: RequestWithBody,
  res: Response,
): Promise<unknown> {
  const { password, newPassword } = req.body;

  if (typeof password !== 'string' || typeof newPassword !== 'string')
    return responseInvalidBody(res);

  // get database
  const db = new DatabaseDriver();

  // check if user is logged in
  if (!req.session?.userId) return responseServerError(res);
  const userId = req.session.userId;

  // check if user exists
  const user = await getUser(db, userId);
  if (!user) return responseServerError(res);

  // check if password is correct
  const isCorrect = comparePassword(password, user.pwdHash || '');
  if (!isCorrect) return responseInvalidLogin(res);

  user.set({ pwdHash: saltPassword(newPassword) });

  // update password in ussr
  const result = await updateUser(db, userId, user);

  if (result) return responsePasswordChanged(res);
  else return responseServerError(res);
}

export function authForgotPassword(_: unknown, res: Response): unknown {
  // TODO: implement after SMTP server is set up
  return responseNotImplemented(res);
}

export function authGoogle(_: unknown, res: Response): unknown {
  return res.redirect(
    'https://accounts.google.com/o/oauth2/v2/auth?client_id=' +
      EnvVars.Google.ClientID +
      '&redirect_uri=' +
      EnvVars.Google.RedirectUri +
      '&response_type=code&scope=email%20profile',
  );
}

export async function authGoogleCallback(
  req: RequestWithBody,
  res: Response,
): Promise<unknown> {
  const code = req.query.code;

  if (typeof code !== 'string') return responseInvalidBody(res);

  try {
    // get access token
    let response = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: EnvVars.Google.ClientID,
      client_secret: EnvVars.Google.ClientSecret,
      redirect_uri: EnvVars.Google.RedirectUri,
      grant_type: 'authorization_code',
      code,
    });

    // check if response is valid
    if (response.status !== 200) return _handleNotOkay(res, response.status);
    if (!response.data) return responseServerError(res);

    // get access token from response
    const data = response.data as { access_token?: string };
    const accessToken = data.access_token;
    if (!accessToken) return responseServerError(res);

    // get user info
    response = await axios.get(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const userData = response?.data as GoogleUserData;
    if (!userData) return responseServerError(res);

    // get database
    const db = new DatabaseDriver();

    // check if user exists
    let user = await getUserByEmail(db, userData.email);

    if (!user) {
      // create user
      user = new User({
        name: userData.name,
        email: userData.email,
        googleId: userData.id,
      });
      user.set({
        id: await insertUser(db, user),
      });
    } else {
      user.set({ googleId: userData.id });

      // update user
      if (!(await updateUser(db, user.id, user)))
        return responseServerError(res);

      // check userInfo table for user
      const userInfo = await getUserInfo(db, user.id);
      if (!userInfo)
        if (
          !(await insertUserInfo(
            db,
            user.id,
            new UserInfo({ userId: user.id }),
          ))
        )
          return responseServerError(res);
    }
    // check if user was created
    if (user.id === -1n) return responseServerError(res);

    // create session and save it
    if (await createSaveSession(res, BigInt(user.id)))
      return responseLoginSuccessful(res);

    return responseServerError(res);
  } catch (e) {
    if (EnvVars.NodeEnv !== NodeEnvs.Test) logger.err(e, true);
    return responseServerError(res);
  }
}

export function authGitHub(_: unknown, res: Response): unknown {
  return res.redirect(
    'https://github.com/login/oauth/authorize?client_id=' +
      EnvVars.GitHub.ClientID +
      '&redirect_uri=' +
      EnvVars.GitHub.RedirectUri +
      '&scope=user:email',
  );
}

export async function authGitHubCallback(
  req: RequestWithBody,
  res: Response,
): Promise<unknown> {
  const code = req.query.code;

  if (typeof code !== 'string') return responseInvalidBody(res);

  try {
    // get access token
    let response = await axios.post(
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

    // check if response is valid
    if (response.status !== 200) return _handleNotOkay(res, response.status);
    if (!response.data) return responseServerError(res);

    // get access token from response
    const data = response.data as { access_token?: string };
    const accessToken = data.access_token;
    if (!accessToken) return responseServerError(res);

    // get user info from GitHub
    response = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    // check if response is valid
    if (response.status !== 200) return _handleNotOkay(res, response.status);
    if (!response.data) return responseServerError(res);

    // get user data
    const userData = response.data as GitHubUserData;
    if (!userData) return responseServerError(res);

    // get email from github
    response = await axios.get('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
        'X-OAuth-Scopes': 'userDisplay:email',
      },
    });

    const emails = response.data as {
      email: string;
      primary: boolean;
      verified: boolean;
    }[];

    // check if response is valid
    if (response.status !== 200) return _handleNotOkay(res, response.status);

    // get primary email
    userData.email = emails.find((e) => e.primary && e.verified)?.email ?? '';

    // check if email is valid
    if (userData.email == '') return responseServerError(res);

    // get database
    const db = new DatabaseDriver();

    // check if user exists
    let user = await getUserByEmail(db, userData.email);

    if (!user) {
      // create user
      user = new User({
        name: userData.name || userData.login,
        avatar: userData.avatar_url,
        email: userData.email,
        githubId: userData.id.toString(),
      });

      user.set({
        id: await insertUser(
          db,
          user,
          new UserInfo({
            userId: user.id,
            bio: userData.bio,
            websiteUrl: userData.blog,
            githubUrl: `https://github.com/${userData.login}`,
          }),
        ),
      });
    } else {
      user.set({ githubId: userData.id.toString() });
      await updateUser(db, user.id, user);

      // get user info
      const userInfo = await getUserInfo(db, user.id);
      if (!userInfo) {
        // create user info
        if (
          !(await insertUserInfo(
            db,
            user.id,
            new UserInfo({
              userId: user.id,
              bio: userData.bio,
              websiteUrl: userData.blog,
              githubUrl: `https://github.com/${userData.login}`,
            }),
          ))
        )
          return responseServerError(res);
      } else {
        // update user info
        user.set({
          avatar: user.avatar || userData.avatar_url,
        });

        userInfo.set({
          bio: userInfo.bio || userData.bio,
          websiteUrl: userInfo.websiteUrl || userData.blog,
          githubUrl:
            userInfo.githubUrl || `https://github.com/${userData.login}`,
        });

        // update user info
        if (!(await updateUser(db, user.id, user, userInfo)))
          return responseServerError(res);
      }
    }

    // create session and save it
    if (await createSaveSession(res, user.id))
      return responseLoginSuccessful(res);
  } catch (e) {
    if (EnvVars.NodeEnv !== NodeEnvs.Test) logger.err(e, true);
    return responseServerError(res);
  }
}

export async function authLogout(
  req: RequestWithSession,
  res: Response,
): Promise<unknown> {
  if (!req.session) return responseServerError(res);

  // delete session and set cookie to expire
  if (!(await deleteClearSession(res, req.session.token)))
    return responseServerError(res);

  // return success
  return responseLogoutSuccessful(res);
}
