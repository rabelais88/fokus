import useSWR from 'swr';
import storage from '@/lib/storage';
import { STORE_TASK_HISTORY } from '@/constants/storeKey';
import { LOAD_FAIL, LOAD_LOADING, LOAD_SUCCESS } from '@/constants';

const useTaskHistory = () => {
  const { data, error } = useSWR<taskHistory[]>(
    STORE_TASK_HISTORY,
    storage.get
  );
  let loadState = LOAD_LOADING;
  const taskHistory = data || [];
  if (error) loadState = LOAD_FAIL;
  if (!error && data) loadState = LOAD_SUCCESS;
  const noTaskHistory = taskHistory.length === 0;
  return { taskHistory, loadState, noTaskHistory };
};

export default useTaskHistory;
