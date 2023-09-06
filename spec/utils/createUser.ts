import { IUser, User } from '@src/types/models/User';
import { randomString } from '@spec/utils/randomString';
import request from 'supertest';
import app from '@src/server';
import Database from '@src/util/Database/DatabaseDriver';
import { CreatedUser } from '@spec/types/tests/CreatedUser';
import httpStatusCodes from '@src/constants/HttpStatusCodes';
import { Response } from '@spec/types/supertest';

export async function createUser(): Promise<CreatedUser> {
  const email = randomString() + '@test.com';
  const password = randomString();
  let loginCookie: string | null = null;

  const res = (await request(app)
    .post('/api/auth/register')
    .send({ email, password })
    .expect(httpStatusCodes.CREATED)) as Response;

  res.headers['set-cookie'].forEach((cookie: string) => {
    if (cookie.startsWith('token=')) {
      loginCookie = cookie;
    }
  });

  if (!loginCookie) {
    throw new Error('Login cookie not found.');
  }

  const db = new Database();

  const userDb = await db.getWhere<IUser>('users', 'email', email);

  if (!userDb) {
    throw new Error('User doesn\'t exists.');
  }

  const user = new User(userDb);

  return {
    email,
    password,
    loginCookie,
    user,
  };
}

export async function deleteUser(user: User): Promise<void> {
  const db = new Database();

  await db.delete('users', user.id);
}
