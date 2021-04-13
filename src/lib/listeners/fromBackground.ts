import makeLogger from '../makeLogger';
import sendFromBackground from '../senders/fromBackground';
import {
  BLOCK_MODE_ALLOW_ALL,
  BLOCK_MODE_BLOCK_ALL,
  MSG_CHANGE_COLOR,
  URL_MODE_REGEX,
  URL_MODE_TEXT,
} from '../../constants';
import getTaskInfo from '@/lib/getTaskInfo';
import storage from '@/lib/storage';
import openSettings from '../openSettings';
import getSettingsUrl from '../getSettingsUrl';

const logger = makeLogger('listenFromBackground');

export const validateUrl = async (url: string) => {
  if (url.includes(chrome.extension.getURL('options.html'))) return true;
  if (url === '') return true;
  const { allowedSites, blockedSites, blockMode } = await getTaskInfo();
  logger('validateUrl', { url, allowedSites, blockedSites, blockMode });
  if (blockMode === BLOCK_MODE_ALLOW_ALL) {
    const result = blockedSites.findIndex((blockedSite) => {
      if (blockedSite.urlMode === URL_MODE_TEXT)
        return url.includes(blockedSite.urlRegex);
      if (blockedSite.urlMode === URL_MODE_REGEX)
        return new RegExp(blockedSite.urlRegex, 'i').test(url);
      // if mode is faulty, the site remains accessible
      return false;
    });
    return result === -1;
  }
  if (blockMode === BLOCK_MODE_BLOCK_ALL) {
    const result = allowedSites.findIndex((allowedSite) => {
      if (allowedSite.urlMode === URL_MODE_TEXT)
        return url.includes(allowedSite.urlRegex);
      if (allowedSite.urlMode === URL_MODE_REGEX)
        return new RegExp(allowedSite.urlRegex);
      // if mode is faulty, the site remains accessible
      return true;
    });
    return result !== -1;
  }

  // if block mode is faulty, the site remains accessible
  return true;
};

const onTabUpdate = async (_tab: chrome.tabs.Tab) => {
  const isValid = await validateUrl(_tab.url || '');
  logger('tab update', { tab: _tab, isValid });
  if (isValid) return;
  if (typeof _tab.id === 'number') {
    // await openSettings({ 'blocked-url': _tab.url || '' });
    const url = getSettingsUrl({ 'blocked-url': _tab.url || 'unknown' });
    chrome.tabs.update({ url });
  }
};

const onTick = async () => {
  logger('ticking...');
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(onTabUpdate);
  });
};

const onStorageChange = () => {
  logger('storage data changed');
};

// listen from background
const listenFromBackground = () => {
  logger('listening...');
  chrome.runtime.onMessage.addListener(function (message, sender, reply) {
    logger('onMessage', { message, sender, reply });
    // chrome.runtime.onMessage.removeListener(event);
    sendFromBackground(MSG_CHANGE_COLOR);
    reply({ message: 'hello from background!' });
    // return true;
  });

  chrome.tabs.onUpdated.addListener((_tabId, _changeInfo, tab) => {
    onTabUpdate(tab);
  });
  chrome.tabs.onCreated.addListener(onTabUpdate);
  storage.onChange(onStorageChange);
  setInterval(onTick, 1000);
};

export default listenFromBackground;
