import makeLogger from '@/lib/makeLogger';
import getDefaultValues, {
  getPagingDefault,
  storageState,
  storageStateNew,
  storageVarious,
} from '@/constants/getStoreDefault';
import { IDBPDatabase, OpenDBCallbacks } from 'idb';
import { openDB, DBSchema } from 'idb';
import {
  STORE_WEBSITES,
  STORE_TASKS,
  STORE_TASK_HISTORY,
  STORE_VARIOUS,
  STORE_DB,
} from '@/constants/storeKey';

const logger = makeLogger('storage');

interface DB extends DBSchema {
  [STORE_WEBSITES]: {
    key: string;
    value: websiteData;
    indexes: { id: string };
  };
  [STORE_TASKS]: {
    key: string;
    value: taskData;
    indexes: { id: string };
  };
  [STORE_TASK_HISTORY]: {
    key: string;
    value: taskHistory;
    indexes: { id: string };
  };
  [STORE_VARIOUS]: {
    key: string;
    value: storageVarious;
    indexes: { id: string };
  };
}

/**
 * @description
 * production-grade storage wrapper.
 * prod uses indexed DB, but dev uses localstorage
 */
const storage = () => {
  let db: IDBPDatabase<DB> | null = null;
  let onStorageChange: Function = () => {};

  const dbVer = 3;
  const dbOpt: OpenDBCallbacks<DB> = {
    upgrade(_db) {
      _db.createObjectStore(STORE_WEBSITES, { keyPath: 'id' });
      _db.createObjectStore(STORE_TASKS, { keyPath: 'id' });
      _db.createObjectStore(STORE_TASK_HISTORY, { keyPath: 'id' });
      _db.createObjectStore(STORE_VARIOUS, { keyPath: 'id' });
    },
  };

  async function set<K extends keyof storageState>(
    store: K,
    value: storageState[K]
  ) {
    if (!db) db = await openDB<DB>(STORE_DB, dbVer, dbOpt);
    logger(`set(${store})`, value);
    onStorageChange();
    const s = db.transaction(store, 'readwrite').store;
    await s.put(value);
  }

  async function add<K extends keyof storageState>(
    store: K,
    value: storageState[K]
  ) {
    if (!db) db = await openDB<DB>(STORE_DB, dbVer, dbOpt);
    logger(`add(${store})`, value);
    onStorageChange();
    const tx = db.transaction(store, 'readwrite');
    await tx.store.add(value);
    await tx.done;
  }

  async function get<K extends keyof storageState>(
    store: K,
    key: string
  ): Promise<DB[K]['value']> {
    if (!db) db = await openDB(STORE_DB, dbVer, dbOpt);
    const val = await db.get(store, key);
    logger(`get(${store}, ${key})`, val);
    if (val === undefined) {
      const defaultValues = getDefaultValues();
      logger(`get(${key}) return default`, getDefaultValues()[store]);
      return defaultValues[store];
    }
    logger(`get(${key}) return`, val);
    return val;
  }

  async function getAll<K extends keyof storageState>(
    store: K,
    size: number,
    cursorId?: string,
    searchFunc?: (arg: DB[K]['value']) => boolean
  ): Promise<paging<DB[K]['value']>> {
    if (!db) db = await openDB<DB>(STORE_DB, dbVer, dbOpt);

    const tx = db.transaction(store, 'readwrite');
    let cursor = await tx.store.openCursor(cursorId);
    let i = 0;
    let items = [];
    while (i < size && cursor) {
      const isItemValid =
        typeof searchFunc === 'function' ? searchFunc(cursor.value) : true;
      if (isItemValid) {
        items.push(cursor.value);
        i += 1;
      }
      try {
        cursor = await cursor.continue();
      } catch (err) {
        break;
      }
    }
    const hasNext = !!cursor;
    const count = await tx.store.count();
    return { items, count, hasNext };
  }

  async function remove<K extends keyof storageState>(
    store: K,
    cursorId: string
  ) {
    if (!db) db = await openDB<DB>(STORE_DB, dbVer, dbOpt);
    await db.delete(store, cursorId);
  }

  function onChange(func: Function) {
    onStorageChange = func;
  }

  return { add, set, get, getAll, remove, onChange };
};

export default storage();
