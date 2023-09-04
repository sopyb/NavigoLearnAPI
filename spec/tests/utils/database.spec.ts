import Database from '@src/util/DatabaseDriver';
import { IUser, User } from '@src/types/models/User';
import { randomString } from '@spec/utils/randomString';

function testUserAttributes(user: IUser, user2?: IUser) {
  expect(user2).not.toBe(undefined);
  Object.keys(user).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(user2, key)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(user2[key]).toBe(user[key]);
    }
  });
}

describe('Database', () => {
  const users: User[] = [];
  const db = new Database();
  // test for inserting users
  it('should insert users', async () => {
    // add create 10 users
    for (let i = 0; i < 10; i++) {
      // get random details
      const username = randomString();
      const email = username + '@test.com';

      const user = new User({
        name: username,
        email,
        pwdHash: 'password',
      });

      // add userDisplay to database
      const id = await db.insert('users', user.toObject());

      // add id to userDisplay
      user.set({ id: id });

      // add userDisplay to users array
      users.push(user);

      expect(id).toBeGreaterThan(0);
    }
  });

  // test for updating users
  it('should update users', async () => {
    // update all users
    for (const user of users) {
      // change username
      user.set({ name: randomString() });

      // update userDisplay
      const success = await db.update('users', user.id, user.toObject());

      expect(success).toBe(true);
    }
  });

  // test for getting userDisplay by id
  it('should get users by id', async () => {
    // get all users
    for (const user of users) {
      const user2 = await db.get<IUser>('users', user.id);

      expect(user2).not.toBe(null);
      if (user2 === null) return;
      testUserAttributes(user, user2);
    }
  });

  // test for getting userDisplay by key (email)
  it('should get users by key', async () => {
    // get all users
    for (const user of users) {
      const user2 = await db.getWhere<IUser>('users', 'email', user.email);

      expect(user2).not.toBe(null);
      if (user2 === null) return;
      testUserAttributes(user, user2);
    }
  });

  // test for getting user by key (email) with value (userDisplay.email) like
  it('should get users by key with value like', async () => {
    // get all users
    for (const user of users) {
      // process email to get only the username
      const email = user.email.split('@')[0] + '%';

      const user2 = await db.getWhereLike<IUser>('users', 'email', email);

      expect(user2).not.toBe(null);
      if (user2 === null) return;
      testUserAttributes(user, user2);
    }
  });

  // test for getting all users
  it('should get all users', async () => {
    // get all users
    const users2 = await db.getAll<IUser>('users');

    expect(users2).not.toBe(null);
    if (!users2) return;
    expect(users2.length).toEqual(users.length);
  });

  // test for getting all users where key (pwdHash) is value (password)
  it('should get all users where key is value', async () => {
    // get all users
    const users2 = await db.getAllWhere<IUser>('users', 'pwdHash', 'password');

    expect(users2).not.toBe(null);
    if (!users2) return;
    expect(users2.length).toBe(users.length);
    for (const user of users) {
      const user2 = users2.find((u) => u.id === user.id);

      expect(user2).not.toBe(undefined);
      if (user2 === null) return;
      testUserAttributes(user, user2);
    }
  });

  // get all users where key (pwdHash) is value (password) like
  it('should get all users where key is value like', async () => {
    // get all users
    const users2 = await db.getAllWhereLike<IUser>('users', 'pwdHash', 'pass%');

    expect(users2).not.toBe(null);
    if (!users2) return;
    expect(users2.length).toBe(users.length);
    for (const user of users) {
      const user2 = users2.find((u) => u.id === user.id);

      expect(user2).not.toBe(undefined);
      if (user2 === null) return;
      testUserAttributes(user, user2);
    }
  });

  // test for counting users
  it('should count users', async () => {
    // get count
    const count = await db.count('users');

    expect(count).toEqual(BigInt(users.length));
  });

  // test for counting users where key (pwdHash) is value (password)
  it('should count users where key is value', async () => {
    // get count
    const count = BigInt(await db.countWhere('users', 'pwdHash', 'password'));
    const size = BigInt(users.length);

    expect(count).toBe(size);
  });

  // test for counting users where key (pwdHash) is value (password) like
  it('should count users where key is value like', async () => {
    // get count
    const count = BigInt(await db.countWhereLike('users', 'pwdHash', 'pass%'));
    const size = BigInt(users.length);

    expect(count).toBe(size);
  });

  // test for deleting users
  it('should delete users', async () => {
    // delete all users
    for (const user of users) {
      const success = await db.delete('users', user.id);
      expect(success).toBe(true);
    }
  });
});
