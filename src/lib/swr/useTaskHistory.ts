import useSWR from 'swr';
import storage from '@/lib/storage';
import { STORE_TASK_HISTORY } from '@/constants/storeKey';
import {
  LOAD_FAIL,
  LOAD_LOADING,
  LOAD_SUCCESS,
  SWR_TASK_HISTORIES,
} from '@/constants';
import { getPagingDefault } from '@/constants/getStoreDefault';

interface useTaskHistoryArg {
  size?: number;
  cursor?: string;
}

const useTaskHistory = ({ size = 20, cursor }: useTaskHistoryArg = {}) => {
  const { data, error } = useSWR<paging<taskHistory>>(
    [SWR_TASK_HISTORIES, size, cursor],
    async () => storage.getAll(STORE_TASK_HISTORY, size, cursor)
  );
  let loadState = LOAD_LOADING;
  if (error) loadState = LOAD_FAIL;
  if (!error && data) loadState = LOAD_SUCCESS;
  const { items, count, hasNext } = data || getPagingDefault();
  const noTaskHistory = count === 0;
  return { taskHistory: items, loadState, noTaskHistory, hasNext };
};

export default useTaskHistory;
