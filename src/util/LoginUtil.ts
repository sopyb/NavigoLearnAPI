import bcrypt from 'bcrypt';

function saltPassword(password: string): string {
  let result = '';
  // generate salt
  const salt = bcrypt.genSaltSync(10);
  result += `${salt}:`;
  // hash password
  const hash = bcrypt.hashSync(password, salt);
  result += hash;

  return result;
}

function comparePassword(password: string, hash: string): boolean {
  const [ salt, hashFromDb ] = hash.split(':');
  const hashToCompare = bcrypt.hashSync(password, salt);
  return hashToCompare === hashFromDb;
}

export default class LoginUtil {

}

export {
  saltPassword,
  comparePassword,
};
