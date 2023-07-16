import Paths from '@src/constants/Paths';
import { Router } from 'express';
import {
  RequestWithSession,
} from '@src/middleware/session';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import axios from 'axios';
import DatabaseDriver from '@src/util/DatabaseDriver';
import { checkEmail } from '@src/util/EmailUtil';
import { comparePassword } from '@src/util/LoginUtil';
import User from '@src/models/User';
import { UserInfo } from '@src/models/UserInfo';
import validateSession from "@src/validators/validateSession";

const UsersUpdate = Router({ mergeParams: true });

UsersUpdate.post('*', validateSession);
UsersUpdate.post(
  Paths.Users.Update.ProfilePicture,
  async (req: RequestWithSession, res) => {
    // get userId from request
    const userId = req.session?.userId,
      // eslint-disable-next-line max-len
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      url: string = req.body?.avatarURL;

    // send error json
    if (userId === undefined)
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No user specified' });

    // if no url is specified
    if (url === undefined)
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No profile picture URL specified' });

    try {
      // get url and check if it is valid with axios
      // if valid, update user profile picture
      const axiosReq = await axios.get(url);

      // if request is successful check data type
      if (axiosReq.status === 200) {
        // if data is type picture update user profile picture
        // eslint-disable-next-line max-len
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        if (!axiosReq.headers['content-type']?.startsWith('image/'))
          throw new Error('Invalid image URL');
      }
    } catch (e) {
      // if request is not successful
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'Invalid image URL' });
    }

    // get database
    const db = new DatabaseDriver();

    // get id of userInfo
    const userInfo = await db.getWhere<UserInfo>('userInfo', 'userId', userId);

    // if userInfo does not exist
    if (!userInfo)
      return res
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to update profile picture' });

    // update user profile picture
    const success = await db.update('userInfo', userInfo.id, {
      profilePictureUrl: url,
    });

    // if update was not successful
    if (!success)
      return res
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to update profile picture' });

    // send success json
    return res.status(HttpStatusCodes.OK).json({ success: true });
  },
);

UsersUpdate.post(
  Paths.Users.Update.Bio,
  async (req: RequestWithSession, res) => {
    // get userId from request
    const userId = req.session?.userId;
      // eslint-disable-next-line max-len
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    let bio: string = req.body?.bio;

    // send error json
    if (userId === undefined)
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No user specified' });

    // if no bio is specified
    if (bio.length > 255)
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No bio specified' });

    if (!bio) bio = '';

    // get database
    const db = new DatabaseDriver();

    // get id of userInfo
    const userInfo = await db.getWhere<UserInfo>('userInfo', 'userId', userId);

    // if userInfo does not exist
    if (!userInfo)
      return res
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to update bio' });

    // update user bio
    const success = await db.update('userInfo', userInfo.id, { bio });

    // if update was not successful
    if (!success)
      return res
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to update bio' });

    // send success json
    return res.status(HttpStatusCodes.OK).json({ success: true });
  },
);

UsersUpdate.post(
  Paths.Users.Update.Quote,
  async (req: RequestWithSession, res) => {
    // get userId from request
    const userId = req.session?.userId;
      // eslint-disable-next-line max-len
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    let quote: string = req.body?.quote;

    // send error json
    if (userId === undefined)
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No user' });

    // check if quote was given
    if (quote.length > 255)
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'Quote provided is too long' });

    if (!quote) quote = '';

    // get database
    const db = new DatabaseDriver();

    // get userInfo
    const userInfo = await db.getWhere<UserInfo>('userInfo', 'userId', userId);

    // if userInfo does not exist
    if (!userInfo)
      return res
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to update quote' });

    //update user quote
    const success = await db.update('userInfo', userInfo.id, { quote });

    // if update was not successful
    if (!success)
      return res
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to update quote' });

    // send success json
    return res.status(HttpStatusCodes.OK).json({ success: true });
  },
);

UsersUpdate.post(
  Paths.Users.Update.Name,
  async (req: RequestWithSession, res) => {
    // get userId from request
    const userId = req.session?.userId,
      // eslint-disable-next-line max-len
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      name: string = req.body?.name;

    // send error json
    if (userId === undefined)
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No user' });

    // check if quote was given
    if (!name || name.length > 32)
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No name valid provided' });

    // get database
    const db = new DatabaseDriver();

    //update user name
    const success = await db.update('users', userId, { name });

    // if update was not successful
    if (!success)
      return res
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to update username' });

    // send success json
    return res.status(HttpStatusCodes.OK).json({ success: true });
  },
);

