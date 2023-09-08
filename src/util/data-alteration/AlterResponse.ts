export function alterResponseToBooleans<T>(payload: T, keys: string[]) {
  const alteredPayload = { ...payload };
  keys.forEach((key) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    alteredPayload[key] = !!alteredPayload[key];
  });
  return alteredPayload;
}
