import { mutate } from 'swr';
import storage from './storage';
import makeLogger from './makeLogger';
import { STORE_TASKS } from '@/constants/storeKey';

const logger = makeLogger('lib/editTask');

async function editTask(task: taskData): Promise<resolvable> {
  const tasks = await storage.get<tasksData>(STORE_TASKS);
  const taskExists = !!tasks[task.id];
  if (!taskExists) throw new Error('no correspond site with given task id');
  const newTasks = {
    ...(tasks as {}),
    [task.id]: task,
  };

  logger({ newTasks });

  await storage.set(STORE_TASKS, newTasks);
  mutate(STORE_TASKS, newTasks);

  return { result: true, error: null, errorCode: '' };
}

export default editTask;
