import storage from '@/lib/storage';
import {
  STORE_TASKS,
  STORE_TASK_HISTORY,
  STORE_TASK_HISTORY_NOW,
  STORE_VARIOUS,
  STORE_VARIOUS_KEY,
} from '@/constants/storeKey';
import getTime from '@/lib/getTime';
import makeResult from '@/lib/makeResult';
import makeError from '@/lib/makeError';
import _cloneDeep from 'lodash/cloneDeep';
import { makeId } from '@/lib';
import { storageVarious } from '@/constants/getStoreDefault';

// interface startTaskArg {
//   (taskId: string): Promise<
//     resolvable<{ history: taskHistory[]; now: taskNowType }>
//   >;
// }
// export const startTask: startTaskArg = async (taskId: string) => {
//   try {
//     const history = await storage.get(STORE_TASK_HISTORY);
//     const timeNow = getTime();

//     const currentTask = { taskId, timeStart: timeNow, timeEnd: -1 };

//     const newHistory = [...history, currentTask];
//     await storage.set(STORE_TASK_HISTORY, newHistory);
//     await storage.set(STORE_TASK_HISTORY_NOW, currentTask);
//     return makeResult({ history: newHistory, now: currentTask });
//   } catch (error) {
//     return makeError(undefined, error);
//   }
// };

// interface endTaskArg {
//   (): Promise<resolvable<taskHistory[]>>;
// }
// export const endTask: endTaskArg = async () => {
//   try {
//     const history = await storage.get(STORE_TASK_HISTORY);
//     const lastHistory = history[history.length - 1];
//     if (!lastHistory) return makeError('NO_CURRENT_TASK');
//     if (lastHistory.timeStart === -1) return makeError('NO_START_TIME');
//     const newLastHistory = _cloneDeep(lastHistory);
//     const timeNow = getTime();
//     newLastHistory.timeEnd = timeNow;
//     const newHistory = _cloneDeep(history);
//     newHistory[history.length - 1] = newLastHistory;
//     await storage.set(STORE_TASK_HISTORY, newHistory);
//     await storage.set(STORE_TASK_HISTORY_NOW, {
//       taskId: '',
//       timeStart: -1,
//       timeEnd: -1,
//     });
//     return makeResult(newHistory);
//   } catch (error) {
//     return makeError(undefined, error);
//   }
// };

interface getTasksArg extends pagingArg {
  searchFunc?: pagingSearchFunc<taskData>;
}

export const getTasks = ({
  size = 20,
  cursorId,
  searchFunc,
}: getTasksArg = {}) => {
  return storage.getAll(STORE_TASKS, size, cursorId, searchFunc);
};

/**
 * @example
 * tasks.searchTaskTitle('abc').getAll({ size: 12, cursor: 'aaaa11111' })
 */
export const searchTaskTitle = (title: string) => {
  const searchFunc = (task: taskData) => {
    const re = new RegExp(title, 'i');
    return re.test(task.title);
  };
  return {
    getAll: (arg: pagingArg) => getTasks({ ...(arg || {}), searchFunc }),
  };
};

export const getTask = (taskId: string) => {
  return storage.get(STORE_TASKS, taskId);
};

export const addTask = (newTask: newTaskData) => {
  const id = makeId();
  const _newTask = { ...newTask, id };
  return storage.add(STORE_TASKS, _newTask);
};

export const removeTask = (taskId: string) => {
  return storage.remove(STORE_TASKS, taskId);
};

export const editTask = async (targetTask: taskData) => {
  await storage.set(STORE_TASKS, targetTask.id, targetTask);
  return targetTask;
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
};
