import useSWR from 'swr';
import storage from '@/lib/storage';
import { STORE_TASKS, STORE_TASK_HISTORY } from '@/constants/storeKey';
import { LOAD_FAIL, LOAD_LOADING, LOAD_SUCCESS } from '@/constants';

type taskNowType = taskData & taskHistory;

export function useTaskNow() {
  let taskNow: taskNowType = {
    title: '',
    id: '',
    description: '',
    blockedSiteIds: [],
    allowedSiteIds: [],
    maxDuration: -1,
    timeStart: -1,
    timeEnd: -1,
    taskId: '',
  };
  const taskHistory = useSWR<taskHistory[]>(STORE_TASK_HISTORY, storage.get);
  const tasks = useSWR<tasksData>(STORE_TASKS, storage.get);
  if (taskHistory.error || tasks.error)
    return { taskNow, hasTask: false, loadState: LOAD_LOADING };
  if (!taskHistory.data || !tasks.data)
    return { taskNow, hasTask: false, loadState: LOAD_SUCCESS };
  const lastTask = taskHistory.data[taskHistory.data.length - 1];
  if (!lastTask) return { taskNow, hasTask: false, loadState: LOAD_SUCCESS };
  if (lastTask && lastTask.timeEnd === -1)
    return { taskNow, hasTask: false, loadState: LOAD_SUCCESS };

  // task history is in tact, but task detail does not exist
  const taskData = tasks.data[lastTask.taskId];
  if (!taskData) return { taskNow, hasTask: false, loadState: LOAD_FAIL };
  taskNow = { ...lastTask, ...taskData };
  return { taskNow, hasTask: true, loadState: LOAD_SUCCESS };
}

export default useTaskNow;
