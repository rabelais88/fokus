import {
  STORE_WEBSITES,
  STORE_TASKS,
  STORE_TASK_HISTORY,
  STORE_VARIOUS,
  STORE_VARIOUS_KEY,
} from '@/constants/storeKey';
import { DBSchema } from 'idb';

export interface storageVarious {
  id: string;
  debug: boolean;
  nowTaskId: string;
  nowTaskHistoryId: string;
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
      id: STORE_VARIOUS_KEY,
      debug: false,
      nowTaskId: '',
      nowTaskHistoryId: '',
    },
  };
}

export interface fokusDbSchema extends DBSchema {
  [STORE_WEBSITES]: {
    key: string;
    value: websiteData;
    indexes: { id: string };
  };
  [STORE_TASKS]: {
    key: string;
    value: taskData;
    indexes: { id: string };
  };
  [STORE_TASK_HISTORY]: {
    key: string;
    value: taskHistory;
    indexes: { id: string; byTimeStart: [number, string] };
  };
  [STORE_VARIOUS]: {
    key: string;
    value: storageVarious;
    indexes: { id: string };
  };
}

export default getDefaultValues;
