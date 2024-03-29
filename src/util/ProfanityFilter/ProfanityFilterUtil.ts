import wordList from '@src/util/ProfanityFilter/WordList';

const URLRegex = /https?:\/\/[^\s]+/g;

export function checkWordProfanity(word: string): boolean {
  if (URLRegex.test(word)) return false;
  return wordList.some((wordRegex) => wordRegex.test(word.toLowerCase()));
}

export function checkStringProfanity(str: string): boolean {
  return str.split(' ').some((word) => checkWordProfanity(word));
}

export function checkArrayProfanity(arr: unknown[]): boolean {
  return arr.some((value) => {
    if (typeof value === 'string') {
      return checkStringProfanity(value);
    }
    if(Array.isArray(value)) {
      return checkArrayProfanity(value);
    }
    if (typeof value === 'object') {
      // justified by the fact that value is already checked to be an object
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return checkObjectProfanity(value);
    }
    return false;
  });
}

export function checkObjectProfanity(
  obj: Record<string, never> | object,
): boolean {
  obj ??= {};

  return Object.values(obj).some((value) => {
    if (typeof value === 'string') {
      return checkStringProfanity(value);
    }
    if(Array.isArray(value)) {
      return checkArrayProfanity(value);
    }
    if (typeof value === 'object') {
      // justified by the fact that value is already checked to be an object
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return checkObjectProfanity(value);
    }
    return false;
  });
}