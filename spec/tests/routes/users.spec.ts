import { createUser, deleteUser } from '@spec/utils/createUser';
import request from 'supertest';
import app from '@src/server';
import httpStatusCodes from '@src/constants/HttpStatusCodes';
import { CreatedUser } from '@spec/types/tests/CreatedUser';
import JSONStringify from '@src/util/JSONStringify';

// ! Get User Tests
describe('Get User Tests', () => {
  let user: CreatedUser;
  beforeAll(async () => {
    user = await createUser();
  });

  afterAll(async () => {
    // delete user
    await deleteUser(user.user);
  });

  it('should return user with id', async () => {
    await request(app)
      .get('/api/users/' + user.user.id)
      .expect(httpStatusCodes.OK)
      .expect(({ body }) => {
        expect(body.success).toBe(true);
        expect(body.data).toBeDefined();
        // TODO: check for type to be right
      });
  });

  it('should return local user', async () => {
    await request(app)
      .get('/api/users/')
      .set('Cookie', user.loginCookie)
      .expect(httpStatusCodes.OK)
      .expect(({ body }) => {
        expect(body.success).toBe(true);
        expect(body.data).toBeDefined();
        // TODO: check for type to be right
      });
  });

  it('should return mini user profile', async () => {
    await request(app)
      .get('/api/users/' + user.user.id + '/mini')
      .expect(httpStatusCodes.OK)
      .expect(({ body }) => {
        expect(body.success).toBe(true);
        expect(body.data).toEqual(
          JSON.parse(JSONStringify(user.user.toObject())),
        );
      });
  });

  it('should return mini local user profile', async () => {
    await request(app)
      .get('/api/users/mini')
      .set('Cookie', user.loginCookie)
      .expect(httpStatusCodes.OK)
      .expect(({ body }) => {
        expect(body.success).toBe(true);
        expect(body.data).toBeDefined();
        expect(body.data).toEqual(
          JSON.parse(JSONStringify(user.user.toObject())),
        );
      });
  });
});
