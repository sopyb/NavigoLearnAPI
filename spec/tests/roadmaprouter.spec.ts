import Database from '@src/util/DatabaseDriver';
import { Roadmap } from '@src/models/Roadmap';
import User from '@src/models/User';
import app from '@src/server';
import request from 'supertest';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import EnvVars from '@src/constants/EnvVars';
import axios from 'axios';

describe('Roadmap Router', () => {
  let user: User;
  let token: string;
  let roadmap: Roadmap;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let server: any;

  beforeAll(async () => {
    server = app.listen(EnvVars.Port);
    // generate email
    const email = Math.random().toString(36).substring(2, 15) + '@test.com';
    // generate password
    const password = Math.random().toString(36).substring(2, 15);

    // register user
    const res = await request(app).post('/api/auth/register')
      .send({ email, password })
      .expect(HttpStatusCodes.OK);

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
    // close server
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    await server.close();

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
      .expect(HttpStatusCodes.OK);

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

  it('should not create a roadmap if token not found', async () => {
    // create roadmap
    await request(app).post('/api/roadmaps/create')
      .send({ roadmap: roadmap.toJSON() })
      .expect(HttpStatusCodes.UNAUTHORIZED);
  });

  /*
   ! Get Roadmap Tests
   */

  it('should get a roadmap', async () => {
    // get roadmap
    const res = await request(app).get(`/api/roadmaps/${roadmap.id}`)
      .expect(HttpStatusCodes.OK);

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

  it('Should fail to get a roadmap that does not exist', async () => {
    // get roadmap
    await request(app).get(`/api/roadmaps/${roadmap.id + BigInt(1)}`)
      .expect(HttpStatusCodes.NOT_FOUND);
  });

  it('Should get a roadmap minified', async () => {
    // get roadmap
    const res = await request(app).get(`/api/roadmaps/${roadmap.id}/mini`)
      .expect(HttpStatusCodes.OK);

    type MiniRoadmap = {
      id: bigint;
      name: string;
      description: string;
      ownerId: bigint;
    }

    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-argument
    const resRoadmap: MiniRoadmap = JSON.parse(res.text);

    // ensure types are correct
    resRoadmap.id = BigInt(resRoadmap.id);
    resRoadmap.ownerId = BigInt(resRoadmap.ownerId);

    // check if roadmap matches dbroadmap
    expect(roadmap.id).toEqual(resRoadmap.id);
    expect(roadmap.name).toEqual(resRoadmap.name);
    expect(roadmap.description).toEqual(resRoadmap.description);
    expect(roadmap.ownerId).toEqual(resRoadmap.ownerId);
  });

  it('Should fail to get a roadmap minified that does not exist', async () => {
    // get roadmap
    await request(app).get(`/api/roadmaps/${roadmap.id + BigInt(1)}/mini`)
      .expect(HttpStatusCodes.NOT_FOUND);
  });

  it('Should be a able to get roadmap tags',
    async () => {
      await request(app).get(`/api/roadmaps/${roadmap.id}/tags`)
        .expect(HttpStatusCodes.OK);
    });

  it('Should fail to get roadmap tags if roadmap does not exist',
    async () => {
      await request(app).get(`/api/roadmaps/${roadmap.id + BigInt(1)}/tags`)
        .expect(HttpStatusCodes.NOT_FOUND);
    });

  it('Should be able to get roadmap owner profile',
    async () => {
      const res = await axios.get(
        // eslint-disable-next-line max-len
        `http://localhost:${EnvVars.Port}/api/roadmaps/${roadmap.id}/owner`);

      expect(res.status).toEqual(HttpStatusCodes.OK);
    });

  it('Should fail to get roadmap owner profile if roadmap does not exist',
    async () => {
      await request(app).get(`/api/roadmaps/${roadmap.id + BigInt(1)}/owner`)
        .expect(HttpStatusCodes.NOT_FOUND);
    });

  it('Should be able to get roadmap owner profile minified',
    async () => {

      const res = await axios.get(
        // eslint-disable-next-line max-len
        `http://localhost:${EnvVars.Port}/api/roadmaps/${roadmap.id}/owner/mini`);

      expect(res.status).toEqual(HttpStatusCodes.OK);
    });

  // eslint-disable-next-line max-len
  it('Should fail to get roadmap owner profile minified if roadmap does not exist',
    async () => {
      await request(app).get(
        `/api/roadmaps/${roadmap.id + BigInt(1)}/owner/mini`)
        .expect(HttpStatusCodes.NOT_FOUND);
    });

  /*
   ! Delete Roadmap Test
   */

  it('should Delete a roadmap', async () => {
    // delete roadmap
    await request(app).delete(`/api/roadmaps/${roadmap.id}`)
      .set('Cookie', `token=${token}`)
      .expect(HttpStatusCodes.OK);

    // get database
    const db = new Database();

    // get roadmap from database
    const dbroadmap = await db.get<Roadmap>('roadmaps', roadmap.id);

    // check if roadmap matches dbroadmap
    expect(dbroadmap).toBeUndefined();
  });
});