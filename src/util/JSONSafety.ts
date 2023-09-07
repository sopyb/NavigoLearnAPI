/* eslint-disable */
export default function JSONSafety(obj: unknown): unknown {
  return JSON.parse(JSON.stringify(obj, (key, value) => {
    // if value is a bigint, convert it to a string
    if (typeof value === 'bigint') return value.toString();
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
  }));
}
