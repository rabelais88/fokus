import {
  URL_MODE_REGEX,
  URL_MODE_REGEX_IGNORE_PROTOCOL,
  URL_MODE_TEXT,
} from '@/constants';
// import makeLogger from './makeLogger';

// const logger = makeLogger('matchUrlRegex');
type regexMode =
  | typeof URL_MODE_TEXT
  | typeof URL_MODE_REGEX
  | typeof URL_MODE_REGEX_IGNORE_PROTOCOL;
const matchUrlRegex = (
  mode: regexMode,
  urlRegex: string,
  urlTarget: string
) => {
  // logger({ mode, urlRegex, urlTarget });
  if (mode === URL_MODE_TEXT) return urlTarget.includes(urlRegex);
  try {
    if (mode === URL_MODE_REGEX)
      return new RegExp(urlRegex, 'i').test(urlTarget);
    if (mode === URL_MODE_REGEX_IGNORE_PROTOCOL) {
      const urlWithoutProtocol = (urlTarget || '').replace(
        /^\/\/|^.*?:(\/\/)?/,
        ''
      );
      return new RegExp(urlRegex, 'i').test(urlWithoutProtocol);
    }
  } catch (err) {
    // if creating regex fails, just invalidate it
    return false;
  }
  return undefined;
};

export default matchUrlRegex;
