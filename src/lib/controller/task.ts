import storage from '@/lib/storage';
import { STORE_TASKS } from '@/constants/storeKey';
import _cloneDeep from 'lodash/cloneDeep';
import { makeId } from '@/lib';

interface getTasksArg extends pagingArg {
  searchFunc?: pagingSearchFunc<taskData>;
}

export const getTasks = ({
  size = Infinity,
  cursorId,
  searchFunc,
}: getTasksArg = {}) => {
  return storage.getAll(STORE_TASKS, size, cursorId, searchFunc);
};

/**
 * @example
 * tasks.searchTaskTitle('abc').getAll({ size: 12, cursor: 'aaaa11111' })
 */
export const searchTaskTitle = (title: string) => {
  const searchFunc = (task: taskData) => {
    const re = new RegExp(title, 'i');
    return re.test(task.title);
  };
  return {
    getAll: (arg: pagingArg) => getTasks({ ...(arg || {}), searchFunc }),
  };
};

export const getTask = (taskId: string) => {
  return storage.get(STORE_TASKS, taskId);
};

export const addTask = (newTask: newTaskData) => {
  const id = makeId();
  const _newTask = { ...newTask, id };
  return storage.add(STORE_TASKS, _newTask);
};

export const removeTask = (taskId: string) => {
  return storage.remove(STORE_TASKS, taskId);
};

export const editTask = async (targetTask: taskData) => {
  await storage.set(STORE_TASKS, targetTask);
  return targetTask;
};
