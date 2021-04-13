import useSWR from 'swr';
import storage from '@/lib/storage';
import { LOAD_SUCCESS, LOAD_LOADING, LOAD_FAIL } from '../constants/loadState';
import { STORE_TASKS, STORE_WEBSITES } from '@/constants/storeKey';
import makeLogger from './makeLogger';

const logger = makeLogger('lib/useTask');

function useTask(id: string) {
  const { data: tasks = {}, error } = useSWR<tasksData>(
    STORE_TASKS,
    storage.get
  );

  logger({ tasks, error });

  let loadState = LOAD_LOADING;

  if (error) loadState = LOAD_FAIL;
  if (!error && tasks) loadState = LOAD_SUCCESS;
  const task = tasks[id];
  if (!task) loadState = LOAD_FAIL;

  return { task, loadState };
}

export default useTask;
