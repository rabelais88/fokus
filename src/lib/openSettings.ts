/**
 * @description
 * this opens up settings.html
 */

const openSettings = async () => {
  return new Promise((resolve, _reject) => {
    chrome.runtime.openOptionsPage(() => {
      resolve(true);
    });
  });
};

export default openSettings;
