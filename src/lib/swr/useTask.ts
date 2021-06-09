import { LOAD_INIT, SWR_TASK } from '@/constants';
import useSWR from 'swr';
import { getTask } from '../controller/task';

const useTask = (taskId: string) => {
  const { data, error } = useSWR([SWR_TASK, taskId], () => getTask(taskId));
  const result = {
    loadState: LOAD_INIT,
  };
  if (error) {
    return;
  }
};
