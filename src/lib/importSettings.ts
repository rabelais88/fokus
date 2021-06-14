import { fokusDbSchema, storageState } from '@/constants/getStoreDefault';
import openFile from '@/lib/file/openFile';
import { IDBPDatabase } from 'idb';
import makeError from './makeError';
import makeLogger from './makeLogger';
import makeResult from './makeResult';
import storage from './storage';

const logger = makeLogger('lib/importSettings');

/**
 * @description
 * Import data from JSON into an IndexedDB database.
 * be careful! it overwrites pre-existing keys.
 */
async function importFromJson(
  db: IDBPDatabase<fokusDbSchema>,
  jsonData: string
) {
  const importObj = JSON.parse(jsonData);
  const schedules = [];
  const importStore = async <K extends keyof storageState>(storeName: K) => {
    const _schedules: Promise<void>[] = [];
    logger('storeName', storeName);
    const tx = await db.transaction(storeName, 'readwrite');
    type tmpType = fokusDbSchema[K]['value'];
    const storeItems: tmpType[] = Array.from(importObj[storeName]);
    storeItems.forEach((item) => {
      logger('storeItems', item);
      const req = async () => {
        logger('start finding item', item.id);
        const cursor = await tx.store.openCursor(item.id);
        logger('findItem - ', item.id, !!cursor);
        // create when the item does not exist
        if (!cursor) {
          await tx.store.add(item);
          return;
        }
        await tx.store.put(item);
        logger('item write finished', item.id);
      };
      _schedules.push(req());
    });
    await Promise.all(_schedules);
  };
  for (const storeName of db.objectStoreNames) {
    schedules.push(importStore(storeName));
  }
  logger('all task assigned');
  await Promise.all(schedules);
  logger('finished');
}

/**
 * @description
 * as it uses SWR, it must be executed inside a visible component
 * (2021-June-11) it no longer uses SWR. it relies on extra revalidation.
 */
const importSettings = async () => {
  const req = await openFile('.json');
  if (req.error) return req;
  if (!req.result) return makeError('RESULT_NULL');
  logger(req.result);
  const db = await storage.getDB();
  try {
    importFromJson(db, req.result);
  } catch (err) {
    console.error(err);
    logger('error', err);
  }

  return makeResult('SUCCESS');
};

export default importSettings;
