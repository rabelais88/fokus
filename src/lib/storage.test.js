import storage from './storage';
// import { openDB } from 'idb';
import { STORE_VARIOUS, STORE_VARIOUS_KEY } from '@/constants';

describe('storage', () => {
  it('initialization should work properly', async () => {
    const val = {
      id: STORE_VARIOUS_KEY,
      debug: true,
      nowTaskId: 'aaa',
      nowTaskHistoryId: 'bbb',
    };
    await storage.set(STORE_VARIOUS, val);
    const result = await storage.get(STORE_VARIOUS, STORE_VARIOUS_KEY);
    expect(result).toEqual(val);
  });
});
