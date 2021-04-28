import useSWR from 'swr';
import storage from '@/lib/storage';
import { LOAD_SUCCESS, LOAD_LOADING, LOAD_FAIL } from '../constants/loadState';
import { STORE_TASKS, STORE_TASKS_INDEX } from '@/constants/storeKey';
import makeLogger from './makeLogger';

const logger = makeLogger('lib/useTasks');

function useTasks({
  keyword = '',
  cursor = 0,
}: { keyword?: string; cursor?: number } = {}) {
  const tasks = useSWR<tasksData>(STORE_TASKS, storage.get);
  const tasksId = useSWR<tasksIndex>(STORE_TASKS_INDEX, storage.get);

  logger({ keyword, tasks, tasksId });

  let loadState = LOAD_LOADING;
  const hasError = tasks.error || tasksId.error;
  if (hasError) loadState = LOAD_FAIL;
  const noError = !tasks.error && !tasksId.error;
  const hasData = tasks.data && tasksId.data;
  if (noError && hasData) loadState = LOAD_SUCCESS;
  const _tasksId = tasksId.data || [];
  const _tasks = tasks.data || {};

  const tasklist = _tasksId.map((taskId) => _tasks[taskId]);

  const re = new RegExp(keyword, 'i');
  const filteredTasks = tasklist.filter(
    (task) => re.test(task.description) || re.test(task.title)
  );

  const noTask = filteredTasks.length === 0;
  return { tasks: filteredTasks, tasksById: _tasks, noTask, loadState };
}

export default useTasks;
