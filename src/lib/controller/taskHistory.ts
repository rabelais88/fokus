import { STORE_TASK_HISTORY } from '@/constants';
import { makeId } from '@/lib';
import storage from '@/lib/storage';
import getTime from '../getTime';

interface getTaskHistoryArg extends pagingArg {
  searchFunc?: pagingSearchFunc<taskHistory>;
}
export const getTaskHistory = ({
  size = 20,
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
    getAll: (arg: pagingArg) => getTaskHistory({ ...(arg || {}), searchFunc }),
  };
};

export const searchTaskHistoryById = (taskId: string) => {
  const searchFunc = (th: taskHistory) => {
    return th.taskId === taskId;
  };
  return {
    getAll: (arg: pagingArg) => getTaskHistory({ ...(arg || {}), searchFunc }),
  };
};

export const removeTaskHistory = (taskId: string) => {
  return storage.remove(STORE_TASK_HISTORY, taskId);
};
