import Database from '@src/util/DatabaseDriver';
import { Roadmap } from '@src/models/Roadmap';
import User from '@src/models/User';
import app from '@src/server';
import request from 'supertest';

describe('Roadmap Router', () => {
  let user: User;
  let token: string;
  let roadmap: Roadmap;

  beforeAll(async () => {
    // generate email
    const email = Math.random().toString(36).substring(2, 15) + '@test.com';
    // generate password
    const password = Math.random().toString(36).substring(2, 15);

    // register user
    const res = await request(app).post('/api/auth/register')
      .send({ email, password })
      .expect(200);

    // get token
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    token = res.header['set-cookie'][0].split(';')[0].split('=')[1] as string;

    // get database
    const db = new Database();

    // get user
    const dbuser = await db.getWhere<User>('users', 'email', email);

    // if user is undefined cancel tests
    if (!dbuser) {
      throw new Error('User is undefined');
    }

    // set user
    user = dbuser;

    // set roadmap
    roadmap = new Roadmap(
      user.id,
      'Test Roadmap',
      'This is a test roadmap',
      'Test',
    );
  });

  afterAll(async () => {
    // get database
    const db = new Database();

    // delete user - will cascade delete roadmap
    await db.delete('users', user.id);
  });

  /*
   ! Create Roadmap Test
   */

  it('should create a roadmap', async () => {
    // create roadmap
    const res = await request(app).post('/api/roadmaps/create')
      .set('Cookie', `token=${token}`)
      .send({ roadmap: roadmap.toJSON() })
      .expect(200);

    // if id is undefined
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!res.body?.id) {
      throw new Error('Id is undefined');
    }

    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment,@typescript-eslint/no-unsafe-member-access
    const id = res.body.id as number || -1;

    // set id
    roadmap.id = BigInt(id);

    // get database
    const db = new Database();

    // get roadmap from database
    const dbroadmap: Roadmap =
      await db.get<Roadmap>('roadmaps', roadmap.id) || {} as Roadmap;

    // check if roadmap matches dbroadmap
    expect(roadmap.id).toEqual(dbroadmap.id);
    expect(roadmap.name).toEqual(dbroadmap.name);
    expect(roadmap.description).toEqual(dbroadmap.description);
    expect(roadmap.ownerId).toEqual(dbroadmap.ownerId);
  });

  /*
   ! Get Roadmap Tests
   */

  it('should get a roadmap', async () => {
  // get roadmap
    const res = await request(app).get(`/api/roadmaps/${roadmap.id}`)
      .set('Cookie', `token=${token}`)
      .expect(200);

    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-argument
    const resRoadmap: Roadmap = Roadmap.from(res.body);

    if (!resRoadmap)

    // check if roadmap matches dbroadmap
      expect(roadmap.id).toEqual(resRoadmap);
    expect(roadmap.name).toEqual(resRoadmap.name);
    expect(roadmap.description).toEqual(resRoadmap.description);
    expect(roadmap.ownerId).toEqual(resRoadmap.ownerId);
  });

  /*
   ! Delete Roadmap Test
   */

  it('should Delete a roadmap', async () => {
    // delete roadmap
    await request(app).delete(`/api/roadmaps/${roadmap.id}`)
      .set('Cookie', `token=${token}`)
      .expect(200);

    // get database
    const db = new Database();

    // get roadmap from database
    const dbroadmap = await db.get<Roadmap>('roadmaps', roadmap.id);

    // check if roadmap matches dbroadmap
    expect(dbroadmap).toBeUndefined();
  });
});