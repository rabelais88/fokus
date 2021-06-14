import useSWR from 'swr';
import {
  LOAD_FAIL,
  LOAD_INIT,
  LOAD_LOADING,
  LOAD_SUCCESS,
  SWR_TASK_HISTORIES,
} from '@/constants';
import { searchTaskHistoryByTime } from '@/lib/controller/taskHistory';

interface useTaskHistoryArg extends pagingArg {
  timeStart: number;
  timeEnd: number;
}
interface useTaskHistoryResult extends paging<taskHistory> {
  loadState: loadStateType;
  revalidate: revalidateTypeAlt;
}
type useTaskHistoryFunc = (arg: useTaskHistoryArg) => useTaskHistoryResult;

const useTaskHistories: useTaskHistoryFunc = ({
  size = Infinity,
  cursorId,
  timeStart,
  timeEnd,
}) => {
  const { data, error, revalidate } = useSWR<paging<taskHistory>>(
    [SWR_TASK_HISTORIES, size, cursorId, timeStart, timeEnd],
    () => searchTaskHistoryByTime(timeStart, timeEnd).getAll({ size, cursorId })
  );
  let result: useTaskHistoryResult = {
    items: [],
    loadState: LOAD_INIT,
    count: 0,
    hasNext: false,
    revalidate,
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

export default useTaskHistories;
