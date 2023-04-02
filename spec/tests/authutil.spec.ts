import { comparePassword, saltPassword } from '@src/util/LoginUtil';

// test for login util
describe('Login Util', () => {
  it('should be able to salt and compare passwords', () => {
    // generate random password
    const password = Math.random().toString(36).substring(2, 15);
    // salt password
    const saltedPassword = saltPassword(password);
    const passwordMatches = comparePassword(password, saltedPassword);
    expect(passwordMatches).toBe(true);
  });
});