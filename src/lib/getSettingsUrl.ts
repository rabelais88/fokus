import { isTestEnv } from './env';

const getSettingsUrl = (query?: queryType) => {
  let url = isTestEnv
    ? 'chrome:extension'
    : chrome.extension.getURL('options.html');
  if (query) {
    const queryUrl = Object.entries(query)
      .map(([key, value]) => [key, value].join('='))
      .join('&');
    url = [url, queryUrl].join('?');
  }
  return url;
};

export default getSettingsUrl;
