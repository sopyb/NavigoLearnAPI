import { RequestWithBody } from '@src/validators/validateBody';
import { Response } from 'express';
import DatabaseDriver from '@src/util/DatabaseDriver';
import User from '@src/models/User';
import axios, { HttpStatusCode } from 'axios';
import { comparePassword, saltPassword } from '@src/util/LoginUtil';
import {
  createSaveSession,
  deleteClearSession,
} from '@src/util/sessionManager';
import { UserInfo } from '@src/models/UserInfo';
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
  updateUserInfo,
} from '@src/helpers/databaseManagement';
import {
  accountCreated,
  emailConflict,
  externalBadGateway,
  invalidBody,
  invalidLogin,
  loginSuccessful,
  logoutSuccessful,
  notImplemented,
  passwordChanged,
  serverError,
  unauthorized,
} from '@src/helpers/apiResponses';

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
  if (EnvVars.NodeEnv !== 'test') logger.err(error, true);

  if (error >= (HttpStatusCode.InternalServerError as number))
    return externalBadGateway(res);

  if (error === (HttpStatusCode.Unauthorized as number))
    return unauthorized(res);

  return serverError(res);
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
    return invalidLogin(res);

  // get database
  const db = new DatabaseDriver();

  // check if user exists
  const user = await getUserByEmail(db, email);
  if (!user) return invalidLogin(res);

  // check if password is correct
  const isCorrect = comparePassword(password, user.pwdHash || '');
  if (!isCorrect) return invalidLogin(res);

  // check userInfo table for user
  const userInfo = await getUserInfo(db, user.id);
  if (!userInfo)
    if (!(await insertUserInfo(db, user.id, new UserInfo(user.id))))
      return serverError(res);

  // create session and save it
  if (await createSaveSession(res, user.id)) return loginSuccessful(res);

  return serverError(res);
}

export async function authRegister(
  req: RequestWithBody,
  res: Response,
): Promise<unknown> {
  const { email, password } = req.body;

  if (typeof password !== 'string' || typeof email !== 'string')
    return invalidBody(res);

  // get database
  const db = new DatabaseDriver();

  // check if user exists
  const user = await getUserByEmail(db, email);
  if (!!user) return emailConflict(res);

  if (!checkEmail(email) || password.length < 8) return invalidBody(res);

  // create user
  const userId = await insertUser(
    db,
    email,
    email.split('@')[0],
    saltPassword(password),
  );
  if (userId === -1n) return serverError(res);

  // create session and save it
  if (await createSaveSession(res, BigInt(userId))) return accountCreated(res);

  return serverError(res);
}

export async function authChangePassword(
  req: RequestWithBody,
  res: Response,
): Promise<unknown> {
  const { password, newPassword } = req.body;

  if (typeof password !== 'string' || typeof newPassword !== 'string')
    return invalidBody(res);

  // get database
  const db = new DatabaseDriver();

  // check if user is logged in
  if (!req.session?.userId) return serverError(res);
  const userId = req.session.userId;

  // check if user exists
  const user = await getUser(db, userId);
  if (!user) return serverError(res);

  // check if password is correct
  const isCorrect = comparePassword(password, user.pwdHash || '');
  if (!isCorrect) return invalidLogin(res);

  user.pwdHash = saltPassword(newPassword);

  // update password in ussr
  const result = await updateUser(db, userId, user);

  if (result) return passwordChanged(res);
  else return serverError(res);
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function authForgotPassword(
  _: unknown,
  res: Response,
): Promise<unknown> {
  // TODO: implement after SMTP server is set up
  return notImplemented(res);
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

  if (typeof code !== 'string') return invalidBody(res);

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
    if (!response.data) return serverError(res);

    // get access token from response
    const data = response.data as { access_token?: string };
    const accessToken = data.access_token;
    if (!accessToken) return serverError(res);

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
    if (!userData) return serverError(res);

    // get database
    const db = new DatabaseDriver();

    // check if user exists
    let user = await getUserByEmail(db, userData.email);

    if (!user) {
      // create user
      user = new User(userData.name, userData.email, 0, '');
      user.googleId = userData.id;
      user.id = await insertUser(db, userData.email, userData.name, '');
    } else {
      user.googleId = userData.id;

      // update user
      if (!(await updateUser(db, user.id, user))) return serverError(res);

      // check userInfo table for user
      const userInfo = await getUserInfo(db, user.id);
      if (!userInfo)
        if (!(await insertUserInfo(db, user.id, new UserInfo(user.id))))
          return serverError(res);
    }
    // check if user was created
    if (user.id === -1n) return serverError(res);

    // create session and save it
    if (await createSaveSession(res, BigInt(user.id)))
      return loginSuccessful(res);

    return serverError(res);
  } catch (e) {
    if (EnvVars.NodeEnv !== 'test') logger.err(e, true);
    return serverError(res);
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

  if (typeof code !== 'string') return invalidBody(res);

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
    if (!response.data) return serverError(res);

    // get access token from response
    const data = response.data as { access_token?: string };
    const accessToken = data.access_token;
    if (!accessToken) return serverError(res);

    // get user info from github
    response = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    // check if response is valid
    if (response.status !== 200) return _handleNotOkay(res, response.status);
    if (!response.data) return serverError(res);

    // get user data
    const userData = response.data as GitHubUserData;
    if (!userData) return serverError(res);

    // if email is not public, get it from github
    if (userData.email == '') {
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
    }

    // check if email is valid
    if (userData.email == '') return serverError(res);

    // get database
    const db = new DatabaseDriver();

    // check if user exists
    let user = await getUserByEmail(db, userData.email);

    if (!user) {
      // create user
      user = new User(userData.login, userData.email, 0, '');
      user.githubId = userData.id.toString();
      user.id = await insertUser(
        db,
        userData.email,
        userData.name || userData.login,
        '',
        new UserInfo(
          -1n,
          userData.avatar_url,
          userData.bio,
          '',
          userData.blog,
          '',
          `https://github.com/${userData.login}`,
        ),
      );
    } else {
      user.githubId = userData.id.toString();
      await updateUser(db, user.id, user);

      // get user info
      const userInfo = await getUserInfo(db, user.id);
      if (!userInfo) {
        // create user info
        if (
          !(await insertUserInfo(
            db,
            user.id,
            new UserInfo(
              user.id,
              userData.avatar_url,
              userData.bio,
              '',
              userData.blog,
              '',
              `https://github.com/${userData.login}`,
            ),
          ))
        )
          return serverError(res);
      } else {
        if (userInfo.bio == '') userInfo.bio = userData.bio;
        if (userInfo.profilePictureUrl == '')
          userInfo.profilePictureUrl = userData.avatar_url;
        if (userInfo.blogUrl == '') userInfo.blogUrl = userData.blog;
        if (userInfo.githubUrl == '')
          userInfo.githubUrl = `https://github.com/${userData.login}`;

        // update user info
        if (!(await updateUserInfo(db, user.id, userInfo)))
          return serverError(res);
      }
    }

    // create session and save it
    if (await createSaveSession(res, user.id)) return loginSuccessful(res);

    return serverError(res);
  } catch (e) {
    if (EnvVars.NodeEnv !== 'test') logger.err(e, true);
    return serverError(res);
  }
}

export async function authLogout(
  req: RequestWithSession,
  res: Response,
): Promise<unknown> {
  if (!req.session) return serverError(res);

  // delete session and set cookie to expire
  if (!(await deleteClearSession(res, req.session.token)))
    return serverError(res);

  // return success
  return logoutSuccessful(res);
}
