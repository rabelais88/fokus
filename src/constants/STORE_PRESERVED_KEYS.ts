// do not import this from index.js

import { storageState } from './getStoreDefault';
import {
  STORE_TASKS,
  STORE_TASKS_INDEX,
  STORE_WEBSITES,
  STORE_WEBSITES_INDEX,
} from './storeKey';

const STORE_PRESERVED_KEYS: (keyof storageState)[] = [
  STORE_TASKS,
  STORE_TASKS_INDEX,
  STORE_WEBSITES,
  STORE_WEBSITES_INDEX,
];

export default STORE_PRESERVED_KEYS;
