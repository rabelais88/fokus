import { getSites } from './controller/site';
import { getTask } from './controller/task';
import { getVarious } from './controller/various';

const getTaskInfo = async () => {
  // const nowTaskHistoryId = await getVarious('nowTaskHistoryId');
  const nowTaskId = await getVarious('nowTaskId');
  const nowTask = await getTask(nowTaskId);
  const { allowedSiteIds, blockedSiteIds } = nowTask;
  const [{ items: allowedSites }, { items: blockedSites }] = await Promise.all([
    getSites({ searchFunc: (website) => allowedSiteIds.includes(website.id) }),
    getSites({ searchFunc: (website) => blockedSiteIds.includes(website.id) }),
  ]);
  return { allowedSites, blockedSites, blockMode: nowTask.blockMode };
};

export default getTaskInfo;
