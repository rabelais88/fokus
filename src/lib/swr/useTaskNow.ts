import useSWR, { mutate } from 'swr';
import {
  LOAD_FAIL,
  LOAD_INIT,
  LOAD_LOADING,
  LOAD_SUCCESS,
  STORE_TASKS,
  STORE_TASK_HISTORY,
  SWR_TASK_NOW,
  SWR_VARIOUS,
} from '@/constants';
import makeLogger from '@/lib/makeLogger';
import { getVarious } from '@/lib/controller/various';
import {
  endTask,
  getTaskHistory,
  startTask,
} from '@/lib/controller/taskHistory';
import { getTask } from '@/lib/controller/task';
import getDefaultValues from '@/constants/getStoreDefault';

const logger = makeLogger('lib/swr/useTaskNow');

const getTaskNow = async () => {
  const nowTaskHistoryId = await getVarious('nowTaskHistoryId');
  const taskHistory = await getTaskHistory(nowTaskHistoryId);
  const { taskId } = taskHistory;
  const task = await getTask(taskId);
  return { task, taskHistory };
};

interface useTaskNowResult {
  task: taskData;
  taskHistory: taskHistory;
  loadState: loadStateType;
  startTask: typeof startTask;
  endTask: typeof endTask;
  hasTask: boolean;
}

const _startTask: typeof startTask = async (taskId) => {
  const { taskHistory, various } = await startTask(taskId);
  const task = await getTask(taskId);
  mutate(SWR_TASK_NOW, { taskHistory, task });
  mutate(SWR_VARIOUS, various);
  return { taskHistory, various };
};

const _endTask: typeof endTask = async () => {
  const various = await endTask();
  mutate(SWR_VARIOUS, various);
  mutate(SWR_TASK_NOW, {
    task: getDefaultValues()[STORE_TASKS],
    taskHistory: getDefaultValues()[STORE_TASK_HISTORY],
  });
  return various;
};

const useTaskNow = (): useTaskNowResult => {
  const { data, error } = useSWR(SWR_TASK_NOW, getTaskNow);

  const result: useTaskNowResult = {
    task: getDefaultValues()[STORE_TASKS],
    taskHistory: getDefaultValues()[STORE_TASK_HISTORY],
    loadState: LOAD_INIT,
    startTask: _startTask,
    endTask: _endTask,
    hasTask: false,
  };

  if (error) {
    result.loadState = LOAD_FAIL;
    return result;
  }

  if (!data && !error) {
    result.loadState = LOAD_LOADING;
    return result;
  }
  if (!data) {
    return result;
  }
  result.loadState = LOAD_SUCCESS;
  result.task = data.task;
  result.taskHistory = data.taskHistory;
  result.hasTask = data.task.id !== '';

  return result;
};

export default useTaskNow;
