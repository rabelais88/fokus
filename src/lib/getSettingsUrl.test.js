import getSettingsUrl from './getSettingsUrl';

describe('getSettingsUrl', () => {
  it('given object should be properly changed to querystring', () => {
    const settingsUrl = getSettingsUrl({ aaa: 111, b: 2 });
    expect(settingsUrl).toEqual('chrome:extension?aaa=111&b=2');
  });
});
