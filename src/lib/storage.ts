import makeLogger from '@/lib/makeLogger';
import getDefaultValues, { storageState } from '@/constants/getStoreDefault';
import {
  openDB,
  deleteDB,
  wrap,
  unwrap,
  IDBPDatabase,
  OpenDBCallbacks,
} from 'idb';

const logger = makeLogger('storage');

/**
 * @description
 * production-grade storage wrapper.
 * prod uses indexed DB, but dev uses localstorage
 */
const storage = () => {
  let db: IDBPDatabase<unknown> | null = null;
  let onStorageChange: Function = () => {};

  const dbName = 'fokus';
  const dbVer = 1;
  const dbOpt: OpenDBCallbacks<unknown> = {
    upgrade(_db) {
      _db.createObjectStore('keyval');
    },
  };

  async function set<K extends keyof storageState>(
    key: K,
    value: storageState[K]
  ) {
    if (!db) db = await openDB(dbName, dbVer, dbOpt);
    logger('set()', { key, value });
    onStorageChange();
    // chrome.storage.sync.set({ [key]: value }, () => resolve(true));
    const tx = db.transaction(['keyval'], 'readwrite');
    const store = tx.objectStore('keyval');
    await store.put(value, key);
    await tx.done;
  }

  async function get<K extends keyof storageState>(
    key: K
  ): Promise<storageState[K]> {
    if (!db) db = await openDB(dbName, dbVer, dbOpt);
    logger('get()', { key });
    //   chrome.storage.sync.get(key, (items) => {
    //     if (!items[key]) {
    //       const defaultValues = getDefaultValues();
    //       return resolve(defaultValues[key]);
    //     }
    //     return resolve(items[key]);
    //   });
    const val = await db.get('keyval', key);
    if (val === undefined) return getDefaultValues()[key];
    return val;
  }

  function onChange(func: Function) {
    onStorageChange = func;
  }

  return { set, get, onChange };
};

export default storage();
