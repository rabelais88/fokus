import { mutate } from 'swr';
import storage from '@/lib/storage';
import makeLogger from './makeLogger';
import { STORE_TASKS, STORE_TASKS_INDEX } from '@/constants/storeKey';
import _omit from 'lodash/omit';
import _pull from 'lodash/pull';

const logger = makeLogger('lib/removeTask');

async function removeTask(taskId: string): Promise<resolvable> {
  const tasks = await storage.get(STORE_TASKS);
  const tasksId = await storage.get(STORE_TASKS_INDEX);

  const taskExists = !!tasks[taskId];
  if (!taskExists) throw new Error('no correspond task with given task id');

  const newTasks = _omit(tasks, [taskId]);
  const newTasksId = _pull(tasksId, taskId);
  logger({ newTasks, newTasksId });

  await storage.set(STORE_TASKS_INDEX, newTasksId);
  mutate(STORE_TASKS_INDEX, newTasksId);
  await storage.set(STORE_TASKS, newTasks);
  mutate(STORE_TASKS, newTasks);

  return { result: true, error: null, errorCode: '' };
}

export default removeTask;
