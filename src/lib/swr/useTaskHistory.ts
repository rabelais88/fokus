import useSWR from 'swr';
import {
  LOAD_FAIL,
  LOAD_INIT,
  LOAD_LOADING,
  LOAD_SUCCESS,
  STORE_TASK_HISTORY,
  SWR_TASK_HISTORY,
} from '@/constants';
import { getTaskHistory } from '@/lib/controller/taskHistory';
import getDefaultValues from '@/constants/getStoreDefault';

interface useTaskHistoryResult {
  taskHistory: taskHistory;
  loadState: loadStateType;
}

const useTaskHistory = (taskHistoryId: string) => {
  const { data, error } = useSWR<taskHistory>(
    [SWR_TASK_HISTORY, taskHistoryId],
    async () => await getTaskHistory(taskHistoryId)
  );

  let result: useTaskHistoryResult = {
    loadState: LOAD_INIT,
    taskHistory: getDefaultValues()[STORE_TASK_HISTORY],
  };

  if (error && !data) {
    result.loadState = LOAD_LOADING;
    return result;
  }
  if (error) {
    result.loadState = LOAD_FAIL;
    return result;
  }
  if (!data) {
    return result;
  }
  result.loadState = LOAD_SUCCESS;
  result.taskHistory = data;
  return result;
};

export default useTaskHistory;
