// Copy this whole snippet to your browser console

import { storageState } from '@/constants/getStoreDefault';
import storage from '@/lib/storage';
import saveJson from '@/lib/file/saveJson';

const exportSettings = async () => {
  const db = await storage.getDB();
  const exportObj: any = {};

  const schedules = [];
  const exportStore = async (storeName: keyof storageState) => {
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
    await tx.done;
    exportObj[storeName] = storeObjs;
  };
  for (const storeName of db.objectStoreNames) {
    schedules.push(exportStore(storeName));
  }
  await Promise.all(schedules);
  saveJson(exportObj, 'settings.json');
  return exportObj;
};

export default exportSettings;
