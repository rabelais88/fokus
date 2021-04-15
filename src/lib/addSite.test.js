import addSite from './addSite';
import storage from '@/lib/storage';
import { STORE_WEBSITES, STORE_WEBSITES_INDEX } from '@/constants/storeKey';
import * as swr from 'swr';
import makeId from './makeId';

jest.mock('@/lib/storage');
jest.mock('./makeId');
jest.mock('swr');

storage.get = jest.fn().mockImplementation((key) => {
  if (key === STORE_WEBSITES)
    return Promise.resolve({ testId: {}, testId2: {} });
  if (key === STORE_WEBSITES_INDEX)
    return Promise.resolve(['testId', 'testId2']);
});
swr.mutate = jest.fn().mockImplementation();
makeId.mockImplementation(() => 'testId3');

describe('addSite', () => {
  it('should add site and its index properly', async () => {
    await addSite({
      name: 'testSite',
    });
    expect(swr.mutate).toHaveBeenCalledWith(STORE_WEBSITES, {
      testId: {},
      testId2: {},
      testId3: { name: 'testSite', id: 'testId3' },
    });
    expect(swr.mutate).toHaveBeenCalledWith(STORE_WEBSITES_INDEX, [
      'testId',
      'testId2',
      'testId3',
    ]);
  });
});
