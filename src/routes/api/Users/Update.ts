import Paths from '@src/routes/constants/Paths';
import { Router } from 'express';
import { RequestWithSession } from '@src/middleware/session';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import axios from 'axios';
import DatabaseDriver from '@src/util/DatabaseDriver';

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

export default UpdateUser;