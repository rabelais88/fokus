import {
  LOAD_FAIL,
  LOAD_INIT,
  LOAD_LOADING,
  LOAD_SUCCESS,
  SWR_TASKS,
} from '@/constants';
import { getPagingDefault } from '@/constants/getStoreDefault';
import useSWR from 'swr';
import { getTasks, searchTaskTitle } from '../controller/task';

interface useTasksArg extends pagingArg {
  title?: string;
}

interface useTasksResult extends paging<taskData> {
  loadState: loadStateType;
}

type useTasksFunc = (arg: useTasksArg) => useTasksResult;

const useTasks: useTasksFunc = ({ size = 20, cursorId, title = '' }) => {
  const { data, error } = useSWR(
    [SWR_TASKS, size, cursorId, title],
    async () => {
      if (title === '') return getTasks({ size, cursorId });
      return searchTaskTitle(title).getAll({ size, cursorId });
    }
  );

  const result: useTasksResult = {
    loadState: LOAD_INIT,
    ...getPagingDefault<taskData>(),
  };

  if (error) {
    result.loadState = LOAD_FAIL;
    return result;
  }
  if (!data && !error) {
    result.loadState = LOAD_LOADING;
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

export default useTasks;
