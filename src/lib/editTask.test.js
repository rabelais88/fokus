import editTask from './editTask';
import storage from './storage';
import { STORE_TASKS } from '@/constants/storeKey';
import * as swr from 'swr';

jest.mock('./storage');
jest.mock('swr');

storage.set = jest.fn().mockResolvedValue();
storage.get = jest.fn().mockImplementation((key) =>
  Promise.resolve({
    testId1: {
      id: 'testId1',
      changed: false,
    },
    testId2: {
      id: 'testId2',
      changed: false,
    },
  })
);
swr.mutate = jest.fn().mockImplementation();

describe('editTask', () => {
  it('should edit task property properly', async () => {
    await editTask({
      id: 'testId2',
      changed: true,
    });
    const newTasks = {
      testId1: { id: 'testId1', changed: false },
      testId2: { id: 'testId2', changed: true },
    };
    expect(storage.set).toHaveBeenCalledWith(STORE_TASKS, newTasks);
    expect(swr.mutate).toHaveBeenCalledWith(STORE_TASKS, newTasks);
  });
});
