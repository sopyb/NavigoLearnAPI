import { createUser, deleteUser } from '@spec/utils/createUser';
import request from 'supertest';
import app from '@src/server';
import httpStatusCodes from '@src/constants/HttpStatusCodes';
import { CreatedUser } from '@spec/types/tests/CreatedUser';
import JSONSafety from '@src/util/JSONSafety';
import { ResUserProfile } from '@src/types/response/ResUserProfile';
import { ResUserMiniProfile } from '@src/types/response/ResUserMiniProfile';

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
        expect(ResUserProfile.isProfile(body.data)).toBe(true);
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
        expect(ResUserProfile.isProfile(body.data)).toBe(true);
      });
  });

  it('should return mini user profile', async () => {
    await request(app)
      .get('/api/users/' + user.user.id + '/mini')
      .expect(httpStatusCodes.OK)
      .expect(({ body }) => {
        expect(body.success).toBe(true);
        expect(ResUserMiniProfile.isMiniProfile(body.data)).toBe(true);
        expect(body.data).toEqual(
          JSON.parse(
            JSONSafety(new ResUserMiniProfile(user.user.toObject())),
          ),
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
        expect(ResUserMiniProfile.isMiniProfile(body.data)).toBe(true);
        expect(body.data).toEqual(
          JSON.parse(
            JSONSafety(new ResUserMiniProfile(user.user.toObject())),
          ),
        );
      });
  });
});
