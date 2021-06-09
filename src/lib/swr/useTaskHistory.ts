import useSWR from 'swr';
import storage from '@/lib/storage';
import { STORE_TASK_HISTORY } from '@/constants/storeKey';
import {
  LOAD_FAIL,
  LOAD_INIT,
  LOAD_LOADING,
  LOAD_SUCCESS,
  SWR_TASK_HISTORIES,
} from '@/constants';
import { getPagingDefault } from '@/constants/getStoreDefault';

interface useTaskHistoryArg {
  size?: number;
  cursor?: string;
  title?: string;
}
interface useTaskHistoryResult extends paging<taskHistory> {
  loadState: loadStateType;
}
type useTaskHistoryFunc = (arg: useTaskHistoryArg) => useTaskHistoryResult;

const useTaskHistory: useTaskHistoryFunc = ({
  size = 20,
  cursor,
  title = '',
} = {}) => {
  const { data, error } = useSWR<paging<taskHistory>>(
    [SWR_TASK_HISTORIES, size, cursor],
    async () => storage.sea(STORE_TASK_HISTORY, size, cursor)
  );
  let result: useTaskHistoryResult = {
    items: [],
    loadState: LOAD_INIT,
    count: 0,
    hasNext: false,
  };
  if (error) {
    result.loadState = LOAD_FAIL;
    return result;
  }
  if (!error && data) {
    loadState = LOAD_SUCCESS;
  }
  return result;
};

export default useTaskHistory;
