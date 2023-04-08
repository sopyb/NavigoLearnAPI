import Database from '@src/util/DatabaseDriver';
import User from '@src/models/User';

describe('Database', () => {
  const users: User[] = [];
  // test for inserting users
  it('should insert users', async () => {
    // get database
    const db = new Database();

    // add create 10 users
    for (let i = 0; i < 10; i++) {
      // get random details
      const username = Math.random().toString(36).substring(2, 15);
      const email = username + '@test.com';

      const user = new User(
        username,
        email,
        0,
        'password',
        undefined,
        undefined,
        undefined,
      );

      // add user to database
      const id = await db.insert('users', user);

      // add id to user
      user.id = id;

      // add user to users array
      users.push(user);

      expect(id).toBeGreaterThan(0);
    }
  });

  // test for updating users
  it('should update users', async () => {
    // get database
    const db = new Database();

    // update all users
    for (const user of users) {
      // change username
      user.name = Math.random().toString(36).substring(2, 15);

      // update user
      const success = await db.update('users', user.id, user);

      expect(success).toBe(true);
    }
  });

  // test for getting user by id
  it('should get users by id', async () => {
    // get database
    const db = new Database();

    // get all users
    for (const user of users) {
      const user2 = await db.get<User>('users', user.id);

      expect(user2).not.toBe(undefined);
      expect(user2?.id).toBe(user.id);
      expect(user2?.email).toBe(user.email);
      expect(user2?.name).toBe(user.name);
      expect(user2?.pwdHash).toBe(user.pwdHash);
      expect(user2?.role).toBe(user.role);
    }
  });

  // test for getting user by key (email)
  it('should get users by key', async () => {
    // get database
    const db = new Database();

    // get all users
    for (const user of users) {
      const user2 = await db.getObjByKey<User>('users', 'email', user.email);

      expect(user2).not.toBe(undefined);
      expect(user2?.id).toBe(user.id);
      expect(user2?.email).toBe(user.email);
      expect(user2?.name).toBe(user.name);
      expect(user2?.pwdHash).toBe(user.pwdHash);
      expect(user2?.role).toBe(user.role);
    }
  });

  // test for getting all users where key (pwdHash) is value (password)
  it('should get all users where key is value', async () => {
    // get database
    const db = new Database();

    // get all users
    const users2 = await db.getAllWhere<User>('users', 'pwdHash', 'password');

    expect(users2).not.toBe(undefined);
    expect(users2?.length).toBe(users.length);
    for (const user of users) {
      const user2 = users2?.find((u) => u.id === user.id);

      expect(user2).not.toBe(undefined);
      expect(user2?.id).toBe(user.id);
      expect(user2?.email).toBe(user.email);
      expect(user2?.name).toBe(user.name);
      expect(user2?.pwdHash).toBe(user.pwdHash);
      expect(user2?.role).toBe(user.role);
    }
  });

  // test for deleting users
  it('should delete users', async () => {
    // get database
    const db = new Database();

    // delete all users
    for (const user of users) {
      const success = await db.delete('users', user.id);
      expect(success).toBe(true);
    }
  });
});