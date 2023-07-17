export default function JSONStringify(obj: unknown): string {
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'bigint') return value.toString();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return value;
  });
}
