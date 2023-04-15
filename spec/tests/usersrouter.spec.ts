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
  // get user and expect 200 response
  await request(app).get(
    '/api/users/' + (!!target ? target : '') + (mini ? '/mini' : ''))
    .set('Cookie', loginCookie ?? '')
    .expect((!!loginCookie || !!target) ?
      HttpStatusCodes.OK : HttpStatusCodes.NOT_FOUND)
    .expect('Content-Type', /json/)
    .expect((res) => {
      const receivedUser: object = res.body;
      // check for keys
      const objKeys = Object.keys(receivedUser);

      if (!target && !loginCookie) {
        expect(objKeys).toContain('error');
        return;
      }

      expect(objKeys).toContain('type');
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

  // second user for testing
  let email2: string;
  let password2: string;
  let userId2: bigint;

  // set up a user to run tests on
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

    await request(app).post('/api/auth/register')
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

    // get user from database
    const user = await db.getWhere<IUser>('users', 'email', email);
    const user2 = await db.getWhere<IUser>('users', 'email', email2);

    // get user id
    userId = user?.id ?? BigInt(-1);
    userId2 = user2?.id ?? BigInt(-1);

    if (userId < 0 || userId2 < 0) {
      // can't run tests without a user
      throw new Error('Failed to create user');
    }
  });

  // delete the user after tests
  afterAll(async () => {
    // get database
    const db = new Database();

    // see if user exists
    const user = await db.getWhere<IUser>('users', 'email', email);
    const user2 = await db.getWhere<IUser>('users', 'email', email2);

    // if user exists, delete them
    if (user) await db.delete('users', user.id);
    if (user2) await db.delete('users', user2.id);
  });

  /**
   * Test getting a user's profile
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
   * Test getting user's roadmaps
   */
  it('Get user roadmaps with no target or login cookie', async () => {
    await request(app).get('/api/users/roadmaps')
      .expect(HttpStatusCodes.BAD_REQUEST)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.error).toBeDefined();
      });
  });

  it('Get user roadmaps with target and no login cookie', async () => {
    await request(app).get('/api/users/' + userId.toString() + '/roadmaps')
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

  it('Get user roadmaps with no target and login cookie', async () => {
    await request(app).get('/api/users/roadmaps')
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

  it('Get user roadmaps with target and login cookie', async () => {
    await request(app).get('/api/users/' + userId.toString() + '/roadmaps')
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
   * Test getting user's issues
   */
  it('Get user issues with no target or login cookie', async () => {
    await request(app).get('/api/users/issues')
      .expect(HttpStatusCodes.BAD_REQUEST)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.error).toBeDefined();
      });
  });

  it('Get user issues with target and no login cookie', async () => {
    await request(app).get('/api/users/' + userId.toString() + '/issues')
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(Array.isArray(res.body?.issues)).toBe(true);
      });
  });

  it('Get user issues with no target and login cookie', async () => {
    await request(app).get('/api/users/issues')
      .set('Cookie', loginCookie)
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
        // expect it to be an array
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(Array.isArray(res.body?.issues)).toBe(true);
      });
  });

  it('Get user issues with target and login cookie', async () => {
    await request(app).get('/api/users/' + userId.toString() + '/issues')
      .set('Cookie', loginCookie)
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
        // expect it to be an array
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(Array.isArray(res.body?.issues)).toBe(true);
      });
  });

  /**
   * Test getting user's followers
   */
  it('Get user followers with no target or login cookie', async () => {
    await request(app).get('/api/users/followers')
      .expect(HttpStatusCodes.BAD_REQUEST)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.error).toBeDefined();
      });
  });

  it('Get user followers with target and no login cookie', async () => {
    await request(app).get('/api/users/' + userId.toString() + '/followers')
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(Array.isArray(res.body?.followers)).toBe(true);
      });
  });

  it('Get user followers with no target and login cookie', async () => {
    await request(app).get('/api/users/followers')
      .set('Cookie', loginCookie)
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
        // expect it to be an array
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(Array.isArray(res.body?.followers)).toBe(true);
      });
  });

  it('Get user followers with target and login cookie', async () => {
    await request(app).get('/api/users/' + userId.toString() + '/followers')
      .set('Cookie', loginCookie)
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
        // expect it to be an array
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(Array.isArray(res.body?.followers)).toBe(true);
      });
  });

  /**
   * Test getting user's following
   */
  it('Get user following with no target or login cookie', async () => {
    await request(app).get('/api/users/following')
      .expect(HttpStatusCodes.BAD_REQUEST)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.error).toBeDefined();
      });
  });

  it('Get user following with target and no login cookie', async () => {
    await request(app).get('/api/users/' + userId.toString() + '/following')
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(Array.isArray(res.body?.following)).toBe(true);
      });
  });

  it('Get user following with no target and login cookie', async () => {
    await request(app).get('/api/users/following')
      .set('Cookie', loginCookie)
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
        // expect it to be an array
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(Array.isArray(res.body?.following)).toBe(true);
      });
  });

  it('Get user following with target and login cookie', async () => {
    await request(app).get('/api/users/' + userId.toString() + '/following')
      .set('Cookie', loginCookie)
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
        // expect it to be an array
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(Array.isArray(res.body?.following)).toBe(true);
      });
  });

  /**
   * Test getting user's Roadmap count
   */
  it('Get user Roadmap count with no target or login cookie', async () => {
    await request(app).get('/api/users/roadmap-count')
      .expect(HttpStatusCodes.BAD_REQUEST)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.error).toBeDefined();
      });
  });

  it('Get user Roadmap count with target and no login cookie', async () => {
    await request(app).get('/api/users/' + userId.toString() + '/roadmap-count')
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

  it('Get user Roadmap count with no target and login cookie', async () => {
    await request(app).get('/api/users/roadmap-count')
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

  it('Get user Roadmap count with target and login cookie', async () => {
    await request(app).get('/api/users/' + userId.toString() + '/roadmap-count')
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
   * Test getting user's issue count
   */

  it('Get user issue count with no target or login cookie', async () => {
    await request(app).get('/api/users/issue-count')
      .expect(HttpStatusCodes.BAD_REQUEST)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.error).toBeDefined();
      });
  });

  it('Get user issue count with target and no login cookie', async () => {
    await request(app).get('/api/users/' + userId.toString() + '/issue-count')
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

  it('Get user issue count with no target and login cookie', async () => {
    await request(app).get('/api/users/issue-count')
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

  it('Get user issue count with target and login cookie', async () => {
    await request(app).get('/api/users/' + userId.toString() + '/issue-count')
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
   * Test getting user's follower count
   */

  it('Get user follower count with no target or login cookie', async () => {
    await request(app).get('/api/users/follower-count')
      .expect(HttpStatusCodes.BAD_REQUEST)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.error).toBeDefined();
      });
  });

  it('Get user follower count with target and no login cookie', async () => {
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

  it('Get user follower count with no target and login cookie', async () => {
    await request(app).get('/api/users/follower-count')
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

  it('Get user follower count with target and login cookie', async () => {
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
   * Test getting user's following count
   */
  it('Get user following count with no target or login cookie', async () => {
    await request(app).get('/api/users/following-count')
      .expect(HttpStatusCodes.BAD_REQUEST)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.error).toBeDefined();
      });
  });

  it('Get user following count with target and no login cookie', async () => {
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

  it('Get user following count with no target and login cookie', async () => {
    await request(app).get('/api/users/following-count')
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

  it('Get user following count with target and login cookie', async () => {
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
   ! Test following a user
   */

  it('Follow self with no login cookie', async () => {
    await request(app).get('/api/users/' + userId.toString() + '/follow')
      .expect(HttpStatusCodes.UNAUTHORIZED)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.error).toBeDefined();
      });
  });

  it('Follow self with login cookie', async () => {
    await request(app).get('/api/users/' + userId.toString() + '/follow')
      .set('Cookie', loginCookie)
      .expect(HttpStatusCodes.FORBIDDEN)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
      });
  });

  it('Follow user with login cookie', async () => {
    await request(app).get('/api/users/' + userId2.toString() + '/follow')
      .set('Cookie', loginCookie)
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
      });
  });

  it('Follow user with login cookie again', async () => {
    await request(app).get('/api/users/' + userId2.toString() + '/follow')
      .set('Cookie', loginCookie)
      .expect(HttpStatusCodes.BAD_REQUEST)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
      });
  });

  /**
   ! Test unfollowing a user
   */

  it('Unfollow self with no login cookie', async () => {
    await request(app).get('/api/users/' + userId.toString() + '/unfollow')
      .expect(HttpStatusCodes.UNAUTHORIZED)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.error).toBeDefined();
      });
  });

  it('Unfollow self with login cookie', async () => {
    await request(app).get('/api/users/' + userId.toString() + '/unfollow')
      .set('Cookie', loginCookie)
      .expect(HttpStatusCodes.FORBIDDEN)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
      });
  });

  it('Unfollow user with login cookie', async () => {
    await request(app).get('/api/users/' + userId2.toString() + '/unfollow')
      .set('Cookie', loginCookie)
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
      });
  });

  it('Unfollow user with login cookie again', async () => {
    await request(app).get('/api/users/' + userId2.toString() + '/unfollow')
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
  it('Update user with no login cookie', async () => {
    await request(app).post('/api/users/')
      .send({})
      .expect(HttpStatusCodes.UNAUTHORIZED)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.error).toBeDefined();
      });
  });

  it('Update user pfp with login cookie', async () => {
    await request(app).post('/api/users/profile-picture')
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

  it('Update user Bio with login cookie', async () => {
    await request(app).post('/api/users/bio')
      .set('Cookie', loginCookie)
      .send({ bio: 'I am a test user' })
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
      });
  });

  it('Update user quote with login cookie', async () => {
    await request(app).post('/api/users/quote')
      .set('Cookie', loginCookie)
      .send({ quote: 'I am a test user' })
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
      });
  });

  it('Update user name with login cookie', async () => {
    await request(app).post('/api/users/name')
      .set('Cookie', loginCookie)
      .send({ name: 'Test User' })
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
      });
  });

  it('Update user blog url with login cookie', async () => {
    await request(app).post('/api/users/blog-url')
      .set('Cookie', loginCookie)
      .send({ blogUrl: 'https://www.google.com' })
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
      });
  });

  it('Update user website url with login cookie', async () => {
    await request(app).post('/api/users/website-url')
      .set('Cookie', loginCookie)
      .send({ websiteUrl: 'https://youtu.be/dQw4w9WgXcQ' })
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
      });
  });

  it('Update user github url with login cookie', async () => {
    await request(app).post('/api/users/github-url')
      .set('Cookie', loginCookie)
      .send({ githubUrl: 'https://github.com/NavigoLearn' })
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
      });
  });

  it('Update user email with the same email', async () => {
    await request(app).post('/api/users/email')
      .set('Cookie', loginCookie)
      .send({ email, password })
      .expect(HttpStatusCodes.BAD_REQUEST)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
      });
  });

  it('Update user email with login cookie', async () => {
    email = `testuser${Math.floor(Math.random() * 1000000)}@test.com`;
    await request(app).post('/api/users/email')
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
  it('Delete user with no login cookie', async () => {
    await request(app).delete('/api/users/')
      .expect(HttpStatusCodes.UNAUTHORIZED)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.error).toBeDefined();
      });
  });

  it('Delete user with login cookie', async () => {
    await request(app).delete('/api/users/')
      .set('Cookie', loginCookie)
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toBeDefined();
      });
  });
});