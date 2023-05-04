import Database from '@src/util/DatabaseDriver';
import { Roadmap } from '@src/models/Roadmap';
import User from '@src/models/User';
import app from '@src/server';
import request from 'supertest';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import EnvVars from '@src/constants/EnvVars';
import axios from 'axios';

describe('Roadmap Router', () => {
  let user: User, user2: User, token: string, token2: string, roadmap: Roadmap;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let server: any;

  beforeAll(async () => {
    server = app.listen(EnvVars.Port);
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

    // get token
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    token = res.header['set-cookie'][0].split(';')[0].split('=')[1] as string;

    const res2 = await request(app)
      .post('/api/auth/register')
      .send({ email: email2, password: password2 })
      .expect(HttpStatusCodes.CREATED);

    // get token
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    token2 = res2.header['set-cookie'][0].split(';')[0].split('=')[1] as string;

    // get database
    const db = new Database();

    // get userDisplay
    const dbuser = await db.getWhere<User>('users', 'email', email);
    const dbuser2 = await db.getWhere<User>('users', 'email', email2);

    // if userDisplay is undefined cancel tests
    if (!dbuser || !dbuser2) {
      throw new Error('User is undefined');
    }

    // set userDisplay
    user = dbuser;
    user2 = dbuser2;

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

    // delete userDisplay - will cascade delete roadmap
    await db.delete('users', user.id);
    await db.delete('users', user2.id);
  });

  /*
   ! Create Roadmap Test
   */

  it('should create a roadmap', async () => {
    // create roadmap
    const res = await request(app)
      .post('/api/roadmaps/create')
      .set('Cookie', `token=${token}`)
      .send({ roadmap: roadmap.toJSONSafe() })
      .expect(HttpStatusCodes.CREATED);

    // if id is undefined
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!res.body?.id) {
      throw new Error('Id is undefined');
    }

    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment,@typescript-eslint/no-unsafe-member-access
    const id = (res.body.id as number) || -1;

    // set id
    roadmap.id = BigInt(id);

    // get database
    const db = new Database();

    // get roadmap from database
    const dbroadmap: Roadmap =
      (await db.get<Roadmap>('roadmaps', roadmap.id)) || ({} as Roadmap);

    // check if roadmap matches dbroadmap
    expect(roadmap.id).toEqual(dbroadmap.id);
    expect(roadmap.name).toEqual(dbroadmap.name);
    expect(roadmap.description).toEqual(dbroadmap.description);
    expect(roadmap.ownerId).toEqual(dbroadmap.ownerId);
  });

  it('should not create a roadmap if userDisplay is not logged in', async () => {
    // create roadmap
    await request(app)
      .post('/api/roadmaps/create')
      .send({ roadmap: roadmap.toJSONSafe() })
      .expect(HttpStatusCodes.UNAUTHORIZED);
  });

  it('should not create a roadmap if token not found', async () => {
    // create roadmap
    await request(app)
      .post('/api/roadmaps/create')
      .send({ roadmap: roadmap.toJSONSafe() })
      .expect(HttpStatusCodes.UNAUTHORIZED);
  });

  it('should not create a roadmap if token is invalid', async () => {
    // create roadmap
    await request(app)
      .post('/api/roadmaps/create')
      .set('Cookie', 'token=invalidtoken')
      .send({ roadmap: roadmap.toJSONSafe() })
      .expect(HttpStatusCodes.UNAUTHORIZED);
  });

  /*
   ! Get Roadmap Tests
   */

  it('should get a roadmap', async () => {
    // get roadmap
    const res = await request(app)
      .get(`/api/roadmaps/${roadmap.id}`)
      .expect(HttpStatusCodes.OK);

    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-argument
    const resRoadmap: Roadmap = Roadmap.from(res.body);

    expect(roadmap.name).toEqual(resRoadmap.name);
    expect(roadmap.description).toEqual(resRoadmap.description);
    expect(roadmap.ownerId).toEqual(resRoadmap.ownerId);
  });

  it('Should fail to get a roadmap that does not exist', async () => {
    // get roadmap
    await request(app)
      .get(`/api/roadmaps/${roadmap.id + BigInt(1)}`)
      .expect(HttpStatusCodes.NOT_FOUND);
  });

  it('Should get a roadmap minified', async () => {
    // get roadmap
    const res = await request(app)
      .get(`/api/roadmaps/${roadmap.id}/mini`)
      .expect(HttpStatusCodes.OK);

    type MiniRoadmap = {
      id: bigint;
      name: string;
      description: string;
      ownerId: bigint;
    };

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
    await request(app)
      .get(`/api/roadmaps/${roadmap.id + BigInt(1)}/mini`)
      .expect(HttpStatusCodes.NOT_FOUND);
  });

  it('Should be a able to get roadmap tags', async () => {
    await request(app)
      .get(`/api/roadmaps/${roadmap.id}/tags`)
      .expect(HttpStatusCodes.OK);
  });

  it('Should fail to get roadmap tags if roadmap does not exist', async () => {
    await request(app)
      .get(`/api/roadmaps/${roadmap.id + BigInt(1)}/tags`)
      .expect(HttpStatusCodes.NOT_FOUND);
  });

  it('Should be able to get roadmap owner profile', async () => {
    const res = await axios.get(
      // eslint-disable-next-line max-len
      `http://localhost:${EnvVars.Port}/api/roadmaps/${roadmap.id}/owner`,
    );

    expect(res.status).toEqual(HttpStatusCodes.OK);
  });

  it('Should fail to get roadmap owner profile if roadmap does not exist', async () => {
    await request(app)
      .get(`/api/roadmaps/${roadmap.id + BigInt(1)}/owner`)
      .expect(HttpStatusCodes.NOT_FOUND);
  });

  it('Should be able to get roadmap owner profile minified', async () => {
    const res = await axios.get(
      // eslint-disable-next-line max-len
      `http://localhost:${EnvVars.Port}/api/roadmaps/${roadmap.id}/owner/mini`,
    );

    expect(res.status).toEqual(HttpStatusCodes.OK);
  });

  // eslint-disable-next-line max-len
  it('Should fail to get roadmap owner profile minified if roadmap does not exist', async () => {
    await request(app)
      .get(`/api/roadmaps/${roadmap.id + BigInt(1)}/owner/mini`)
      .expect(HttpStatusCodes.NOT_FOUND);
  });

  /*
  `! Update Roadmap Tests
   */

  it('Should be able to update a roadmap\'s title', async () => {
    await request(app)
      .post(`/api/roadmaps/${roadmap.id}/title`)
      .set('Cookie', `token=${token}`)
      .send({ title: 'new title' })
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(res.body.success).toEqual(true);
      });
  });

  it('Should fail to update a roadmap\'s title if not logged in', async () => {
    await request(app)
      .post(`/api/roadmaps/${roadmap.id}/title`)
      .send({ title: 'new title' })
      .expect(HttpStatusCodes.UNAUTHORIZED);
  });

  it('Should fail to update a roadmap\'s title if not owner', async () => {
    await request(app)
      .post(`/api/roadmaps/${roadmap.id}/title`)
      .set('Cookie', `token=${token2}`)
      .send({ title: 'new title' })
      .expect(HttpStatusCodes.FORBIDDEN);
  });

  it('Should be able to update a roadmap\'s description', async () => {
    await request(app)
      .post(`/api/roadmaps/${roadmap.id}/description`)
      .set('Cookie', `token=${token}`)
      .send({ description: 'new description' })
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(res.body.success).toEqual(true);
      });
  });

  it('Should fail to update a roadmap\'s description if not logged in', async () => {
    await request(app)
      .post(`/api/roadmaps/${roadmap.id}/description`)
      .send({ description: 'new description' })
      .expect(HttpStatusCodes.UNAUTHORIZED);
  });

  it('Should fail to update a roadmap\'s description if not owner', async () => {
    await request(app)
      .post(`/api/roadmaps/${roadmap.id}/description`)
      .set('Cookie', `token=${token2}`)
      .send({ description: 'new description' })
      .expect(HttpStatusCodes.FORBIDDEN);
  });

  it('Should be able to update a roadmap\'s tags', async () => {
    await request(app)
      .post(`/api/roadmaps/${roadmap.id}/tags`)
      .set('Cookie', `token=${token}`)
      .send({ tags: ['new tag'] })
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(res.body.success).toEqual(true);
      });
  });

  it('Should be able to update a roadmap\'s tags with multiple tags', async () => {
    await request(app)
      .post(`/api/roadmaps/${roadmap.id}/tags`)
      .set('Cookie', `token=${token}`)
      .send({ tags: ['new tag', 'new tag 2'] })
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(res.body.success).toEqual(true);
      });
  });

  it('Should be able to update a roadmap\'s tags with empty array', async () => {
    await request(app)
      .post(`/api/roadmaps/${roadmap.id}/tags`)
      .set('Cookie', `token=${token}`)
      .send({ tags: [] })
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(res.body.success).toEqual(true);
      });
  });

  it('Should fail to update a roadmap\'s tags if not logged in', async () => {
    await request(app)
      .post(`/api/roadmaps/${roadmap.id}/tags`)
      .send({ tags: ['new tag'] })
      .expect(HttpStatusCodes.UNAUTHORIZED);
  });

  it('Should fail to update a roadmap\'s tags if not owner', async () => {
    await request(app)
      .post(`/api/roadmaps/${roadmap.id}/tags`)
      .set('Cookie', `token=${token2}`)
      .send({ tags: ['new tag'] })
      .expect(HttpStatusCodes.FORBIDDEN);
  });

  it('Should be able to update a roadmap\'s visibility', async () => {
    await request(app)
      .post(`/api/roadmaps/${roadmap.id}/visibility`)
      .set('Cookie', `token=${token}`)
      .send({ visibility: false })

      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(res.body.success).toEqual(true);
      });
  });

  it('Should fail to update a roadmap\'s visibility if not logged in', async () => {
    await request(app)
      .post(`/api/roadmaps/${roadmap.id}/visibility`)
      .send({ visibility: 'public' })
      .expect(HttpStatusCodes.UNAUTHORIZED);
  });

  it('Should fail to update a roadmap\'s visibility if not owner', async () => {
    await request(app)
      .post(`/api/roadmaps/${roadmap.id}/visibility`)
      .set('Cookie', `token=${token2}`)
      .send({ visibility: 'public' })
      .expect(HttpStatusCodes.FORBIDDEN);
  });

  it('Should be able to update a roadmap\'s owner', async () => {
    await request(app)
      .post(`/api/roadmaps/${roadmap.id}/owner`)
      .set('Cookie', `token=${token}`)
      .send({ newOwnerId: user2.id.toString() })
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(res.body.success).toEqual(true);
      });

    // change owner back
    await request(app)
      .post(`/api/roadmaps/${roadmap.id}/owner`)
      .set('Cookie', `token=${token2}`)
      .send({ newOwnerId: user.id.toString() })
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(res.body.success).toEqual(true);
      });
  });

  it('Should fail to update a roadmap\'s owner if not logged in', async () => {
    await request(app)
      .post(`/api/roadmaps/${roadmap.id}/owner`)
      .send({ newOwnerId: user2.id.toString() })
      .expect(HttpStatusCodes.UNAUTHORIZED);
  });

  it('Should fail to update a roadmap\'s owner if not owner', async () => {
    await request(app)
      .post(`/api/roadmaps/${roadmap.id}/owner`)
      .set('Cookie', `token=${token2}`)
      .send({ newOwnerId: user.id.toString() })
      .expect(HttpStatusCodes.FORBIDDEN);
  });

  it('Should be able to update a roadmap\'s data', async () => {
    await request(app)
      .post(`/api/roadmaps/${roadmap.id}/data`)
      .set('Cookie', `token=${token}`)
      .send({ data: 'testi g' })
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(res.body.success).toEqual(true);
      });
  });

  it('Should fail to update a roadmap\'s data if not logged in', async () => {
    await request(app)
      .post(`/api/roadmaps/${roadmap.id}/data`)
      .send({ data: 'test s' })
      .expect(HttpStatusCodes.UNAUTHORIZED);
  });

  it('Should fail to update a roadmap\'s data if not owner', async () => {
    await request(app)
      .post(`/api/roadmaps/${roadmap.id}/data`)
      .set('Cookie', `token=${token2}`)
      .send({ data: 'test s' })
      .expect(HttpStatusCodes.FORBIDDEN);
  });

  /*
   ! like/dislike roadmap test
   */
  it('should like a roadmap', async () => {
    // like roadmap
    await request(app)
      .get(`/api/roadmaps/${roadmap.id}/like`)
      .set('Cookie', `token=${token}`)
      .expect(HttpStatusCodes.OK);
  });

  it('shouldn\'t be able to like a roadmap twice', async () => {
    // like roadmap
    await request(app)
      .get(`/api/roadmaps/${roadmap.id}/like`)
      .set('Cookie', `token=${token}`)
      .expect(HttpStatusCodes.FORBIDDEN);
  });

  it('should dislike a roadmap', async () => {
    // dislike roadmap
    await request(app)
      .delete(`/api/roadmaps/${roadmap.id}/like`)
      .set('Cookie', `token=${token}`)
      .expect(HttpStatusCodes.OK);
  });

  it('shouldn\'t be able to dislike a roadmap twice', async () => {
    // dislike roadmap
    await request(app)
      .delete(`/api/roadmaps/${roadmap.id}/like`)
      .set('Cookie', `token=${token}`)
      .expect(HttpStatusCodes.FORBIDDEN);
  });

  /*
   ! Delete Roadmap Test
   */

  it('should Delete a roadmap', async () => {
    // delete roadmap
    await request(app)
      .delete(`/api/roadmaps/${roadmap.id}`)
      .set('Cookie', `token=${token}`)
      .expect(HttpStatusCodes.OK);

    // get database
    const db = new Database();

    // get roadmap from database
    const dbroadmap = await db.get<Roadmap>('roadmaps', roadmap.id);

    // check if roadmap matches dbroadmap
    expect(dbroadmap).toBeUndefined();
  });

  it('should fail to delete a roadmap if not logged in', async () => {
    // delete roadmap
    await request(app)
      .delete(`/api/roadmaps/${roadmap.id}`)
      .expect(HttpStatusCodes.UNAUTHORIZED);
  });
});
