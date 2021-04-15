import checkChromeUrl from './checkChromeUrl';

describe('checkChromeUrl', () => {
  it('is chrome url', () => {
    expect(checkChromeUrl('chrome://')).toEqual(true);
    expect(checkChromeUrl('chrome-extension://')).toEqual(true);
  });
  it('is not chrome url', () => {
    expect(checkChromeUrl('wrongurl')).toEqual(false);
    expect(checkChromeUrl('https://testsite.test')).toEqual(false);
  });
});
