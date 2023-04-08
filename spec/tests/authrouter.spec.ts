import app from '@src/server';
import request from 'supertest';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import Database from '@src/util/DatabaseDriver';
import User from '@src/models/User';

describe('Login Router', () => {
  // generate random email
  const email = Math.random().toString(36).substring(2, 15) + '@test.com';
  // generate random password
  const password = Math.random().toString(36).substring(2, 15);

  it('Login with invalid credentials', async () => {

    // login with non-existent user and expect 401
    await request(app).post('/api/auth/login')
      .send({ email, password })
      .expect(HttpStatusCodes.BAD_REQUEST);
  });

  it('Signup with invalid credentials', async () => {
    const invalidEmail = 'invalidEmail';

    // signup with invalid email and expect 400
    await request(app).post('/api/auth/register')
      .send({ email: invalidEmail, password })
      .expect(HttpStatusCodes.BAD_REQUEST);
  });

  it('Signup with valid credentials', async () => {
    // register a 200 response and a session cookie to be sent back
    await request(app).post('/api/auth/register')
      .send({ email, password })
      .expect(HttpStatusCodes.OK)
      .expect('Set-Cookie', new RegExp('token=.*; Path=/;'));
  });

  it('Login with valid credentials', async () => {
    // login with new user and expect 200 response and a session cookie
    // to be sent back
    await request(app).post('/api/auth/login')
      .send({ email, password })
      .expect(HttpStatusCodes.OK)
      .expect('Set-Cookie', new RegExp('token=.*; Path=/;'));
  });

  it('Logout', async () => {
    // logout with 200 response and a session cookie to be sent back
    await request(app).delete('/api/auth/logout')
      .expect(HttpStatusCodes.OK)
      .expect('Set-Cookie', new RegExp(
        'session=; Path=\\/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'));
  });

  // google login page test
  it('Google login', async () => {
    // login and expect redirect to login page with 302
    await request(app).get('/api/auth/google-login')
      .expect(HttpStatusCodes.FOUND)
      .expect('Location', new RegExp(
        'https:\\/\\/accounts.google.com\\/o\\/oauth2.+'));
  });

  // google callback test with no code
  it('Google callback with no code', async () => {
    // login and expect 403 forbidden
    await request(app).get('/api/auth/google-callback')
      .expect(HttpStatusCodes.FORBIDDEN);
  });

  // google callback test with invalid code
  it('Google callback with invalid code', async () => {
    // login and expect 500 internal server error
    await request(app).get('/api/auth/google-callback?code=invalid')
      .expect(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  });

  // GitHub login page test
  it('GitHub login', async () => {
    // login and expect redirect to login page with 302
    await request(app).get('/api/auth/github-login')
      .expect(HttpStatusCodes.FOUND)
      .expect('Location', new RegExp(
        'https:\\/\\/github.com\\/login\\/oauth.+'));
  });

  // GitHub callback test with no code
  it('GitHub callback with no code', async () => {
    // login and expect 403 forbidden
    await request(app).get('/api/auth/github-callback')
      .expect(HttpStatusCodes.FORBIDDEN);
  });

  // GitHub callback test with invalid code
  it('GitHub callback with invalid code', async () => {
    // login and expect 500 internal server error
    await request(app).get('/api/auth/github-callback?code=invalid')
      .expect(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  });

  // database cleanup
  afterAll(async () => {

    // get database
    const db = new Database();

    // get user
    const user = await db.getWhere<User>('users', 'email', email);

    if (!user) {
      return;
    }

    // delete user
    const success = await db.delete('users', user.id);
    expect(success).toBe(true);
  });
});