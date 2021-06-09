import {
  LOAD_FAIL,
  LOAD_INIT,
  LOAD_LOADING,
  LOAD_SUCCESS,
  STORE_TASKS,
  SWR_TASK,
} from '@/constants';
import getDefaultValues from '@/constants/getStoreDefault';
import useSWR, { mutate } from 'swr';
import { editTask, getTask } from '../controller/task';

interface useTaskResult {
  task: taskData;
  loadState: loadStateType;
  editTask: typeof editTask;
}
const useTask = (taskId: string): useTaskResult => {
  const { data, error } = useSWR([SWR_TASK, taskId], () => getTask(taskId));
  const _editTask: typeof editTask = async (targetTask: taskData) => {
    await editTask(targetTask);
    mutate([SWR_TASK, targetTask.id]);
    return targetTask;
  };
  const result: useTaskResult = {
    loadState: LOAD_INIT,
    task: getDefaultValues()[STORE_TASKS],
    editTask: _editTask,
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

export default useTask;
