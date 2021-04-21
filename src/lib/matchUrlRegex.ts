import { URL_MODE_REGEX, URL_MODE_TEXT } from '@/constants';

type regexMode = typeof URL_MODE_TEXT | typeof URL_MODE_REGEX;
const matchUrlRegex = (
  mode: regexMode,
  urlRegex: string,
  urlTarget: string
) => {
  if (mode === URL_MODE_TEXT) return urlTarget.includes(urlRegex);
  if (mode === URL_MODE_REGEX) return new RegExp(urlRegex, 'i').test(urlTarget);
  return undefined;
};

export default matchUrlRegex;
