import {
  STORE_TASK_HISTORY,
  STORE_VARIOUS,
  STORE_VARIOUS_KEY,
} from '@/constants';
import { storageVarious } from '@/constants/getStoreDefault';
import { makeId } from '@/lib';
import storage from '@/lib/storage';
import getTime from '../getTime';

interface getTaskHistoryArg extends pagingArg {
  searchFunc?: pagingSearchFunc<taskHistory>;
}

export const getTaskHistory = (taskHistoryId: string) => {
  return storage.get(STORE_TASK_HISTORY, taskHistoryId);
};

export const getTaskHistories = ({
  size = Infinity,
  cursorId,
  searchFunc,
}: getTaskHistoryArg = {}) => {
  return storage.getAll(STORE_TASK_HISTORY, size, cursorId, searchFunc);
};

export const searchTaskHistoryByTime = (
  timeStart: number,
  timeEnd: number,
  includeAll: boolean = true
) => {
  const searchFunc = (th: taskHistory) => {
    if (th.timeStart === -1 && !includeAll) return false;
    return th.timeStart > timeStart && th.timeStart < timeEnd;
  };
  return {
    getAll: (arg: pagingArg) =>
      getTaskHistories({ ...(arg || {}), searchFunc }),
  };
};

export const searchTaskHistoryById = (taskId: string) => {
  const searchFunc = (th: taskHistory) => {
    return th.taskId === taskId;
  };
  return {
    getAll: (arg: pagingArg) =>
      getTaskHistories({ ...(arg || {}), searchFunc }),
  };
};

export const removeTaskHistory = (taskId: string) => {
  return storage.remove(STORE_TASK_HISTORY, taskId);
};

export const startTask = async (taskId: string) => {
  const historyId = makeId();
  const th: taskHistory = {
    id: historyId,
    timeStart: getTime(),
    timeEnd: -1,
    taskId,
  };
  const various: storageVarious = {
    ...(await storage.get(STORE_VARIOUS, STORE_VARIOUS_KEY)),
    nowTaskId: taskId,
    nowTaskHistoryId: historyId,
  };
  const schedules = [
    storage.add(STORE_TASK_HISTORY, th),
    storage.set(STORE_VARIOUS, STORE_VARIOUS_KEY, various),
  ];
  await Promise.all(schedules);
  return { taskHistory: th, various };
};

export const endTask = async () => {
  const various = await storage.get(STORE_VARIOUS, STORE_VARIOUS_KEY);
  const { nowTaskHistoryId } = various;
  const lastHistory = await storage.get(STORE_TASK_HISTORY, nowTaskHistoryId);
  lastHistory.timeEnd = getTime();
  const schedules = [storage.set(STORE_VARIOUS, STORE_VARIOUS_KEY, various)];
  if (lastHistory.id !== '') {
    schedules.push(
      storage.set(STORE_TASK_HISTORY, nowTaskHistoryId, lastHistory)
    );
  }
  various.nowTaskId = '';
  various.nowTaskHistoryId = '';
  await Promise.all(schedules);
  return various;
};
