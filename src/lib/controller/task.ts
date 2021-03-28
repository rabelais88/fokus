import storage from '@/lib/storage';
import {
  STORE_TASK_HISTORY,
  STORE_TASK_HISTORY_NOW,
} from '@/constants/storeKey';
import getTime from '@/lib/getTime';
import makeResult from '@/lib/makeResult';
import makeError from '@/lib/makeError';
import _cloneDeep from 'lodash/cloneDeep';

interface startTaskArg {
  (taskId: string): Promise<resolvable<taskHistory[]>>;
}
export const startTask: startTaskArg = async (taskId: string) => {
  try {
    const history = await storage.get<taskHistory[]>(STORE_TASK_HISTORY);
    const timeNow = getTime();

    const currentTask = { taskId, timeStart: timeNow, timeEnd: -1 };

    const newHistory = [...history, currentTask];
    await storage.set(STORE_TASK_HISTORY, newHistory);
    await storage.set(STORE_TASK_HISTORY_NOW, currentTask);
    return makeResult(newHistory);
  } catch (error) {
    return makeError(undefined, error);
  }
};

interface endTaskArg {
  (): Promise<resolvable<taskHistory[]>>;
}
export const endTask: endTaskArg = async () => {
  try {
    const history = await storage.get<taskHistory[]>(STORE_TASK_HISTORY);
    const lastHistory = history[history.length - 1];
    if (!lastHistory) return makeError('NO_CURRENT_TASK');
    if (lastHistory.timeStart === -1) return makeError('NO_START_TIME');
    const newLastHistory = _cloneDeep(lastHistory);
    const timeNow = getTime();
    newLastHistory.timeEnd = timeNow;
    const newHistory = _cloneDeep(history);
    newHistory[history.length - 1] = newLastHistory;
    await storage.set(STORE_TASK_HISTORY, newHistory);
    await storage.set(STORE_TASK_HISTORY_NOW, {
      taskId: '',
      timeStart: -1,
      timeEnd: -1,
    });
    return makeResult(newHistory);
  } catch (error) {
    return makeError(undefined, error);
  }
};
