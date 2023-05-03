import User from '@src/models/User';
import { Roadmap } from '@src/models/Roadmap';
import { Issue } from '@src/models/Issue';
import app from '@src/server';
import request from 'supertest';
import Database from '@src/util/DatabaseDriver';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';

describe('Roadmap Issues', () => {
  let user: User, user2: User;
  let token: string, token2: string;
  let roadmap: Roadmap;
  let issueid: bigint, issueid2: bigint;

  beforeAll(async () => {
    // generate email
    const email = Math.random().toString(36).substring(2, 15) + '@test.com';
    const email2 = Math.random().toString(36).substring(2, 15) + '@test.com';
    // generate password
    const password = Math.random().toString(36).substring(2, 15);
    const password2 = Math.random().toString(36).substring(2, 15);

    // register userDisplay
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email, password })
      .expect(HttpStatusCodes.CREATED);
    const res2 = await request(app)
      .post('/api/auth/register')
      .send({ email: email2, password: password2 })
      .expect(HttpStatusCodes.CREATED);

    // get userDisplay token
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    token = res.header['set-cookie'][0].split(';')[0].split('=')[1] as string;

    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    token2 = res2.header['set-cookie'][0].split(';')[0].split('=')[1] as string;

    // get database
    const db = new Database();

    // get userDisplay
    const dbuser = await db.getWhere<User>('users', 'email', email);

    // get user2
    const dbuser2 = await db.getWhere<User>('users', 'email', email2);

    // check if userDisplay exists
    if (!dbuser || !dbuser2) throw new Error('User not found');

    // set userDisplay
    user = dbuser;
    user2 = dbuser2;

    // create roadmap
    const res3 = await request(app)
      .post('/api/roadmaps/create')
      .set('Cookie', [`token=${token}`])
      .send({
        roadmap: new Roadmap(
          user.id,
          'Test Roadmap',
          'Test Description',
          'datra',
        ).toJSON(),
      })
      .expect(HttpStatusCodes.CREATED);

    // get roadmap
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
    const dbroadmap = await db.get<Roadmap>('roadmaps', res3.body.id);

    // check if roadmap exists
    if (!dbroadmap) throw new Error('Roadmap not found');

    // set roadmap
    roadmap = dbroadmap;
  });

  afterAll(async () => {
    // get database
    const db = new Database();

    // delete userDisplay
    const success = await db.delete('users', user.id);
    const success2 = await db.delete('users', user2.id);

    // check if userDisplay was deleted
    expect(success).toBe(true);
    expect(success2).toBe(true);
  });

  /*
   ! Create Issue Tests
   */

  it('should create an issue if userDisplay is roadmap owner', async () => {
    // create issue
    const res = await request(app)
      .post(`/api/roadmaps/${roadmap.id}/issues/create`)
      .set('Cookie', `token=${token}`)
      .send({
        issue: new Issue(
          roadmap.id,
          user.id,
          true,
          'datra',
          'Test content',
        ).toJSON(),
      })
      .expect(HttpStatusCodes.CREATED)
      .expect((res) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(res?.body?.id).toBeDefined();
      });

    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    issueid = res.body.id;
  });

  it('should create an issue if userDisplay is not roadmap owner', async () => {
    // create issue
    const res = await request(app)
      .post(`/api/roadmaps/${roadmap.id}/issues/create`)
      .set('Cookie', `token=${token2}`)
      .send({
        issue: new Issue(
          roadmap.id,
          user2.id,
          true,
          'datra',
          'Test content',
        ).toJSON(),
      })
      .expect(HttpStatusCodes.CREATED)
      .expect((res) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(res?.body?.id).toBeDefined();
      });

    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    issueid2 = res.body.id;
  });

  it('should fail to create an issue if not logged in', async () => {
    // create issue
    await request(app)
      .post(`/api/roadmaps/${roadmap.id}/issues/create`)
      .send({
        issue: new Issue(
          roadmap.id,
          user.id,
          true,
          'datra',
          'Test content',
        ).toJSON(),
      })
      .expect(HttpStatusCodes.UNAUTHORIZED);
  });

  /*
   ! Get Issue Tests
   */

  it('should get an issue', async () => {
    // get issue
    await request(app)
      .get(`/api/roadmaps/${roadmap.id}/issues/${issueid}`)
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(res?.body?.issue).toBeDefined();
      });
  });

  it("should fail to get an issue that doesn't exist", async () => {
    // get issue
    await request(app).get(`/api/roadmaps/${roadmap.id}/issues/${issueid}2`);
  });

  /*
   ! Update Issue Tests
   */

  it('should fail to update an issue if not logged in', async () => {
    // update issue
    await request(app)
      .post(`/api/roadmaps/${roadmap.id}/issues/${issueid}`)
      .expect(HttpStatusCodes.UNAUTHORIZED);
  });

  it('should be able to update title of issue', async () => {
    // update issue
    await request(app)
      .post(`/api/roadmaps/${roadmap.id}/issues/${issueid}/title`)
      .set('Cookie', `token=${token}`)
      .send({
        title: 'New Test Title',
      })
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(res?.body?.success).toBe(true);
      });
  });

  it('should not be able to update title of issue if not owner', async () => {
    // update issue
    await request(app)
      .post(`/api/roadmaps/${roadmap.id}/issues/${issueid2}/title`)
      .set('Cookie', `token=${token}`)
      .send({
        title: 'New Test Title',
      })
      .expect(HttpStatusCodes.UNAUTHORIZED);
  });

  it('should not be able to update title of issue if not logged in', async () => {
    // update issue
    await request(app)
      .post(`/api/roadmaps/${roadmap.id}/issues/${issueid2}/title`)
      .send({
        title: 'New Test Title',
      })
      .expect(HttpStatusCodes.UNAUTHORIZED);
  });

  it('should be able to update content of issue', async () => {
    // update issue
    await request(app)
      .post(`/api/roadmaps/${roadmap.id}/issues/${issueid}/content`)
      .set('Cookie', `token=${token}`)
      .send({
        content: 'New Test Content',
      })
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(res?.body?.success).toBe(true);
      });
  });

  it('should not be able to update content of issue if not owner', async () => {
    // update issue
    await request(app)
      .post(`/api/roadmaps/${roadmap.id}/issues/${issueid2}/content`)
      .set('Cookie', `token=${token}`)
      .send({
        content: 'New Test Content',
      })
      .expect(HttpStatusCodes.UNAUTHORIZED);
  });

  it('should not be able to update content of issue if not logged in', async () => {
    // update issue
    await request(app)
      .post(`/api/roadmaps/${roadmap.id}/issues/${issueid2}/content`)
      .send({
        content: 'New Test Content',
      })
      .expect(HttpStatusCodes.UNAUTHORIZED);
  });

  it('should be able to open issue', async () => {
    // update issue
    await request(app)
      .get(`/api/roadmaps/${roadmap.id}/issues/${issueid}/status`)
      .set('Cookie', `token=${token}`)
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(res?.body?.success).toBe(true);
      });
  });

  it('should be able to open issue if roadmap owner', async () => {
    // update issue
    await request(app)
      .get(`/api/roadmaps/${roadmap.id}/issues/${issueid2}/status`)
      .set('Cookie', `token=${token}`)
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(res?.body?.success).toBe(true);
      });
  });

  it('should not be able to open issue if not owner of issue or roadmap', async () => {
    // update issue
    await request(app)
      .get(`/api/roadmaps/${roadmap.id}/issues/${issueid}/status`)
      .set('Cookie', `token=${token2}`)
      .expect(HttpStatusCodes.FORBIDDEN);
  });

  it('should not be able to open issue if not logged in', async () => {
    // update issue
    await request(app)
      .get(`/api/roadmaps/${roadmap.id}/issues/${issueid}/status`)
      .expect(HttpStatusCodes.UNAUTHORIZED);
  });

  it('should be able to close issue', async () => {
    // update issue
    await request(app)
      .delete(`/api/roadmaps/${roadmap.id}/issues/${issueid}/status`)
      .set('Cookie', `token=${token}`)
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(res?.body?.success).toBe(true);
      });
  });

  it('should be able to close issue if roadmap owner', async () => {
    // update issue
    await request(app)
      .delete(`/api/roadmaps/${roadmap.id}/issues/${issueid2}/status`)
      .set('Cookie', `token=${token}`)
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(res?.body?.success).toBe(true);
      });
  });

  it('should not be able to close issue if not owner of issue or roadmap', async () => {
    // update issue
    await request(app)
      .delete(`/api/roadmaps/${roadmap.id}/issues/${issueid}/status`)
      .set('Cookie', `token=${token2}`)
      .expect(HttpStatusCodes.FORBIDDEN);
  });

  it('should not be able to close issue if not logged in', async () => {
    // update issue
    await request(app)
      .delete(`/api/roadmaps/${roadmap.id}/issues/${issueid}/status`)
      .expect(HttpStatusCodes.UNAUTHORIZED);
  });

  /*
   ! Delete Issue Tests
   */

  it('should fail to delete an issue if not logged in', async () => {
    // delete issue
    await request(app)
      .delete(`/api/roadmaps/${roadmap.id}/issues/${issueid}`)
      .expect(HttpStatusCodes.UNAUTHORIZED);
  });

  it('should fail to delete an issue if not owner of issue/roadmap', async () => {
    // delete issue
    await request(app)
      .delete(`/api/roadmaps/${roadmap.id}/issues/${issueid}`)
      .set('Cookie', `token=${token2}`)
      .expect(HttpStatusCodes.FORBIDDEN);
  });

  it('should delete an issue', async () => {
    // delete issue
    await request(app)
      .delete(`/api/roadmaps/${roadmap.id}/issues/${issueid}`)
      .set('Cookie', `token=${token}`)
      .expect(HttpStatusCodes.OK);
  });

  it('should be able to delete an issue if owner of roadmap', async () => {
    // delete issue
    await request(app)
      .delete(`/api/roadmaps/${roadmap.id}/issues/${issueid2}`)
      .set('Cookie', `token=${token}`)
      .expect(HttpStatusCodes.OK);
  });
});
