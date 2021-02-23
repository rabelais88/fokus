import editSite from './editSite';
import storage from './storage';
import { STORE_WEBSITES } from '@/constants/storeKey';
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

describe('addSite', () => {
  it('should add site and its index properly', async () => {
    await editSite({
      id: 'testId2',
      changed: true,
    });
    const newSites = {
      testId1: { id: 'testId1', changed: false },
      testId2: { id: 'testId2', changed: true },
    };
    expect(storage.set).toHaveBeenCalledWith(STORE_WEBSITES, newSites);
    expect(swr.mutate).toHaveBeenCalledWith(STORE_WEBSITES, newSites);
  });
});
