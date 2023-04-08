import Paths from '@src/routes/constants/Paths';
import { Router } from 'express';
import { RequestWithSession } from '@src/middleware/session';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import axios from 'axios';
import DatabaseDriver from '@src/util/DatabaseDriver';
import { checkEmail } from '@src/util/EmailUtil';
import { comparePassword } from '@src/util/LoginUtil';
import { IUser } from '@src/models/User';

const UpdateUser = Router({ mergeParams: true });

UpdateUser.post(Paths.Users.Update.ProfilePicture,
  async (req: RequestWithSession, res) => {
    // get userId from request
    const userId = req.session?.userId,
      // eslint-disable-next-line max-len
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      url: string = req.body?.AvatarURL;

    // send error json
    if (userId === undefined)
      return res.status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No user specified' });

    // if no url is specified
    if (url === undefined)
      return res.status(HttpStatusCodes.BAD_REQUEST)
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
      return res.status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'Invalid image URL' });
    }

    // get database
    const db = new DatabaseDriver();

    // update user profile picture
    const success = await db.update('users', userId, { profilePicture: url });

    // if update was not successful
    if (!success) return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Failed to update profile picture' });

    // send success json
    return res.status(HttpStatusCodes.OK).json({ success: true });
  });

UpdateUser.post(Paths.Users.Update.Bio,
  async (req: RequestWithSession, res) => {
    // get userId from request
    const userId = req.session?.userId,
      // eslint-disable-next-line max-len
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      bio: string = req.body?.Bio;

    // send error json
    if (userId === undefined)
      return res.status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No user specified' });

    // if no bio is specified
    if (bio === undefined || bio.length > 255)
      return res.status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No bio specified' });

    // get database
    const db = new DatabaseDriver();

    // update user bio
    const success = await db.update('users', userId, { bio });

    // if update was not successful
    if (!success) return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Failed to update bio' });

    // send success json
    return res.status(HttpStatusCodes.OK).json({ success: true });
  });

UpdateUser.post(Paths.Users.Update.Quote,
  async (req: RequestWithSession, res) => {
    // get userId from request
    const userId = req.session?.userId,
      // eslint-disable-next-line max-len
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      quote: string = req.body?.Quote;

    // send error json
    if (userId === undefined)
      return res.status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No user' });

    // check if quote was given
    if (!quote || quote.length > 255)
      return res.status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No quote provided' });

    // get database
    const db = new DatabaseDriver();

    //update user quote
    const success = await db.update('users', userId, { quote });

    // if update was not successful
    if (!success) return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Failed to update quote' });

    // send success json
    return res.status(HttpStatusCodes.OK).json({ success: true });
  });

UpdateUser.post(Paths.Users.Update.Name,
  async (req: RequestWithSession, res) => {
    // get userId from request
    const userId = req.session?.userId,
      // eslint-disable-next-line max-len
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      name: string = req.body?.Name;

    // send error json
    if (userId === undefined)
      return res.status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No user' });

    // check if quote was given
    if (!name || name.length > 32)
      return res.status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No name valid provided' });

    // get database
    const db = new DatabaseDriver();

    //update user name
    const success = await db.update('users', userId, { name });

    // if update was not successful
    if (!success) return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Failed to update username' });

    // send success json
    return res.status(HttpStatusCodes.OK).json({ success: true });
  });

UpdateUser.post(Paths.Users.Update.BlogUrl,
  async (req: RequestWithSession, res) => {
    // get userId from request
    const userId = req.session?.userId,
      // eslint-disable-next-line max-len
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      blogUrl: string = req.body?.BlogUrl;

    // send error json
    if (userId === undefined)
      return res.status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No user' });

    // check if quote was given
    if (!blogUrl || blogUrl.length > 255)
      return res.status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No blog url valid provided' });

    // get database
    const db = new DatabaseDriver();

    //update user blog url
    const success = await db.update('users', userId, { blogUrl });

    // if update was not successful
    if (!success) return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Failed to update blog URL' });

    // send success json
    return res.status(HttpStatusCodes.OK).json({ success: true });
  });

UpdateUser.post(Paths.Users.Update.WebsiteUrl,
  async (req: RequestWithSession, res) => {
    const userId = req.session?.userId,
      // eslint-disable-next-line max-len
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      websiteUrl: string = req.body?.WebsiteUrl;

    // send error json
    if (userId === undefined)
      return res.status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No user' });

    // check if quote was given
    if (!websiteUrl || websiteUrl.length > 255)
      return res.status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No website url valid provided' });

    // get database
    const db = new DatabaseDriver();

    //update user website url
    const success = await db.update('users', userId, { websiteUrl });

    // if update was not successful
    if (!success) return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Failed to update website URL' });

    // send success json
    return res.status(HttpStatusCodes.OK).json({ success: true });
  });

UpdateUser.post(Paths.Users.Update.GithubUrl,
  async (req: RequestWithSession, res) => {
    const userId = req.session?.userId,
      // eslint-disable-next-line max-len
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      githubUrl: string = req.body?.GithubUrl;

    // send error json
    if (userId === undefined)
      return res.status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No user' });

    // check if quote was given
    if (!githubUrl || githubUrl.length > 255)
      return res.status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No github url valid provided' });

    // get database
    const db = new DatabaseDriver();

    //update user github url
    const success = await db.update('users', userId, { githubUrl });

    // if update was not successful
    if (!success) return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Failed to update github URL' });

    // send success json
    return res.status(HttpStatusCodes.OK).json({ success: true });
  });

UpdateUser.post(Paths.Users.Update.Email,
  async (req: RequestWithSession, res) => {
    const userId = req.session?.userId,
      // eslint-disable-next-line max-len
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      email: string = req.body?.Email,
      // eslint-disable-next-line max-len
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      password: string = req.body?.Password;

    // send error json
    if (userId === undefined)
      return res.status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No user' });

    // check if quote was given
    if (!email || email.length > 255 || !checkEmail(email))
      return res.status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No email valid provided' });

    // check if password was given
    if (!password)
      return res.status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'No password valid provided' });

    // get database
    const db = new DatabaseDriver();

    // get user
    const user = await db.get<IUser>('users', userId);

    // check if user exists
    if (!user) return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'User does not exist' });

    // check if password is correct
    if (!comparePassword(password, user.pwdHash as string))
      return res.status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'Password is not correct' });

    // check if email is already taken
    const emailTaken = await db.getWhere('users', 'email', email);

    // check if email is already taken
    if (!!emailTaken) return res.status(HttpStatusCodes.BAD_REQUEST);

    //update user email
    const success = await db.update('users', userId, { email });

    // if update was not successful
    if (!success) return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Failed to update email' });

    // send success json
    return res.status(HttpStatusCodes.OK).json({ success: true });
  });

export default UpdateUser;