UsersUpdate.post(
  Paths.Users.Update.BlogUrl,
  async (req: RequestWithSession, res) => {
    // get userId from request
    const userId = req.session?.userId;
      // eslint-disable-next-line max-len
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    let blogUrl: string = req.body?.blogUrl;

    // send error json
    if (userId === undefined)
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No user' });

    // check if quote was given
    if (blogUrl.length > 255)
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No blog url valid provided' });

    if (!blogUrl) blogUrl = '';

    // get database
    const db = new DatabaseDriver();

    // get userInfo
    const userInfo = await db.getWhere<UserInfo>('userInfo', 'userId', userId);

    // if userInfo does not exist
    if (!userInfo)
      return res
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to update blog URL' });

    //update userDisplay blog url
    const success = await db.update('userInfo', userInfo.id, { blogUrl });

    // if update was not successful
    if (!success)
      return res
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to update blog URL' });

    // send success json
    return res.status(HttpStatusCodes.OK).json({ success: true });
  },
);

UsersUpdate.post(
  Paths.Users.Update.WebsiteUrl,
  async (req: RequestWithSession, res) => {
    const userId = req.session?.userId;
      // eslint-disable-next-line max-len
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    let websiteUrl: string = req.body?.websiteUrl;

    // send error json
    if (userId === undefined)
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No userDisplay' });

    // check if quote was given
    if (websiteUrl.length > 255)
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No website url valid provided' });

    if (!websiteUrl) websiteUrl = '';

    // get database
    const db = new DatabaseDriver();

    // get userInfo
    const userInfo = await db.getWhere<UserInfo>('userInfo', 'userId', userId);

    // if userInfo does not exist
    if (!userInfo)
      return res
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to update website URL' });

    //update userDisplay website url
    const success = await db.update('userInfo', userInfo.id, { websiteUrl });

    // if update was not successful
    if (!success)
      return res
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to update website URL' });

    // send success json
    return res.status(HttpStatusCodes.OK).json({ success: true });
  },
);

UsersUpdate.post(
  Paths.Users.Update.GithubUrl,
  async (req: RequestWithSession, res) => {
    const userId = req.session?.userId;
      // eslint-disable-next-line max-len
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    let githubUrl: string = req.body?.githubUrl;

    // send error json
    if (userId === undefined)
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No userDisplay' });

    // check if quote was given
    if (githubUrl.length > 255)
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No github url valid provided' });

    if (!githubUrl) githubUrl = '';

    // get database
    const db = new DatabaseDriver();

    // get userInfo
    const userInfo = await db.getWhere<UserInfo>('userInfo', 'userId', userId);

    // if userInfo does not exist
    if (!userInfo)
      return res
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to update github URL' });

    //update userDisplay github url
    const success = await db.update('userInfo', userInfo.id, { githubUrl });

    // if update was not successful
    if (!success)
      return res
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to update github URL' });

    // send success json
    return res.status(HttpStatusCodes.OK).json({ success: true });
  },
);

UsersUpdate.post(
  Paths.Users.Update.Email,
  async (req: RequestWithSession, res) => {
    const userId = req.session?.userId,
      // eslint-disable-next-line max-len
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      email: string = req.body?.email,
      // eslint-disable-next-line max-len
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      password: string = req.body?.password;

    // send error json
    if (userId === undefined)
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No userDisplay' });

    // check if quote was given
    if (!email || email.length > 255 || !checkEmail(email))
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No email valid provided' });

    // check if password was given
    if (!password)
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No password valid provided' });

    // get database
    const db = new DatabaseDriver();

    // get userDisplay
    const user = await db.get<User>('users', userId);

    // check if userDisplay exists
    if (!user || !user?.pwdHash)
      return res
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'User does not exist' });

    // check if password is correct
    if (!comparePassword(password, user.pwdHash))
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'Password is not correct' });

    // check if email is already taken
    const emailTaken = await db.getWhere<User>('users', 'email', email);

    // check if email is already taken
    if (emailTaken)
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'Email is already taken' });

    //update userDisplay email
    const success = await db.update('users', userId, { email });

    // if update was not successful
    if (!success)
      return res
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to update email' });

    // send success json
    return res.status(HttpStatusCodes.OK).json({ success: true });
  },
);

export default UsersUpdate;
