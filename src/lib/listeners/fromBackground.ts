import makeLogger from '../makeLogger';
// import sendFromBackground from '../senders/fromBackground';
import {
  BLOCK_MODE_ALLOW_ALL,
  BLOCK_MODE_BLOCK_ALL,
  EXPORT_SETTINGS,
  QUERY_BLOCKED_URL,
  TIME_MINUTE,
} from '@/constants';
import getTaskInfo from '@/lib/getTaskInfo';
import storage from '@/lib/storage';
import getSettingsUrl from '@/lib/getSettingsUrl';
import { STORE_TASKS, STORE_TASK_HISTORY_NOW } from '@/constants/storeKey';
import STORE_PRESERVED_KEYS from '@/constants/STORE_PRESERVED_KEYS';
import checkChromeUrl from '@/lib/checkChromeUrl';
import getNewTabUrl from '@/lib/getNewTabUrl';
import saveJson from '@/lib/file/saveJson';
import matchUrlRegex from '@/lib/matchUrlRegex';
import getTime from '@/lib/getTime';
import { endTask } from '@/lib/controller/task';

const logger = makeLogger('listenFromBackground', true);

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

const getBlockedPageUrl = (url: string) =>
  getSettingsUrl({ [QUERY_BLOCKED_URL]: url });

const onTabUpdate = async (_tab: chrome.tabs.Tab) => {
  logger('onTabUpdate', { tab: _tab, url: _tab.url });
  const currentTask = await storage.get(STORE_TASK_HISTORY_NOW);
  // if it's not a site with proper url(i.g. new tab), just show.
  if (!_tab.url || !_tab.id) return;
  // eslint-disable-next-line
  if (checkChromeUrl(_tab.url)) return;
  if (currentTask.taskId === '') {
    const url = getBlockedPageUrl(_tab.url);
    chrome.tabs.update(_tab.id, { url });
    return;
  }
  const isValid = await validateUrl(_tab.url || '');
  const tasks = await storage.get(STORE_TASKS);
  const currentTaskDetail = tasks[currentTask.taskId];
  const targetTime =
    currentTask.timeStart + currentTaskDetail.maxDuration * TIME_MINUTE;
  let isTimeout = false;
  if (currentTaskDetail.maxDuration > 0) isTimeout = getTime() > targetTime;
  logger('checking', { timeNow: getTime(), targetTime, isTimeout });
  if (isValid && !isTimeout) return;
  if (typeof _tab.id === 'number') {
    if (isTimeout) endTask();
    const url = getBlockedPageUrl(_tab.url);
    chrome.tabs.update(_tab.id, { url });
  }
};

const onTick = async () => {
  logger('ticking...', getTime());
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
  setInterval(onTick, 3000);
};

export default listenFromBackground;
