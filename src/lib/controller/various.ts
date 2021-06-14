import { STORE_VARIOUS, STORE_VARIOUS_KEY } from '@/constants';
import { storageVarious } from '@/constants/getStoreDefault';
import storage from '../storage';

export const getVarious = async <K extends keyof storageVarious>(key: K) => {
  const settings = await storage.get(STORE_VARIOUS, STORE_VARIOUS_KEY);
  return settings[key];
};

export const setVarious = async <K extends keyof storageVarious>(
  key: K,
  val: storageVarious[K]
) => {
  const settings = await storage.get(STORE_VARIOUS, STORE_VARIOUS_KEY);
  settings[key] = val;
  await storage.set(STORE_VARIOUS, settings);
  return settings;
};

export const getVariousAll = () => {
  return storage.get(STORE_VARIOUS, STORE_VARIOUS_KEY);
};
export const setVariousAll = async (various: storageVarious) => {
  await storage.set(STORE_VARIOUS, various);
  return various;
};
