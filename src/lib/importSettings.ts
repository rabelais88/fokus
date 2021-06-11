// import STORE_PRESERVED_KEYS from '@/constants/STORE_PRESERVED_KEYS';
import { fokusDbSchema } from '@/constants/getStoreDefault';
import openFile from '@/lib/file/openFile';
import { IDBPDatabase } from 'idb';
import { mutate } from 'swr';
import makeError from './makeError';
import makeLogger from './makeLogger';
import makeResult from './makeResult';
import storage from './storage';

const logger = makeLogger('lib/importSettings');

/**
 * @description
 * https://gist.github.com/loilo/ed43739361ec718129a15ae5d531095b
 * Import data from JSON into an IndexedDB database.
 * This does not delete any existing data from the database, so keys may clash.
 */
export function importFromJson(
  idbDatabase: IDBPDatabase<fokusDbSchema>,
  json: string
) {
  return new Promise((resolve, reject) => {
    const transaction = idbDatabase.transaction(
      [...idbDatabase.objectStoreNames],
      'readwrite'
    );
    transaction.addEventListener('error', reject);

    var importObject = JSON.parse(json);
    for (const storeName of idbDatabase.objectStoreNames) {
      let count = 0;
      for (const toAdd of importObject[storeName]) {
        const request = transaction.objectStore(storeName).add(toAdd);
        request.then(() => {
          count++;
          if (count === importObject[storeName].length) {
            // Added all objects for this store
            delete importObject[storeName];
            if (Object.keys(importObject).length === 0) {
              // Added all object stores
              resolve(undefined);
            }
          }
        });
      }
    }
  });
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
  makeLogger(req.result);
  const db = await storage.getDB();
  importFromJson(db, req.result);

  return makeResult('SUCCESS');
};

export default importSettings;
