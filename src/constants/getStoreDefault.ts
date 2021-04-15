import {
  STORE_WEBSITES_INDEX,
  STORE_WEBSITES,
  STORE_TASKS,
  STORE_TASKS_INDEX,
  STORE_TASK_HISTORY,
  STORE_TASK_HISTORY_NOW,
} from '@/constants/storeKey';

type getDefaultValueType = () => { [key: string]: any };

const getDefaultValues: getDefaultValueType = () => ({
  [STORE_WEBSITES_INDEX]: [],
  [STORE_WEBSITES]: {},
  [STORE_TASKS_INDEX]: [],
  [STORE_TASKS]: {},
  [STORE_TASK_HISTORY]: [],
  [STORE_TASK_HISTORY_NOW]: { taskId: '', timeStart: -1, timeEnd: -1 },
});

export default getDefaultValues;
