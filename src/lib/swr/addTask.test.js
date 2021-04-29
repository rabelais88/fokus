import addTask from './addTask';
import storage from '@/lib/storage';
import { STORE_TASKS, STORE_TASKS_INDEX } from '@/constants/storeKey';
import * as swr from 'swr';
import makeId from '@/lib/makeId';

jest.mock('@/lib/storage');
jest.mock('@/lib/makeId');
jest.mock('swr');

storage.get = jest.fn().mockImplementation((key) => {
  if (key === STORE_TASKS) return Promise.resolve({ testId: {}, testId2: {} });
  if (key === STORE_TASKS_INDEX) return Promise.resolve(['testId', 'testId2']);
});
swr.mutate = jest.fn().mockImplementation();
makeId.mockImplementation(() => 'testId3');

describe('addSite', () => {
  it('should add site and its index properly', async () => {
    await addTask({
      name: 'testTask',
    });
    expect(swr.mutate).toHaveBeenCalledWith(STORE_TASKS, {
      testId: {},
      testId2: {},
      testId3: { name: 'testTask', id: 'testId3' },
    });
    expect(swr.mutate).toHaveBeenCalledWith(STORE_TASKS_INDEX, [
      'testId',
      'testId2',
      'testId3',
    ]);
  });
});
