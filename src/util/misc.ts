/* eslint-disable */
export function JSONSafety(obj: unknown): unknown {
  return JSON.parse(
    JSON.stringify(obj, (key, value) => {
      // if value is a bigint, convert it to a string
      if (typeof value === 'bigint') return Number(value);
      // if value has a toObject method, call it and return the result
      else if (
        typeof value === 'object' &&
        value !== null &&
        'toObject' in value &&
        typeof value.toObject === 'function'
      ) {
        return value.toObject();
      }

      // return value as is
      return value;
    }),
  );
}

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


export function isEmptyObject(obj: any): obj is Record<string, any> {
  return obj && typeof obj === 'object' && Object.keys(obj).length === 0;
}

export function Base64Encode(str: string): string {
  return Buffer.from(str).toString('base64');
}

export function Base64Decode(str: string): string {
  return Buffer.from(str, 'base64').toString();
}