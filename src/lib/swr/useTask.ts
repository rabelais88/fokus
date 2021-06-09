import {
  LOAD_FAIL,
  LOAD_INIT,
  LOAD_LOADING,
  LOAD_SUCCESS,
  STORE_TASKS,
  SWR_TASK,
} from '@/constants';
import getDefaultValues from '@/constants/getStoreDefault';
import useSWR from 'swr';
import { getTask } from '../controller/task';

interface useTaskResult {
  task: taskData;
  loadState: loadStateType;
}
const useTask = (taskId: string): useTaskResult => {
  const { data, error } = useSWR([SWR_TASK, taskId], () => getTask(taskId));
  const result: useTaskResult = {
    loadState: LOAD_INIT,
    task: getDefaultValues()[STORE_TASKS],
  };
  if (!data && !error) {
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
  result.task = data;
  result.loadState = LOAD_SUCCESS;
  return result;
};
