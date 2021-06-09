import useSWR from 'swr';
import {
  LOAD_FAIL,
  LOAD_INIT,
  LOAD_LOADING,
  LOAD_SUCCESS,
  SWR_TASK_HISTORIES,
} from '@/constants';
import { searchTaskHistoryByTime } from '../controller/taskHistory';

interface useTaskHistoryArg {
  size?: number;
  cursorId?: string;
  timeStart: number;
  timeEnd: number;
}
interface useTaskHistoryResult extends paging<taskHistory> {
  loadState: loadStateType;
}
type useTaskHistoryFunc = (arg: useTaskHistoryArg) => useTaskHistoryResult;

const useTaskHistory: useTaskHistoryFunc = ({
  size = 20,
  cursorId,
  timeStart,
  timeEnd,
}) => {
  const { data, error } = useSWR<paging<taskHistory>>(
    [SWR_TASK_HISTORIES, size, cursorId],
    () => searchTaskHistoryByTime(timeStart, timeEnd).getAll({ size, cursorId })
  );
  let result: useTaskHistoryResult = {
    items: [],
    loadState: LOAD_INIT,
    count: 0,
    hasNext: false,
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
  result.items = data.items;
  result.hasNext = data.hasNext;
  result.count = data.count;
  return result;
};

export default useTaskHistory;
