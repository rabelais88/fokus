import storage from '@/lib/storage';
import {
  STORE_TASKS,
  STORE_TASK_HISTORY_NOW,
  STORE_WEBSITES,
} from '@/constants/storeKey';

const getTaskInfo = async () => {
  const [taskHistoryNow, tasksById, sitesById] = await Promise.all([
    storage.get<taskHistory>(STORE_TASK_HISTORY_NOW),
    storage.get<tasksData>(STORE_TASKS),
    storage.get<websitesData>(STORE_WEBSITES),
  ]);
  if (taskHistoryNow.taskId === '') {
    return { allowedSites: [], blockedSites: [] };
  }
  const taskNow = tasksById[taskHistoryNow.taskId];
  const allowedSites = taskNow.allowedSiteIds.map(
    (siteId) => sitesById[siteId]
  );
  const blockedSites = taskNow.blockedSiteIds.map(
    (siteId) => sitesById[siteId]
  );
  return { allowedSites, blockedSites, blockMode: taskNow.blockMode };
};

export default getTaskInfo;
