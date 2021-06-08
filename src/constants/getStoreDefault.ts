import {
  STORE_WEBSITES,
  STORE_TASKS,
  STORE_TASK_HISTORY,
  STORE_VARIOUS,
  STORE_VARIOUS_ID_DEBUG,
  STORE_VARIOUS_ID_TASK_NOW,
} from '@/constants/storeKey';

export interface storageVarious {
  id: string;
  [STORE_VARIOUS_ID_DEBUG]: boolean;
  [STORE_VARIOUS_ID_TASK_NOW]: string;
}
export interface storageState {
  [STORE_WEBSITES]: websiteData;
  [STORE_TASKS]: taskData;
  [STORE_TASK_HISTORY]: taskHistory;
  [STORE_VARIOUS]: storageVarious;
}

export interface storageStateNew {
  [STORE_WEBSITES]: newWebsiteData;
  [STORE_TASKS]: newTaskData;
  [STORE_TASK_HISTORY]: newTaskHistory;
}

export const getPagingDefault = <V>(): paging<V> => ({
  items: [],
  count: 0,
  hasNext: false,
});

function getDefaultValues(): storageState {
  return {
    [STORE_WEBSITES]: {
      id: '',
      title: '',
      description: '',
      urlRegex: '',
      urlMode: 'URL_MODE_TEXT',
    },
    [STORE_TASKS]: {
      id: '',
      title: '',
      emojiId: '',
      description: '',
      blockedSiteIds: [],
      allowedSiteIds: [],
      blockMode: 'BLOCK_MODE_ALLOW_ALL',
      maxDuration: -1,
    },
    [STORE_TASK_HISTORY]: {
      id: '',
      timeStart: 0,
      timeEnd: 0,
      taskId: '',
    },
    [STORE_VARIOUS]: {
      id: '',
      [STORE_VARIOUS_ID_DEBUG]: false,
      [STORE_VARIOUS_ID_TASK_NOW]: '',
    },
  };
}

export default getDefaultValues;
