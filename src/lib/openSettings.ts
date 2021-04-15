// ! this is stable way to open the tab
// but this can't use query strings
// const openSettings = async () => {
//   return new Promise((resolve, _reject) => {
//     chrome.runtime.openOptionsPage(() => {
//       resolve(true);
//     });
//   });
// };

import getSettingsUrl from './getSettingsUrl';
import makeLogger from './makeLogger';

const logger = makeLogger('openSettings');
/**
 * @function openSettings
 * @description
 * this opens up settings.html
 */
const openSettings = async (query?: queryType) => {
  return new Promise((resolve, _reject) => {
    const url = getSettingsUrl(query);
    chrome.tabs.create({ url }, () => {
      resolve(true);
    });
  });
};

export default openSettings;
