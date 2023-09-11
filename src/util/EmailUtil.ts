export function checkEmail(email: string): boolean {
  // check if email is valid
  // https://datatracker.ietf.org/doc/html/rfc5322#section-3.4.1
  return !!email.match(
    RegExp(
      '^[\\w!#$%&\'*+/=?^`{|}~.-]+' +
        '@(?!-)[A-Za-z0-9-]+([-.][a-z0-9]+)*\\.[A-Za-z]{2,63}$',
    ),
  );
}
