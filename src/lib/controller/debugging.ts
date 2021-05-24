// even might be used within core modules. avoid all module dependencies, except constants.
import { STORE_DEBUG } from '@/constants/storeKey';

export const setDebugMode = (value: boolean) => {
  localStorage.setItem(STORE_DEBUG, value.toString());
};

export const getDebugMode = () => {
  return localStorage.getItem(STORE_DEBUG) === 'true';
};
