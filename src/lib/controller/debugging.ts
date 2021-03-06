/**
 * this might be used within core modules.
 * AVOID ALL module dependencies, except constants.
 *  */
import { openDB, IDBPDatabase, OpenDBCallbacks } from 'idb';
import {
  STORE_WEBSITES,
  STORE_TASKS,
  STORE_TASK_HISTORY,
  STORE_VARIOUS,
  STORE_DB,
  STORE_VARIOUS_KEY,
} from '@/constants/storeKey';
import getDefaultValues from '@/constants/getStoreDefault';

const DebugController = () => {
  let db: IDBPDatabase<unknown> | null = null;

  const dbVer = 1;
  const dbOpt: OpenDBCallbacks<unknown> = {
    upgrade(_db) {
      _db.createObjectStore(STORE_WEBSITES, { keyPath: 'id' });
      _db.createObjectStore(STORE_TASKS, { keyPath: 'id' });
      const th = _db.createObjectStore(STORE_TASK_HISTORY, { keyPath: 'id' });
      th.createIndex('byTimeStart', ['timeStart', 'id']);
      _db.createObjectStore(STORE_VARIOUS, { keyPath: 'id' });
    },
  };

  const setDebugMode = async (value: boolean) => {
    if (!db) db = await openDB(STORE_DB, dbVer, dbOpt);
    const settings = await db.get(STORE_VARIOUS, STORE_VARIOUS_KEY);
    if (!settings) {
      await db.add(STORE_VARIOUS, {
        ...getDefaultValues()[STORE_VARIOUS],
        debug: value,
      });
      return;
    }
    await db.put(STORE_VARIOUS, { ...settings, debug: value });
  };

  const getDebugMode = async (): Promise<boolean> => {
    if (!db) db = await openDB(STORE_DB, dbVer, dbOpt);
    const settings = await db.get(STORE_VARIOUS, STORE_VARIOUS_KEY);
    if (!settings) return getDefaultValues()[STORE_VARIOUS].debug;
    return settings.debug;
  };

  return { setDebugMode, getDebugMode };
};

const debugController = DebugController();
export const setDebugMode = debugController.setDebugMode;
export const getDebugMode = debugController.getDebugMode;
export default debugController;
