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
  let loginCookie: string;

  it('Login with invalid credentials', async () => {
    // login with non-existent userDisplay and expect 401
    await request(app)
      .post('/api/auth/login')
      .send({ email, password })
      .expect(HttpStatusCodes.BAD_REQUEST);
  });

  it('Signup with invalid credentials', async () => {
    const invalidEmail = 'invalidEmail';

    // signup with invalid email and expect 400
    await request(app)
      .post('/api/auth/register')
      .send({ email: invalidEmail, password })
      .expect(HttpStatusCodes.BAD_REQUEST);
  });

  it('Signup with valid credentials', async () => {
    // register a 200 response and a session cookie to be sent back
    await request(app)
      .post('/api/auth/register')
      .send({ email, password })
      .expect(HttpStatusCodes.CREATED)
      .expect('Set-Cookie', new RegExp('token=.*; Path=/;'));
  });

  it('Login with valid credentials', async () => {
    // login with new userDisplay and expect 200 response and a session cookie
    // to be sent back
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email, password })
      .expect(HttpStatusCodes.OK)
      .expect('Set-Cookie', new RegExp('token=.*; Path=/;'));

    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    res.headers['set-cookie'].forEach((cookie: string) => {
      if (cookie.startsWith('token=')) {
        loginCookie = cookie;
      }
    });
  });

  // try to change password without a session cookie
  it('Change password without session cookie', async () => {
    // change password and expect 401
    await request(app)
      .post('/api/auth/change-password')
      .send({ password, newPassword: 'newPassword' })
      .expect(HttpStatusCodes.UNAUTHORIZED);
  });

  // try to change password with a session cookie but invalid password
  it('Change password with session cookie but invalid password', async () => {
    // change password and expect 401
    await request(app)
      .post('/api/auth/change-password')
      .set('Cookie', loginCookie)
      .send({ password: 'invalidPassword', newPassword: 'newPassword' })
      .expect(HttpStatusCodes.BAD_REQUEST);
  });

  // try to change password with a session cookie
  it('Change password with session cookie', async () => {
    // change password and expect 200
    await request(app)
      .post('/api/auth/change-password')
      .set('Cookie', loginCookie)
      .send({ password, newPassword: 'newPassword' })
      .expect(HttpStatusCodes.OK);
  });

  // google login page test
  it('Google login', async () => {
    // login and expect redirect to login page with 302
    await request(app)
      .get('/api/auth/google-login')
      .expect(HttpStatusCodes.FOUND)
      .expect(
        'Location',
        new RegExp('https:\\/\\/accounts.google.com\\/o\\/oauth2.+'),
      );
  });

  // google callback test with no code
  it('Google callback with no code', async () => {
    // login and expect 403 forbidden
    await request(app)
      .get('/api/auth/google-callback')
      .expect(HttpStatusCodes.BAD_REQUEST);
  });

  // google callback test with invalid code
  it('Google callback with invalid code', async () => {
    // login and expect 500 internal server error
    await request(app)
      .get('/api/auth/google-callback?code=invalid')
      .expect(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  });

  // GitHub login page test
  it('GitHub login', async () => {
    // login and expect redirect to login page with 302
    await request(app)
      .get('/api/auth/github-login')
      .expect(HttpStatusCodes.FOUND)
      .expect(
        'Location',
        new RegExp('https:\\/\\/github.com\\/login\\/oauth.+'),
      );
  });

  // GitHub callback test with no code
  it('GitHub callback with no code', async () => {
    // login and expect 403 forbidden
    await request(app)
      .get('/api/auth/github-callback')
      .expect(HttpStatusCodes.BAD_REQUEST);
  });

  // GitHub callback test with invalid code
  it('GitHub callback with invalid code', async () => {
    // login and expect 500 internal server error
    await request(app)
      .get('/api/auth/github-callback?code=invalid')
      .expect(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  });

  it('Logout', async () => {
    // logout with 200 response and a session cookie to be sent back
    await request(app)
      .delete('/api/auth/logout')
      .set('Cookie', loginCookie)
      .expect(HttpStatusCodes.OK)
      .expect('Set-Cookie', new RegExp('^token=; Max-Age=0; Path=\\/;'));
  });

  it('Logout without session cookie', async () => {
    // logout and expect 401
    await request(app)
      .delete('/api/auth/logout')
      .expect(HttpStatusCodes.UNAUTHORIZED);
  });

  it('Logout with invalid session cookie', async () => {
    // logout and expect 401
    await request(app)
      .delete('/api/auth/logout')
      .set('Cookie', 'token=invalid')
      .expect(HttpStatusCodes.UNAUTHORIZED);
  });

  // database cleanup
  afterAll(async () => {
    // get database
    const db = new Database();

    // get userDisplay
    const user = await db.getWhere<User>('users', 'email', email);

    if (!user) {
      return;
    }

    // delete userDisplay
    const success = await db.delete('users', user.id);
    expect(success).toBe(true);
  });
});
