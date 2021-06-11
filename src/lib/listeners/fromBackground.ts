import makeLogger from '../makeLogger';
// import sendFromBackground from '../senders/fromBackground';
import {
  BLOCK_MODE_ALLOW_ALL,
  BLOCK_MODE_BLOCK_ALL,
  EXPORT_SETTINGS,
  QUERY_BLOCKED_URL,
  TIME_MINUTE,
} from '@/constants';
import storage from '@/lib/storage';
import getSettingsUrl from '@/lib/getSettingsUrl';
import checkChromeUrl from '@/lib/checkChromeUrl';
import matchUrlRegex from '@/lib/matchUrlRegex';
import getTime from '@/lib/getTime';
import { getVarious } from '@/lib/controller/various';
import { getTask } from '@/lib/controller/task';
import { endTask, getTaskHistory } from '@/lib/controller/taskHistory';
import { getSites } from '@/lib/controller/site';
import exportSettings from '@/lib/exportSettings';
// import { endTask } from '@/lib/controller/task';

const logger = makeLogger('listenFromBackground', true);

export const validateUrl = async (url: string) => {
  const extensionUrl = getSettingsUrl();
  if (url.includes(extensionUrl)) return true;
  if (url === '') return true;
  const nowTaskId = await getVarious('nowTaskId');
  const nowTask = await getTask(nowTaskId);
  const { blockedSiteIds, allowedSiteIds, blockMode } = nowTask;
  const { items: blockedSites } = await getSites({
    size: -1,
    searchFunc: (website) => blockedSiteIds.includes(website.id),
  });
  const { items: allowedSites } = await getSites({
    size: -1,
    searchFunc: (website) => allowedSiteIds.includes(website.id),
  });

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
  const currentTaskId = await getVarious('nowTaskId');
  const currentTaskHistoryId = await getVarious('nowTaskHistoryId');
  // if it's not a site with proper url(i.g. new tab), just show.
  if (!_tab.url || !_tab.id) return;
  // eslint-disable-next-line
  if (checkChromeUrl(_tab.url)) return;
  if (currentTaskId === '') {
    const url = getBlockedPageUrl(_tab.url);
    chrome.tabs.update(_tab.id, { url });
    return;
  }
  const isValid = await validateUrl(_tab.url || '');
  const currentTask = await getTask(currentTaskId);
  const currentTaskHistory = await getTaskHistory(currentTaskHistoryId);
  const targetTime =
    currentTaskHistory.timeStart + currentTask.maxDuration * TIME_MINUTE;
  let isTimeout = false;
  if (currentTask.maxDuration > 0) isTimeout = getTime() > targetTime;
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
  const data = await exportSettings();
  logger('saving storage data', data);
};

// listen from background
const listenFromBackground = () => {
  logger('listening...');
  chrome.runtime.onMessage.addListener(function (message = {}, sender, reply) {
    logger('onMessage', { message, sender, reply });
    const { code } = message;
    if (code === EXPORT_SETTINGS) onExportSettings();
  });

  chrome.tabs.onUpdated.addListener((_tabId, _changeInfo, tab) => {
    onTabUpdate(tab);
  });
  chrome.tabs.onCreated.addListener(onTabUpdate);
  storage.onChange(onStorageChange);
  setInterval(onTick, 3000);
};

export default listenFromBackground;
