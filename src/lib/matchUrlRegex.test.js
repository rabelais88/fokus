import matchUrlRegex from './matchUrlRegex';
import { URL_MODE_REGEX, URL_MODE_REGEX_IGNORE_PROTOCOL } from '@/constants';

describe('matchUrlRegex', () => {
  it('regex should work', () => {
    // eslint-disable-next-line
    const valid = matchUrlRegex(URL_MODE_REGEX, '[a-z]{3}.[1-9]', 'aaa.1234');
    expect(valid).toEqual(true);
    const wrong = matchUrlRegex(URL_MODE_REGEX, '^[a-z]+$', 'imperial.aaa');
    expect(wrong).toEqual(false);
  });
  it('ignoring regex should work', () => {
    const valid = matchUrlRegex(
      URL_MODE_REGEX_IGNORE_PROTOCOL,
      '^google.com',
      'https://google.com'
    );
    expect(valid).toEqual(true);
    const wrong = matchUrlRegex(
      URL_MODE_REGEX_IGNORE_PROTOCOL,
      '^naver.com',
      'file://google.com'
    );
    expect(wrong).toEqual(false);
  });
});
