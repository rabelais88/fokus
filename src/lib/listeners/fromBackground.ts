import makeLogger from '../makeLogger';
import sendFromBackground from '../senders/fromBackground';
import { MSG_CHANGE_COLOR } from '../../constants';
import storage from '@/lib/storage';
import {
  STORE_TASKS,
  STORE_TASK_HISTORY_NOW,
  STORE_WEBSITES,
} from '@/constants/storeKey';

const logger = makeLogger('listenFromBackground');

const onTabUpdate = async (_tab: chrome.tabs.Tab) => {
  logger('tab updated', _tab);
  const [taskHistoryNow, tasksById, sitesById] = await Promise.all([
    storage.get<taskHistory>(STORE_TASK_HISTORY_NOW),
    storage.get<tasksData>(STORE_TASKS),
    storage.get<websitesData>(STORE_WEBSITES),
  ]);
  logger('current task', taskHistoryNow);
  if (taskHistoryNow.taskId === '') {
    logger('no task is running at this moment', taskHistoryNow);
    return;
  }
  const taskNow = tasksById[taskHistoryNow.taskId];
  const allowedSites = taskNow.allowedSiteIds.map(
    (siteId) => sitesById[siteId]
  );
  const blockedSites = taskNow.blockedSiteIds.map(
    (siteId) => sitesById[siteId]
  );
  logger({ allowedSites, blockedSites });
};

const onTick = () => {
  logger('ticking...');
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
  setInterval(onTick, 5000);
};

export default listenFromBackground;
