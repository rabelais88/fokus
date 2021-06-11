import makeLogger from '@/lib/makeLogger';
import getDefaultValues, {
  storageState,
  fokusDbSchema,
} from '@/constants/getStoreDefault';
import { IDBPDatabase, OpenDBCallbacks } from 'idb';
import { openDB } from 'idb';
import {
  STORE_WEBSITES,
  STORE_TASKS,
  STORE_TASK_HISTORY,
  STORE_VARIOUS,
  STORE_DB,
} from '@/constants/storeKey';

const logger = makeLogger('storage');

/**
 * @description
 * production-grade storage wrapper.
 * prod uses indexed DB, but dev uses localstorage
 */
const storage = () => {
  let db: IDBPDatabase<fokusDbSchema> | null = null;
  let onStorageChange: Function = () => {};

  const dbVer = 1;
  const dbOpt: OpenDBCallbacks<fokusDbSchema> = {
    upgrade(_db) {
      _db.createObjectStore(STORE_WEBSITES, { keyPath: 'id' });
      _db.createObjectStore(STORE_TASKS, { keyPath: 'id' });
      const th = _db.createObjectStore(STORE_TASK_HISTORY, { keyPath: 'id' });
      // multiple keys are allowed
      th.createIndex('byTimeStart', ['timeStart', 'id']);
      _db.createObjectStore(STORE_VARIOUS, { keyPath: 'id' });
    },
  };

  const getDB = async () => {
    if (!db) db = await openDB<fokusDbSchema>(STORE_DB, dbVer, dbOpt);
    return db;
  };

  async function set<K extends keyof storageState>(
    store: K,
    value: storageState[K]
  ) {
    if (!db) db = await getDB();
    logger(`set(${store})`, value);
    onStorageChange();
    const s = db.transaction(store, 'readwrite').store;
    await s.put(value);
  }

  async function add<K extends keyof storageState>(
    store: K,
    value: storageState[K]
  ) {
    if (!db) db = await getDB();
    logger(`add(${store})`, value);
    onStorageChange();
    const tx = db.transaction(store, 'readwrite');
    await tx.store.add(value);
    await tx.done;
  }

  async function get<K extends keyof storageState>(
    store: K,
    key: string
  ): Promise<fokusDbSchema[K]['value']> {
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
    searchFunc?: (arg: fokusDbSchema[K]['value']) => boolean
  ): Promise<paging<fokusDbSchema[K]['value']>> {
    if (!db) db = await getDB();

    const tx = db.transaction(store, 'readwrite');
    let cursor = await tx.store.openCursor(cursorId);
    if (store === STORE_TASK_HISTORY) {
      // monkey patch for type error
      const index = 'byTimeStart' as keyof fokusDbSchema[K]['indexes'];
      // must use the same parameter time
      cursor = await tx.store
        .index(index)
        .openCursor(IDBKeyRange.lowerBound([0, cursorId || ''], true));
    }

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
    if (!db) db = await getDB();
    await db.delete(store, cursorId);
  }

  function onChange(func: Function) {
    onStorageChange = func;
  }

  return { add, set, get, getAll, remove, onChange, getDB };
};

export default storage();
