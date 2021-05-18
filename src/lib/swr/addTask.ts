import { mutate } from 'swr';
import storage from '@/lib/storage';
import makeId from '@/lib/makeId';
import makeLogger from '@/lib/makeLogger';
import { STORE_TASKS, STORE_TASKS_INDEX } from '@/constants/storeKey';

const logger = makeLogger('lib/addTask');

async function addTask(_task: taskData): Promise<resolvable> {
  const id = makeId();
  console.log({ id });

  const task = {
    ..._task,
    id,
  };

  const tasks = await storage.get(STORE_TASKS);
  const newTasks = {
    ...(tasks as {}),
    [id]: task,
  };

  const tasksId = await storage.get(STORE_TASKS_INDEX);
  const newTasksId = [...(tasksId as []), id];

  logger({ newTasks, newTasksId });

  const jobs = [
    storage.set(STORE_TASKS, newTasks),
    storage.set(STORE_TASKS_INDEX, newTasksId),
  ];
  await Promise.all(jobs);
  mutate(STORE_TASKS, newTasks);
  mutate(STORE_TASKS_INDEX, newTasksId);

  return { result: true, error: null, errorCode: '' };
}

export default addTask;
