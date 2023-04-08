import app from '@src/server';
import request from 'supertest';
import Database from '@src/util/DatabaseDriver';
import User from '@src/models/User';
import { ISession } from '@src/middleware/session';
import { IUserInfo } from '@src/models/UserInfo';

describe('Login Router', () => {
  it('Login, signup, login', async () => {
    // generate random email
    const email = Math.random().toString(36).substring(2, 15) + '@test.com';
    // generate random password
    const password = Math.random().toString(36).substring(2, 15);

    // login with non-existent user and expect 401
    await request(app).post('/api/auth/login')
      .send({ email, password })
      .expect(400);

    // signup a 200 response and a session cookie to be sent back
    await request(app).post('/api/auth/register')
      .send({ email, password })
      .expect(200)
      .expect('Set-Cookie', new RegExp('token=.*; Path=/;'));

    // login with new user and expect 200 response and a session cookie
    // to be sent back
    await request(app).post('/api/auth/login')
      .send({ email, password })
      .expect(200)
      .expect('Set-Cookie', new RegExp('token=.*; Path=/;'));

    // database cleanup

    // get database
    const db = new Database();

    // get user
    const user = await db.getWhere<User>('users', 'email', email);

    if (!user) {
      return;
    }

    // get a list of user sessions
    const sessions =
      await db.getAllWhere<ISession>('sessions', 'userId', user.id);

    // delete sessions
    if (sessions)
      for (const session of sessions) {
        await db.delete('sessions', session.id);
      }

    // get a list of userInfo entries
    const userInfo =
      await db.getAllWhere<IUserInfo>('userInfo', 'userId', user.id);

    // delete userInfo
    if (userInfo)
      for (const info of userInfo) {
        await db.delete('userInfo', info.id);
      }

    // delete user
    const success = await db.delete('users', user.id);
    expect(success).toBe(true);
  });
});