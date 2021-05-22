import {
  STORE_WEBSITES_INDEX,
  STORE_WEBSITES,
  STORE_TASKS,
  STORE_TASKS_INDEX,
  STORE_TASK_HISTORY,
  STORE_TASK_HISTORY_NOW,
} from '@/constants/storeKey';

export interface storageState {
  [STORE_WEBSITES_INDEX]: websitesIndex;
  [STORE_WEBSITES]: websitesData;
  [STORE_TASKS_INDEX]: tasksIndex;
  [STORE_TASKS]: tasksData;
  [STORE_TASK_HISTORY]: taskHistory[];
  [STORE_TASK_HISTORY_NOW]: taskHistory;
}

function getDefaultValues(): storageState {
  return {
    [STORE_WEBSITES_INDEX]: [],
    [STORE_WEBSITES]: {},
    [STORE_TASKS_INDEX]: [],
    [STORE_TASKS]: {},
    [STORE_TASK_HISTORY]: [],
    [STORE_TASK_HISTORY_NOW]: { taskId: '', timeStart: -1, timeEnd: -1 },
  };
}

export default getDefaultValues;
