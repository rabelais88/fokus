import { storageState } from '@/constants/getStoreDefault';
import storage from '@/lib/storage';
import saveJson from '@/lib/file/saveJson';

const exportSettings = async (debug = false) => {
  console.log('exportSettings');
  const db = await storage.getDB();
  const exportObj: any = {};

  const schedules = [];
  const exportStore = async (storeName: keyof storageState) => {
    console.log('exportSettings, accessing store of', storeName);
    const storeObjs = [];
    const tx = db.transaction(storeName, 'readonly');
    let cursor = await tx.store.openCursor();
    while (cursor) {
      storeObjs.push(cursor.value);
      try {
        cursor = await cursor.continue();
      } catch (err) {
        break;
      }
    }
    exportObj[storeName] = storeObjs;
  };
  for (const storeName of db.objectStoreNames) {
    schedules.push(exportStore(storeName));
  }
  await Promise.all(schedules);
  console.log('exportObj', exportObj);
  /* istanbul ignore next */
  if (!debug) saveJson(exportObj, 'settings.json');
  return exportObj;
};

export default exportSettings;
