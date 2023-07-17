import { Response } from 'express';
import { RequestWithSession } from '@src/middleware/session';
import {
  serverError,
  userDeleted,
} from '@src/controllers/helpers/apiResponses';
import DatabaseDriver from '@src/util/DatabaseDriver';
import { deleteUser } from '@src/controllers/helpers/databaseManagement';

/*
 ! Main route controllers
 */
export async function usersDeleteUser(req: RequestWithSession, res: Response) {
  // get database
  const db = new DatabaseDriver();

  // get userId from request
  const userId = req.session?.userId;

  if (userId === undefined) return serverError(res);

  // delete user from database
  if (await deleteUser(db, userId)) return userDeleted(res);

  // send error json
  return serverError(res);
}
