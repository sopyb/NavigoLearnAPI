import app from '@src/server';
import request from 'supertest';
import Database from '@src/util/DatabaseDriver';
import User from '@src/models/User';

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
    const user = await db.getObjByKey<User>('users', 'email', email);

    if (!user) {
      return;
    }

    // delete user
    const success = await db.delete('users', user.id);
    expect(success).toBe(true);
  });

  it('Login with Google', async () => {
    // TODO implement
    // return success response
    return request(app).post('/api/auth/google-login').expect(200);
  });
});