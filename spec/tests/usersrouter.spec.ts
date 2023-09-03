import app from '@src/server';
import request from 'supertest';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import Database from '@src/util/DatabaseDriver';
import { IUser } from '@src/models/User';

async function checkProfile(
  target?: string,
  mini?: boolean,
  loginCookie?: string,
): Promise<void> {
  // get userDisplay and expect 200 response
  await request(app)
    .get('/api/users/' + (!!target ? target : '') + (mini ? '/mini' : ''))
    .set('Cookie', loginCookie ?? '')
    .expect(
      !!loginCookie || !!target
        ? HttpStatusCodes.OK
        : HttpStatusCodes.BAD_REQUEST,
    )
    .expect('Content-Type', /json/)
    .expect((res) => {
      const receivedUser: object = res.body;
      // check for keys
      const objKeys = Object.keys(receivedUser);

      if (!target && !loginCookie) {
        expect(objKeys).toContain('error');
        return;
      }

      expect(objKeys).toContain('name');
      expect(objKeys).toContain('profilePictureUrl');
      expect(objKeys).toContain('userId');
      if (mini) return;
      expect(objKeys).toContain('bio');
      expect(objKeys).toContain('quote');
      expect(objKeys).toContain('blogUrl');
      expect(objKeys).toContain('websiteUrl');
      expect(objKeys).toContain('githubUrl');
      expect(objKeys).toContain('roadmapsCount');
      expect(objKeys).toContain('issueCount');
      expect(objKeys).toContain('followerCount');
      expect(objKeys).toContain('followingCount');
      expect(objKeys).toContain('githubLink');
      expect(objKeys).toContain('googleLink');
    });
}

