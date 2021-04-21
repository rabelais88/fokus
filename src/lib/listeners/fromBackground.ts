import makeLogger from '../makeLogger';
import sendFromBackground from '../senders/fromBackground';
import {
  BLOCK_MODE_ALLOW_ALL,
  BLOCK_MODE_BLOCK_ALL,
  EXPORT_SETTINGS,
  QUERY_BLOCKED_URL,
} from '../../constants';
import getTaskInfo from '@/lib/getTaskInfo';
import storage from '@/lib/storage';
import getSettingsUrl from '../getSettingsUrl';
import {
  STORE_PRESERVED_KEYS,
  STORE_TASK_HISTORY_NOW,
} from '@/constants/storeKey';
import checkChromeUrl from '../checkChromeUrl';
import getNewTabUrl from '../getNewTabUrl';
import saveJson from '@/lib/file/saveJson';
import matchUrlRegex from '@/lib/matchUrlRegex';

const logger = makeLogger('listenFromBackground');

export const validateUrl = async (url: string) => {
  const extensionUrl = getSettingsUrl();
  if (url.includes(extensionUrl)) return true;
  if (url === '') return true;
  const { allowedSites, blockedSites, blockMode } = await getTaskInfo();
  logger('validateUrl', { url, allowedSites, blockedSites, blockMode });
  if (blockMode === BLOCK_MODE_ALLOW_ALL) {
    const result = blockedSites.findIndex(({ urlMode, urlRegex }) => {
      const valid = matchUrlRegex(urlMode, urlRegex, url);
      // if mode is faulty, the site remains accessible
      if (valid === undefined) return false;
      return valid;
    });
    return result === -1;
  }

  if (blockMode === BLOCK_MODE_BLOCK_ALL) {
    const result = allowedSites.findIndex(({ urlMode, urlRegex }) => {
      const valid = matchUrlRegex(urlMode, urlRegex, url);
      // if mode is faulty, the site remains accessible
      if (valid === undefined) return true;
      return valid;
    });
    return result !== -1;
  }

  // if block mode is faulty, the site remains accessible
  return true;
};

const onTabUpdate = async (_tab: chrome.tabs.Tab) => {
  logger('onTabUpdate', { tab: _tab, url: _tab.url });
  const currentTask = await storage.get<taskHistory>(STORE_TASK_HISTORY_NOW);
  // if it's not a site with proper url(i.g. new tab), just show.
  if (!_tab.url || !_tab.id) return;
  // eslint-disable-next-line
  if (checkChromeUrl(_tab.url)) return;
  if (currentTask.taskId === '') {
    chrome.tabs.update(_tab.id, { url: getNewTabUrl() });
    return;
  }
  const isValid = await validateUrl(_tab.url || '');
  logger('tab update', { tab: _tab, isValid, url: _tab.url });
  if (isValid) return;
  if (typeof _tab.id === 'number') {
    const url = getSettingsUrl({ [QUERY_BLOCKED_URL]: _tab.url || 'unknown' });
    chrome.tabs.update(_tab.id, { url });
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

const onExportSettings = async () => {
  logger('onExportSettings');
  const readers = STORE_PRESERVED_KEYS.map(storage.get);
  const data = {
    settings: await Promise.all(readers),
  };
  saveJson(data, 'settings.json');
};

// listen from background
const listenFromBackground = () => {
  logger('listening...');
  chrome.runtime.onMessage.addListener(function (message = {}, sender, reply) {
    const { code } = message;
    if (code === EXPORT_SETTINGS) onExportSettings();
    logger('onMessage', { message, sender, reply });
    // chrome.runtime.onMessage.removeListener(event);
    // reply({ message: 'hello from background!' });
  });

  chrome.tabs.onUpdated.addListener((_tabId, _changeInfo, tab) => {
    onTabUpdate(tab);
  });
  chrome.tabs.onCreated.addListener(onTabUpdate);
  storage.onChange(onStorageChange);
  // setInterval(onTick, 5000);
};

export default listenFromBackground;
