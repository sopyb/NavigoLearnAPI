import wordList from '@src/util/ProfanityFilter/WordList';

export function checkString(str: string): boolean {
  return wordList.some((word) => word.test(str));
}

export function checkOject(obj: Record<string, never>): boolean {
  return Object.values(obj).some((value) => {
    if (typeof value === 'string') {
      return checkString(value);
    }
    if (typeof value === 'object') {
      return checkOject(value);
    }
    return false;
  });
}