describe('Users Router', () => {
  let email: string;
  let password: string;
  let loginCookie: string;
  let userId: bigint;

  // second userDisplay for testing
  let email2: string;
  let password2: string;
  let userId2: bigint;

  // set up a userDisplay to run tests on
  beforeAll(async () => {
    // generate random email
    email = Math.random().toString(36).substring(2, 15) + '@test.com';
    email2 = Math.random().toString(36).substring(2, 15) + '@test.com';
    // generate random password
    password = Math.random().toString(36).substring(2, 15);
    password2 = Math.random().toString(36).substring(2, 15);

    // register a 200 response and a session cookie to be sent back
    const reqData = await request(app)
      .post('/api/auth/register')
      .send({ email, password })
      .expect(HttpStatusCodes.CREATED);

    await request(app)
      .post('/api/auth/register')
      .send({ email: email2, password: password2 })
      .expect(HttpStatusCodes.CREATED);

    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    reqData.headers['set-cookie'].forEach((cookie: string) => {
      if (cookie.startsWith('token=')) {
        loginCookie = cookie;
      }
    });

    // get database
    const db = new Database();

    // get userDisplay from database
    const user = await db.getWhere<IUser>('users', 'email', email);
    const user2 = await db.getWhere<IUser>('users', 'email', email2);

    // get userDisplay id
    userId = user?.id ?? BigInt(-1);
    userId2 = user2?.id ?? BigInt(-1);

    if (userId < 0 || userId2 < 0) {
      // can't run tests without a userDisplay
      throw new Error('Failed to create userDisplay');
    }
  });

  // delete the userDisplay after tests
  afterAll(async () => {
    // get database
    const db = new Database();

    // see if userDisplay exists
    const user = await db.getWhere<IUser>('users', 'email', email);
    const user2 = await db.getWhere<IUser>('users', 'email', email2);

    // if userDisplay exists, delete them
    if (user) await db.delete('users', user.id);
    if (user2) await db.delete('users', user2.id);
  });

  /**
   * Test getting a userDisplay's profile
   */
  it('Get profile with no target or login cookie', async () => {
    await checkProfile(undefined, false, undefined);
  });

  it('Get mini profile with no target and login cookie', async () => {
    await checkProfile(undefined, true, undefined);
  });

  it('Get profile with target and no login cookie', async () => {
    await checkProfile(userId.toString(), false, undefined);
  });

  it('Get mini profile with target and no login cookie', async () => {
    await checkProfile(userId.toString(), true, undefined);
  });

  it('Get profile with no target and login cookie', async () => {
    await checkProfile(undefined, false, loginCookie);
  });

  it('Get mini profile with no target and login cookie', async () => {
    await checkProfile(undefined, true, loginCookie);
  });

  it('Get profile with target and login cookie', async () => {
    await checkProfile(userId.toString(), false, loginCookie);
  });

  it('Get mini profile with target and login cookie', async () => {
    await checkProfile(userId.toString(), true, loginCookie);
  });

  /**
   * Test getting userDisplay's roadmaps
   */
  it('Get userDisplay roadmaps with no target or login cookie', async () => {
    await request(app)
      .get('/api/users/roadmaps')
      .expect(HttpStatusCodes.BAD_REQUEST)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.message).toBeDefined();
      });
  });

  it('Get userDisplay roadmaps with target and no login cookie', async () => {
    await request(app)
      .get('/api/users/' + userId.toString() + '/roadmaps')
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
        // expect it to be an array
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(Array.isArray(res.body?.roadmaps)).toBe(true);
      });
  });

  it('Get userDisplay roadmaps with no target and login cookie', async () => {
    await request(app)
      .get('/api/users/roadmaps')
      .set('Cookie', loginCookie)
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
        // expect it to be an array
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(Array.isArray(res.body?.roadmaps)).toBe(true);
      });
  });

  it('Get userDisplay roadmaps with target and login cookie', async () => {
    await request(app)
      .get('/api/users/' + userId.toString() + '/roadmaps')
      .set('Cookie', loginCookie)
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
        // expect it to be an array
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(Array.isArray(res.body?.roadmaps)).toBe(true);
      });
  });

  /**
   * Test getting userDisplay's issues
   */
  it('Get userDisplay issues with no target or login cookie', async () => {
    await request(app)
      .get('/api/users/issues')
      .expect(HttpStatusCodes.BAD_REQUEST)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.message).toBeDefined();
      });
  });

  it('Get userDisplay issues with target and no login cookie', async () => {
    await request(app)
      .get('/api/users/' + userId.toString() + '/issues')
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(Array.isArray(JSON.parse(res.body || '{}')?.issues)).toBe(true);
      });
  });

  it('Get userDisplay issues with no target and login cookie', async () => {
    await request(app)
      .get('/api/users/issues')
      .set('Cookie', loginCookie)
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
        // expect it to be an array
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(Array.isArray(JSON.parse(res.body || '{}')?.issues)).toBe(true);
      });
  });

  it('Get userDisplay issues with target and login cookie', async () => {
    await request(app)
      .get('/api/users/' + userId.toString() + '/issues')
      .set('Cookie', loginCookie)
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
        // expect it to be an array
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(Array.isArray(JSON.parse(res.body || '{}')?.issues)).toBe(true);
      });
  });

  /**
   * Test getting userDisplay's followers
   */
  it('Get userDisplay followers with no target or login cookie', async () => {
    await request(app)
      .get('/api/users/followers')
      .expect(HttpStatusCodes.BAD_REQUEST)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.message).toBeDefined();
      });
  });

  it('Get userDisplay followers with target and no login cookie', async () => {
    await request(app)
      .get('/api/users/' + userId.toString() + '/followers')
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(Array.isArray(JSON.parse(res.body || '{}')?.followers)).toBe(
          true,
        );
      });
  });

  it('Get userDisplay followers with no target and login cookie', async () => {
    await request(app)
      .get('/api/users/followers')
      .set('Cookie', loginCookie)
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
        // expect it to be an array
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(Array.isArray(JSON.parse(res.body || '{}')?.followers)).toBe(
          true,
        );
      });
  });

  it('Get userDisplay followers with target and login cookie', async () => {
    await request(app)
      .get('/api/users/' + userId.toString() + '/followers')
      .set('Cookie', loginCookie)
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
        // expect it to be an array
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(Array.isArray(JSON.parse(res.body || '{}')?.followers)).toBe(
          true,
        );
      });
  });

  /**
   * Test getting userDisplay's following
   */
  it('Get userDisplay following with no target or login cookie', async () => {
    await request(app)
      .get('/api/users/following')
      .expect(HttpStatusCodes.BAD_REQUEST)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.message).toBeDefined();
      });
  });

  it('Get userDisplay following with target and no login cookie', async () => {
    await request(app)
      .get('/api/users/' + userId.toString() + '/following')
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(Array.isArray(JSON.parse(res.body || '{}')?.following)).toBe(
          true,
        );
      });
  });

  it('Get userDisplay following with no target and login cookie', async () => {
    await request(app)
      .get('/api/users/following')
      .set('Cookie', loginCookie)
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
        // expect it to be an array
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(Array.isArray(JSON.parse(res.body || '{}')?.following)).toBe(
          true,
        );
      });
  });

  it('Get userDisplay following with target and login cookie', async () => {
    await request(app)
      .get('/api/users/' + userId.toString() + '/following')
      .set('Cookie', loginCookie)
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
        // expect it to be an array
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(Array.isArray(JSON.parse(res.body || '{}')?.following)).toBe(
          true,
        );
      });
  });

  /**
   * Test getting userDisplay's Roadmap count
   */
  it('Get userDisplay Roadmap count with no target or login cookie', async () => {
    await request(app)
      .get('/api/users/roadmap-count')
      .expect(HttpStatusCodes.BAD_REQUEST)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.message).toBeDefined();
      });
  });

  it('Get userDisplay Roadmap count with target and no login cookie', async () => {
    await request(app)
      .get('/api/users/' + userId.toString() + '/roadmap-count')
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
        // expect it to be an number >= 0
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        expect(parseInt(res.body?.roadmapCount)).toBeGreaterThanOrEqual(0);
      });
  });

  it('Get userDisplay Roadmap count with no target and login cookie', async () => {
    await request(app)
      .get('/api/users/roadmap-count')
      .set('Cookie', loginCookie)
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
        // expect it to be an number >= 0
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        expect(parseInt(res.body?.roadmapCount)).toBeGreaterThanOrEqual(0);
      });
  });

  it('Get userDisplay Roadmap count with target and login cookie', async () => {
    await request(app)
      .get('/api/users/' + userId.toString() + '/roadmap-count')
      .set('Cookie', loginCookie)
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
        // expect it to be an number >= 0
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        expect(parseInt(res.body?.roadmapCount)).toBeGreaterThanOrEqual(0);
      });
  });

  /**
   * Test getting userDisplay's issue count
   */

  it('Get userDisplay issue count with no target or login cookie', async () => {
    await request(app)
      .get('/api/users/issue-count')
      .expect(HttpStatusCodes.BAD_REQUEST)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.message).toBeDefined();
      });
  });

  it('Get userDisplay issue count with target and no login cookie', async () => {
    await request(app)
      .get('/api/users/' + userId.toString() + '/issue-count')
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
        // expect it to be an number >= 0
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        expect(parseInt(res.body?.issueCount)).toBeGreaterThanOrEqual(0);
      });
  });

  it('Get userDisplay issue count with no target and login cookie', async () => {
    await request(app)
      .get('/api/users/issue-count')
      .set('Cookie', loginCookie)
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
        // expect it to be an number >= 0
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        expect(parseInt(res.body?.issueCount)).toBeGreaterThanOrEqual(0);
      });
  });

  it('Get userDisplay issue count with target and login cookie', async () => {
    await request(app)
      .get('/api/users/' + userId.toString() + '/issue-count')
      .set('Cookie', loginCookie)
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
        // expect it to be an number >= 0
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        expect(parseInt(res.body?.issueCount)).toBeGreaterThanOrEqual(0);
      });
  });

  /**
   * Test getting userDisplay's follower count
   */

  it('Get userDisplay follower count with no target or login cookie', async () => {
    await request(app)
      .get('/api/users/follower-count')
      .expect(HttpStatusCodes.BAD_REQUEST)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.message).toBeDefined();
      });
  });

  it('Get userDisplay follower count with target and no login cookie', async () => {
    await request(app)
      .get('/api/users/' + userId.toString() + '/follower-count')
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
        // expect it to be an number >= 0
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        expect(parseInt(res.body?.followerCount)).toBeGreaterThanOrEqual(0);
      });
  });

  it('Get userDisplay follower count with no target and login cookie', async () => {
    await request(app)
      .get('/api/users/follower-count')
      .set('Cookie', loginCookie)
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
        // expect it to be an number >= 0
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        expect(parseInt(res.body?.followerCount)).toBeGreaterThanOrEqual(0);
      });
  });

  it('Get userDisplay follower count with target and login cookie', async () => {
    await request(app)
      .get('/api/users/' + userId.toString() + '/follower-count')
      .set('Cookie', loginCookie)
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
        // expect it to be an number >= 0
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        expect(parseInt(res.body?.followerCount)).toBeGreaterThanOrEqual(0);
      });
  });

  /**
   * Test getting userDisplay's following count
   */
  it('Get userDisplay following count with no target or login cookie', async () => {
    await request(app)
      .get('/api/users/following-count')
      .expect(HttpStatusCodes.BAD_REQUEST)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.message).toBeDefined();
      });
  });

  it('Get userDisplay following count with target and no login cookie', async () => {
    await request(app)
      .get('/api/users/' + userId.toString() + '/following-count')
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
        // expect it to be an number >= 0
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        expect(parseInt(res.body?.followingCount)).toBeGreaterThanOrEqual(0);
      });
  });

  it('Get userDisplay following count with no target and login cookie', async () => {
    await request(app)
      .get('/api/users/following-count')
      .set('Cookie', loginCookie)
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
        // expect it to be an number >= 0
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        expect(parseInt(res.body?.followingCount)).toBeGreaterThanOrEqual(0);
      });
  });

  it('Get userDisplay following count with target and login cookie', async () => {
    await request(app)
      .get('/api/users/' + userId.toString() + '/following-count')
      .set('Cookie', loginCookie)
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
        // expect it to be an number >= 0
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        expect(parseInt(res.body?.followingCount)).toBeGreaterThanOrEqual(0);
      });
  });

  /**
   ! Test following a userDisplay
   */

  it('Follow self with no login cookie', async () => {
    await request(app)
      .get('/api/users/' + userId.toString() + '/follow')
      .expect(HttpStatusCodes.UNAUTHORIZED)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.message).toBeDefined();
      });
  });

  it('Follow self with login cookie', async () => {
    await request(app)
      .get('/api/users/' + userId.toString() + '/follow')
      .set('Cookie', loginCookie)
      .expect(HttpStatusCodes.FORBIDDEN)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
      });
  });

  it('Follow userDisplay with login cookie', async () => {
    await request(app)
      .get('/api/users/' + userId2.toString() + '/follow')
      .set('Cookie', loginCookie)
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
      });
  });

  it('Follow userDisplay with login cookie again', async () => {
    await request(app)
      .get('/api/users/' + userId2.toString() + '/follow')
      .set('Cookie', loginCookie)
      .expect(HttpStatusCodes.BAD_REQUEST)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
      });
  });

  /**
   ! Test unfollowing a userDisplay
   */

  it('Unfollow self with no login cookie', async () => {
    await request(app)
      .delete('/api/users/' + userId.toString() + '/follow')
      .expect(HttpStatusCodes.UNAUTHORIZED)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.message).toBeDefined();
      });
  });

  it('Unfollow self with login cookie', async () => {
    await request(app)
      .delete('/api/users/' + userId.toString() + '/follow')
      .set('Cookie', loginCookie)
      .expect(HttpStatusCodes.FORBIDDEN)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
      });
  });

  it('Unfollow userDisplay with login cookie', async () => {
    await request(app)
      .delete('/api/users/' + userId2.toString() + '/follow')
      .set('Cookie', loginCookie)
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
      });
  });

  it('Unfollow userDisplay with login cookie again', async () => {
    await request(app)
      .delete('/api/users/' + userId2.toString() + '/follow')
      .set('Cookie', loginCookie)
      .expect(HttpStatusCodes.BAD_REQUEST)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
      });
  });

  /**
   ! Test Updating the User
   */

  // all will fail because no login cookie so only test one
  it('Update userDisplay with no login cookie', async () => {
    await request(app)
      .post('/api/users/')
      .send({})
      .expect(HttpStatusCodes.UNAUTHORIZED)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.message).toBeDefined();
      });
  });

  it('Update userDisplay pfp with login cookie', async () => {
    await request(app)
      .post('/api/users/profile-picture')
      .set('Cookie', loginCookie)
      .send({
        avatarURL:
          'https://www.google.com/images/branding/googlelogo/2x/' +
          'googlelogo_color_272x92dp.png',
      })
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
      });
  });

  it('Update userDisplay Bio with login cookie', async () => {
    await request(app)
      .post('/api/users/bio')
      .set('Cookie', loginCookie)
      .send({ bio: 'I am a test userDisplay' })
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
      });
  });

  it('Update userDisplay quote with login cookie', async () => {
    await request(app)
      .post('/api/users/quote')
      .set('Cookie', loginCookie)
      .send({ quote: 'I am a test userDisplay' })
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
      });
  });

  it('Update userDisplay name with login cookie', async () => {
    await request(app)
      .post('/api/users/name')
      .set('Cookie', loginCookie)
      .send({ name: 'Test User' })
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
      });
  });

  it('Update userDisplay blog url with login cookie', async () => {
    await request(app)
      .post('/api/users/blog-url')
      .set('Cookie', loginCookie)
      .send({ blogUrl: 'https://www.google.com' })
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
      });
  });

  it('Update userDisplay website url with login cookie', async () => {
    await request(app)
      .post('/api/users/website-url')
      .set('Cookie', loginCookie)
      .send({ websiteUrl: 'https://youtu.be/dQw4w9WgXcQ' })
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
      });
  });

  it('Update userDisplay github url with login cookie', async () => {
    await request(app)
      .post('/api/users/github-url')
      .set('Cookie', loginCookie)
      .send({ githubUrl: 'https://github.com/NavigoLearn' })
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
      });
  });

  it('Update userDisplay email with the same email', async () => {
    await request(app)
      .post('/api/users/email')
      .set('Cookie', loginCookie)
      .send({ email, password })
      .expect(HttpStatusCodes.BAD_REQUEST)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
      });
  });

  it('Update userDisplay email with login cookie', async () => {
    email = `testuser${Math.floor(Math.random() * 1000000)}@test.com`;
    await request(app)
      .post('/api/users/email')
      .set('Cookie', loginCookie)
      .send({ email, password })
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
      });
  });

  /*
   ! Test Deleting the User
   */

  // will fail because no login cookie
  it('Delete userDisplay with no login cookie', async () => {
    await request(app)
      .delete('/api/users/')
      .expect(HttpStatusCodes.UNAUTHORIZED)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.message).toBeDefined();
      });
  });

  it('Delete userDisplay with login cookie', async () => {
    await request(app)
      .delete('/api/users/')
      .set('Cookie', loginCookie)
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
      });
  });
});
