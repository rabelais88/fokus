// even might be used within core modules. avoid all module dependencies, except constants.
import { openDB, IDBPDatabase, OpenDBCallbacks } from 'idb';
import {
  STORE_WEBSITES,
  STORE_TASKS,
  STORE_TASK_HISTORY,
  STORE_VARIOUS,
  STORE_DB,
  STORE_VARIOUS_KEY,
} from '@/constants/storeKey';

const DebugController = () => {
  let db: IDBPDatabase<unknown> | null = null;

  const dbVer = 3;
  const dbOpt: OpenDBCallbacks<unknown> = {
    upgrade(_db) {
      _db
        .createObjectStore(STORE_WEBSITES, { keyPath: 'id' })
        .createIndex('id', 'id', { unique: true });
      _db
        .createObjectStore(STORE_TASKS, { keyPath: 'id' })
        .createIndex('id', 'id', { unique: true });
      _db
        .createObjectStore(STORE_TASK_HISTORY, { keyPath: 'id' })
        .createIndex('id', 'id', { unique: true });
      _db
        .createObjectStore(STORE_VARIOUS, { keyPath: 'id' })
        .createIndex('id', 'id', { unique: true });
    },
  };

  const setDebugMode = async (value: boolean) => {
    if (!db) db = await openDB(STORE_DB, dbVer, dbOpt);
    const settings = await db.get(STORE_VARIOUS, STORE_VARIOUS_KEY);
    await db.put(
      STORE_VARIOUS,
      { ...settings, debug: value },
      STORE_VARIOUS_KEY
    );
  };

  const getDebugMode = async (): Promise<boolean> => {
    if (!db) db = await openDB(STORE_DB, dbVer, dbOpt);
    const settings = await db.get(STORE_VARIOUS, STORE_VARIOUS_KEY);
    return settings.debug;
  };

  return { setDebugMode, getDebugMode };
};

const debugController = DebugController();
export const setDebugMode = debugController.setDebugMode;
export const getDebugMode = debugController.getDebugMode;
export default debugController;
