import { randomString } from '@spec/utils/randomString';
import request from 'supertest';
import app from '@src/server';
import httpStatusCodes from '@src/constants/HttpStatusCodes';
import { User } from '@src/models/User';
import Database from '@src/util/DatabaseDriver';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';

describe('Authentification Tests', () => {
  // generate random email
  const email = randomString() + '@test.com';
  // generate random password
  let password = randomString();
  let loginCookie: string;

  // user journey
  it('login should fail if no account is registered', async () => {
    await request(app)
      .post('/api/auth/login')
      .send({ email, password })
      .expect(httpStatusCodes.BAD_REQUEST)
      .expect(({ body }) => {
        expect(body.success).toBe(false);
      });
  });

  it('user should be able to register', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email, password })
      .expect(httpStatusCodes.CREATED)
      .expect(({ body, headers }) => {
        expect(body.success).toBe(true);
        expect(headers['set-cookie']).toBeDefined();
      });
  });

  it('user should be able to login', async () => {
    await request(app)
      .post('/api/auth/login')
      .send({ email, password })
      .expect(httpStatusCodes.OK)
      .expect(({ body, headers }) => {
        expect(body.success).toBe(true);
        expect(headers['set-cookie']).toBeDefined();

        headers['set-cookie'].forEach((cookie: string) => {
          if (cookie.startsWith('token=')) {
            loginCookie = cookie;
          }
        });
      });
  });

  it('user should be able to change password', async () => {
    const newPassword = randomString();
    await request(app)
      .post('/api/auth/change-password')
      .set('Cookie', loginCookie)
      .send({ password, newPassword })
      .expect(httpStatusCodes.OK)
      .expect(({ body }) => {
        expect(body.success).toBe(true);
      });

    password = newPassword;
  });

  it('user should be able to logout', async () => {
    await request(app)
      .delete('/api/auth/logout')
      .set('Cookie', loginCookie)
      .expect(httpStatusCodes.OK)
      .expect(({ body, headers }) => {
        expect(body.success).toBe(true);
        expect(headers['set-cookie']).toBeDefined();
      });
  });

  // google login page test
  it('Google login', async () => {
    // login and expect redirect to login page with 302
    await request(app)
      .get('/api/auth/google-login')
      .expect(HttpStatusCodes.FOUND)
      .expect(
        'Location',
        new RegExp('^https:\\/\\/accounts\\.google\\.com\\/o\\/oauth2.+'),
      );
  });

  // google callback test with no code
  it('Google callback with no code', async () => {
    // login and expect 403 forbidden
    await request(app)
      .get('/api/auth/google-callback')
      .expect(HttpStatusCodes.BAD_REQUEST);
  });

  // GitHub login page test
  it('GitHub login', async () => {
    // login and expect redirect to login page with 302
    await request(app)
      .get('/api/auth/github-login')
      .expect(HttpStatusCodes.FOUND)
      .expect(
        'Location',
        new RegExp('^https:\\/\\/github\\.com\\/login\\/oauth.+'),
      );
  });

  // GitHub callback test with no code
  it('GitHub callback with no code', async () => {
    // login and expect 403 forbidden
    await request(app)
      .get('/api/auth/github-callback')
      .expect(HttpStatusCodes.BAD_REQUEST);
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
