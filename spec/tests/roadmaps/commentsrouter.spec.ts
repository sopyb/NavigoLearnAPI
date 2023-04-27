import { Issue } from '@src/models/Issue';
import { Roadmap } from '@src/models/Roadmap';
import User from '@src/models/User';
import app from '@src/server';
import request from 'supertest';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import Database from '@src/util/DatabaseDriver';
import { Comment } from '@src/models/Comment';

describe('CommentsRouter', () => {
  let user1: User, user2: User, user3: User;
  let token1: string, token2: string, token3: string;
  let roadmap1: Roadmap, roadmap2: Roadmap;
  let issue1: Issue, issue3: Issue, issue4: Issue;
  let comment1: Comment;

  beforeAll(async () => {
    // create users
    let res = await request(app).post('/api/auth/register')
      .send({ email: 'user1@email.com', password: 'password1' })
      .expect(HttpStatusCodes.CREATED);
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    token1 = res.header['set-cookie'][0].split(';')[0].split('=')[1] as string;

    res = await request(app).post('/api/auth/register')
      .send({ email: 'user2@email.com', password: 'password2' })
      .expect(HttpStatusCodes.CREATED);

    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    token2 = res.header['set-cookie'][0].split(';')[0].split('=')[1] as string;

    res = await request(app).post('/api/auth/register')
      .send({ email: 'user3@email.com', password: 'password3' })
      .expect(HttpStatusCodes.CREATED);

    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    token3 = res.header['set-cookie'][0].split(';')[0].split('=')[1] as string;

    // get database
    const db = new Database();

    // get users
    let user = await db.getWhere<User>('users', 'email', 'user1@email.com');
    if (!user) throw new Error('User 1 not found.');
    user1 = user;

    user = await db.getWhere<User>('users', 'email', 'user2@email.com');
    if (!user) throw new Error('User 2 not found.');
    user2 = user;

    user = await db.getWhere<User>('users', 'email', 'user3@email.com');
    if (!user) throw new Error('User 3 not found.');
    user3 = user;

    // create roadmaps
    await request(app).post('/api/roadmaps/create')
      .set('Cookie', [ `token=${token1}` ])
      .send(
        { roadmap: new Roadmap(user1.id, 'roadmap1', 'test', 'st').toJSON() })
      .expect(HttpStatusCodes.CREATED);
    await request(app).post('/api/roadmaps/create')
      .set('Cookie', [ `token=${token2}` ])
      .send({
        roadmap: new Roadmap(
          user2.id,
          'roadmap2',
          'test',
          'ksf',
          undefined,
          undefined,
          false).toJSON(),
      })
      .expect(HttpStatusCodes.CREATED);

    // get roadmaps
    let roadmap = await db.getWhere<Roadmap>('roadmaps', 'ownerId', user1.id);
    if (!roadmap) throw new Error('Roadmap 1 not found.');
    roadmap1 = roadmap;

    roadmap = await db.getWhere<Roadmap>('roadmaps', 'ownerId', user2.id);
    if (!roadmap) throw new Error('Roadmap 2 not found.');
    roadmap2 = roadmap;

    // create issues
    await request(app).post(`/api/roadmaps/${roadmap1.id}/issues/create`)
      .set('Cookie', [ `token=${token1}` ])
      .send({
        issue: new Issue(roadmap1.id, user1.id, true,
          'issue1', 'fd').toJSON(),
      })
      .expect(HttpStatusCodes.CREATED);

    await request(app).post(`/api/roadmaps/${roadmap2.id}/issues/create`)
      .set('Cookie', [ `token=${token2}` ])
      .send({
        issue: new Issue(roadmap2.id, user2.id, true,
          'issue3', 'ksf').toJSON(),
      })
      .expect(HttpStatusCodes.CREATED);

    await request(app).post(`/api/roadmaps/${roadmap2.id}/issues/create`)
      .set('Cookie', [ `token=${token2}` ])
      .send({
        issue: new Issue(roadmap2.id, user2.id, true,
          'issue4', 'ksf').toJSON(),
      })
      .expect(HttpStatusCodes.CREATED);

    // get issues
    let issue = await db.getWhere<Issue>('issues', 'title', 'issue1');
    if (!issue) throw new Error('Issue 1 not found.');
    issue1 = issue;

    issue = await db.getWhere<Issue>('issues', 'title', 'issue3');
    if (!issue) throw new Error('Issue 3 not found.');
    issue3 = issue;

    issue = await db.getWhere<Issue>('issues', 'title', 'issue4');
    if (!issue) throw new Error('Issue 4 not found.');
    issue4 = issue;
  });

  afterAll(async () => {
    // get database
    const db = new Database();
    // delete users (cascade deletes roadmaps, issues, and comments)
    await db.delete('users', user1.id);
    await db.delete('users', user2.id);
    await db.delete('users', user3.id);
  });

  it('should create a comment', async () => {
    await request(app).post(`/api/roadmaps/${
      roadmap1.id.toString()}/issues/${issue1.id.toString()}/comments/create`)
      .set('Cookie', [ `token=${token1}` ])
      .send({
        content: new Array(100).fill('a').join(''),
      })
      .expect(HttpStatusCodes.CREATED)
      .expect('Content-Type', /json/)
      .expect((res) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(res.body?.success).toBe(true);
      });

    // get database
    const db = new Database();
    // get comment
    const comment =
      await db.getWhere<Comment>('issueComments', 'userId', user1.id);
    if (!comment) throw new Error('Comment not found.');
    // check comment
    expect(comment.content).toBe(new Array(100).fill('a').join(''));
    expect(comment.issueId).toBe(issue1.id);
    expect(comment.userId).toBe(user1.id);

    // set comment
    comment1 = comment;
  });

  it('should not create a comment with invalid content', async () => {
    await request(app).post(`/api/roadmaps/${
      roadmap1.id.toString()}/issues/${issue1.id.toString()}/comments/create`)
      .set('Cookie', [ `token=${token1}` ])
      .send({
        content: '',
      })
      .expect(HttpStatusCodes.BAD_REQUEST);
  });

  it('should not create a comment with invalid issue id', async () => {
    await request(app).post(`/api/roadmaps/${
      roadmap1.id.toString()}/issues/${Number(issue4.id) + 1}/comments/create`)
      .set('Cookie', [ `token=${token1}` ])
      .send({
        content: new Array(100).fill('a').join(''),
      })
      .expect(HttpStatusCodes.NOT_FOUND);
  });

  it('should not create a comment with invalid roadmap id', async () => {
    await request(app).post(`/api/roadmaps/${
      Number(roadmap2.id) + 1}/issues/${issue1.id.toString()}/comments/create`)
      .set('Cookie', [ `token=${token1}` ])
      .send({
        content: new Array(100).fill('a').join(''),
      })
      .expect(HttpStatusCodes.NOT_FOUND);
  });

  it('should not create a comment without login', async () => {
    await request(app).post(`/api/roadmaps/${
      roadmap1.id.toString()}/issues/${issue1.id.toString()}/comments/create`)
      .send({
        content: new Array(100).fill('a').join(''),
      })
      .expect(HttpStatusCodes.UNAUTHORIZED);
  });

  it('should fail to create a comment with invalid token', async () => {
    await request(app).post(`/api/roadmaps/${
      roadmap1.id.toString()}/issues/${issue1.id.toString()}/comments/create`)
      .set('Cookie', [ `token=${token1}a` ])
      .send({
        content: new Array(100).fill('a').join(''),
      })
      .expect(HttpStatusCodes.UNAUTHORIZED);
  });

  it('should fail to create a comment on private roadmap', async () => {
    await request(app).post(`/api/roadmaps/${
      roadmap2.id.toString()}/issues/${issue3.id.toString()}/comments/create`)
      .set('Cookie', [ `token=${token3}` ])
      .send({
        content: new Array(100).fill('a').join(''),
      })
      .expect(HttpStatusCodes.FORBIDDEN);
  });

  it('should get comments', async () => {
    await request(app).get(`/api/roadmaps/${
      roadmap1.id.toString()}/issues/${issue1.id.toString()}/comments`)
      .set('Cookie', [ `token=${token1}` ])
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        // parse body comments
        // eslint-disable-next-line max-len,@typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const comments = JSON.parse(res.body)?.comments as Array<Comment>;
        expect(comments).toBeDefined();
        expect(comments.length).toBe(1);
      });
  });

  it('should not get comments with invalid issue id', async () => {
    await request(app).get(`/api/roadmaps/${
      roadmap1.id.toString()}/issues/${Number(issue4.id) + 1}/comments`)
      .set('Cookie', [ `token=${token1}` ])
      .expect(HttpStatusCodes.NOT_FOUND);
  });

  it('should not get comments with invalid roadmap id', async () => {
    await request(app).get(`/api/roadmaps/${
      Number(roadmap1.id) + 1}/issues/${issue1.id.toString()}/comments`)
      .set('Cookie', [ `token=${token1}` ])
      .expect(HttpStatusCodes.BAD_REQUEST);
  });

  it('should get comments without login', async () => {
    await request(app).get(`/api/roadmaps/${
      roadmap1.id.toString()}/issues/${issue1.id.toString()}/comments`)
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        // parse body comments
        // eslint-disable-next-line max-len,@typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const comments = JSON.parse(res.body)?.comments as Array<Comment>;
        expect(comments).toBeDefined();
        expect(comments.length).toBe(1);
      });
  });

  it('should be able to update a comment', async () => {
    await request(app).post(`/api/roadmaps/${
      roadmap1.id.toString()}/issues/${issue1.id.toString()}/comments/${
      comment1.id.toString()}/`)
      .set('Cookie', [ `token=${token1}` ])
      .send({
        content: new Array(100).fill('b').join(''),
      })
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(res.body?.success).toBe(true);
      });
  });

  it('should not update a comment with invalid content', async () => {
    await request(app).post(`/api/roadmaps/${
      roadmap1.id.toString()}/issues/${issue1.id.toString()}/comments/${
      comment1.id.toString()}/`)
      .set('Cookie', [ `token=${token1}` ])
      .send({
        content: '',
      })
      .expect(HttpStatusCodes.BAD_REQUEST);
  });

  it('should not update a comment with invalid comment id', async () => {
    await request(app).post(`/api/roadmaps/${
      roadmap1.id.toString()}/issues/${issue1.id.toString()}/comments/${
      Number(comment1.id) + 1}/`)
      .set('Cookie', [ `token=${token1}` ])
      .send({
        content: new Array(100).fill('b').join(''),
      })
      .expect(HttpStatusCodes.NOT_FOUND);
  });

  it('should not update a comment with invalid issue id', async () => {
    await request(app).post(`/api/roadmaps/${
      roadmap1.id.toString()}/issues/${Number(issue1.id) + 1}/comments/${
      comment1.id.toString()}/`)
      .set('Cookie', [ `token=${token1}` ])
      .send({
        content: new Array(100).fill('b').join(''),
      })
      .expect(HttpStatusCodes.BAD_REQUEST);
  });

  it('should not update a comment with invalid roadmap id', async () => {
    await request(app).post(`/api/roadmaps/${
      Number(roadmap2.id) + 21}/issues/${issue1.id.toString()}/comments/${
      comment1.id.toString()}/`)
      .set('Cookie', [ `token=${token1}` ])
      .send({
        content: new Array(100).fill('b').join(''),
      })
      .expect(HttpStatusCodes.NOT_FOUND);
  });

  it('should not update a comment without login', async () => {
    await request(app).post(`/api/roadmaps/${
      roadmap1.id.toString()}/issues/${issue1.id.toString()}/comments/${
      comment1.id.toString()}/`)
      .send({
        content: new Array(100).fill('b').join(''),
      })
      .expect(HttpStatusCodes.UNAUTHORIZED);
  });

  it('should not update a comment with invalid token', async () => {
    await request(app).post(`/api/roadmaps/${
      roadmap1.id.toString()}/issues/${issue1.id.toString()}/comments/${
      comment1.id.toString()}/`)
      .set('Cookie', [ `token=${token1}a` ])
      .send({
        content: new Array(100).fill('b').join(''),
      })
      .expect(HttpStatusCodes.UNAUTHORIZED);
  });

  it('should not be able to delete a comment with invalid comment id',
    async () => {
      await request(app).delete(`/api/roadmaps/${
        roadmap1.id.toString()}/issues/${issue1.id.toString()}/comments/${
        Number(comment1.id) + 1}/`)
        .set('Cookie', [ `token=${token1}` ])
        .expect(HttpStatusCodes.NOT_FOUND);
    });

  it('should not be able to delete a comment with invalid issue id',
    async () => {
      await request(app).delete(`/api/roadmaps/${
        roadmap1.id.toString()}/issues/${Number(issue1.id) + 1}/comments/${
        comment1.id.toString()}/`)
        .set('Cookie', [ `token=${token1}` ])
        .expect(HttpStatusCodes.BAD_REQUEST);
    });

  it('should not be able to delete a comment with invalid roadmap id',
    async () => {
      await request(app).delete(`/api/roadmaps/${
        Number(roadmap1.id) + 1}/issues/${issue1.id.toString()}/comments/${
        comment1.id.toString()}/`)
        .set('Cookie', [ `token=${token1}` ])
        .expect(HttpStatusCodes.BAD_REQUEST);
    });

  it('should not be able to delete a comment without login', async () => {
    await request(app).delete(`/api/roadmaps/${
      roadmap1.id.toString()}/issues/${issue1.id.toString()}/comments/${
      comment1.id.toString()}/`)
      .expect(HttpStatusCodes.UNAUTHORIZED);
  });

  it('should not be able to delete a comment with invalid token', async () => {
    await request(app).delete(`/api/roadmaps/${
      roadmap1.id.toString()}/issues/${issue1.id.toString()}/comments/${
      comment1.id.toString()}/`)
      .set('Cookie', [ `token=${token1}a` ])
      .expect(HttpStatusCodes.UNAUTHORIZED);
  });

  it('should be able to delete a comment', async () => {
    await request(app).delete(`/api/roadmaps/${
      roadmap1.id.toString()}/issues/${issue1.id.toString()}/comments/${
      comment1.id.toString()}/`)
      .set('Cookie', [ `token=${token1}` ])
      .expect(HttpStatusCodes.OK)
      .expect('Content-Type', /json/)
      .expect((res) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(res.body?.success).toBe(true);
      });
  });
});