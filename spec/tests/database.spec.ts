import Database from '@src/util/DatabaseDriver';
import User, {IUser, UserRoles} from '@src/models/User';
import {Roadmap} from '@src/models/Roadmap';

// test for database
describe('Database Middleware', () => {
  it('should be able to save and retrieve users in the DB', async () => {
    // connect to database
    const db: Database = new Database();

    // create User
    const user: User = new User(
      'John Smith',
      'test@something.com',
      UserRoles.Standard,
      'password');

    // save user
    const result = await db.insert('users', user);

    // check result
    expect(result).toBeGreaterThan(0);

    if (result < 0) {
      return;
    }

    user.id = result;

    // get user
    const userDataFromDb = await db.get<IUser>('users', user.id);
    if (!userDataFromDb) {
      return;
    }
    const userFromDb = User.from(userDataFromDb);

    // check user
    expect(userFromDb.id === user.id).toBe(true);
    expect(userFromDb.name).toEqual(user.name);
    expect(userFromDb.email).toEqual(user.email);
    expect(userFromDb.role).toEqual(user.role);
    expect(userFromDb.pwdHash).toEqual(user.pwdHash);

    // change name
    user.name = 'John Doe';

    // update user
    await db.update('users', user.id, user);

    // get user
    const updatedUserDataFromDb = await db.get<IUser>('users', user.id);
    if (!updatedUserDataFromDb) {
      return;
    }
    const updatedUserFromDb = User.from(updatedUserDataFromDb);

    // check user
    expect(updatedUserFromDb.id).toBe(user.id);
    expect(updatedUserFromDb.name).toEqual(user.name);
    expect(updatedUserFromDb.email).toEqual(user.email);
    expect(updatedUserFromDb.role).toEqual(user.role);
    expect(updatedUserFromDb.pwdHash).toEqual(user.pwdHash);

    // delete user
    const deleted = await db.delete('users', user.id);

    // check result
    expect(deleted).toBeTruthy();

    // get user
    const deletedUserFromDb = await db.get<User>('users', user.id);

    // check user
    expect(deletedUserFromDb).toBeNull();
  });

  it('should be able to save and retrieve roadmaps in the DB', async () => {
    // connect to database
    const db: Database = new Database();

    // create User
    const user: User = new User(
      'John Smith',
      'test@something.com',
      UserRoles.Standard,
      'password');

    // save user
    const result = await db.insert('users', user);

    // check result
    expect(result).toBeGreaterThan(0);

    if (result < 0) {
      return;
    }

    user.id = result;

    const roadmap = new Roadmap(
      user.id,
      'This is a test roadmap',
      'This is a test description',
      'aHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1kUXc0dzlXZ1hjUQ==',
      null,
      new Date(),
      new Date(),
      null,
    );

    // save roadmap
    const roadmapResult = await db.insert('roadmaps', roadmap);

    // check result
    expect(roadmapResult).toBeGreaterThan(0);

    if (roadmapResult < 0) {
      return;
    }

    roadmap.id = roadmapResult;

    // get roadmap
    const roadmapFromDb = await db.get<Roadmap>('roadmaps', roadmap.id);

    // check roadmap
    expect(roadmapFromDb?.id == roadmap.id).toBeTruthy();
    expect(roadmapFromDb?.name).toEqual(roadmap.name);
    expect(roadmapFromDb?.description).toEqual(roadmap.description);
    expect(roadmapFromDb?.data).toEqual(roadmap.data);
    expect(roadmapFromDb?.ownerId == roadmap.ownerId).toBeTruthy();

    // change name
    roadmap.name = 'This is a new test roadmap';

    // update roadmap
    await db.update('roadmaps', roadmap.id, roadmap);

    // get roadmap
    const updatedRoadmapFromDb = await db.get<Roadmap>('roadmaps', roadmap.id);

    // check roadmap
    expect(updatedRoadmapFromDb?.id == roadmap.id).toBeTruthy();
    expect(updatedRoadmapFromDb?.name).toEqual(roadmap.name);
    expect(updatedRoadmapFromDb?.description).toEqual(roadmap.description);

    // delete roadmap
    const deleted = await db.delete('roadmaps', roadmap.id);

    // check result
    expect(deleted).toBeTruthy();

    // delete user
    const deletedUser = await db.delete('users', user.id);

    // check result
    expect(deletedUser).toBeTruthy();
    expect(!deletedUser).toBeTruthy();

    // get roadmap and user again see if they are deleted
    const deletedRoadmapFromDb = await db.get<Roadmap>('roadmaps', roadmap.id);
    const deletedUserFromDb = await db.get<User>('users', user.id);

    // check roadmap and user
    expect(deletedRoadmapFromDb).toBeNull();
    expect(deletedUserFromDb).toBeNull();
  });
});

