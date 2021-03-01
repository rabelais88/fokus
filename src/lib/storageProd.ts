import {
  STORE_WEBSITES_INDEX,
  STORE_WEBSITES,
  STORE_TASKS,
  STORE_TASKS_INDEX,
  STORE_TASK_HISTORY,
} from '@/constants/storeKey';
import makeLogger from '@/lib/makeLogger';

const logger = makeLogger('storage');

type defaultValueType = () => { [key: string]: any };
const getDefaultValues: defaultValueType = () => ({
  [STORE_WEBSITES_INDEX]: [],
  [STORE_WEBSITES]: {},
  [STORE_TASKS_INDEX]: [],
  [STORE_TASKS]: {},
  [STORE_TASK_HISTORY]: [],
});

/**
 * @description
 * it does not work for Options.html
 */
const storage = () => {
  const set = (key: string, value: any) => {
    return new Promise((resolve, reject) => {
      logger('set()', { key, value });
      chrome.storage.sync.set({ [key]: value }, () => resolve(true));
    });
  };

  function get<T = unknown>(key: string | string[]): Promise<T> {
    return new Promise((resolve, reject) => {
      logger('get()', { key });
      if (typeof key !== 'string' && Array.isArray(key)) {
        logger('key should be either string or collection of strings');
        reject();
      }

      if (typeof key === 'string') {
        chrome.storage.sync.get(key, (items) => {
          if (!items[key]) {
            const defaultValues = getDefaultValues();
            return resolve(defaultValues[key]);
          }
          return resolve(items[key]);
        });
      }

      chrome.storage.sync.get(key, (items) => {
        return resolve(<T>items);
      });
    });
  }

  const remove = (key: string | string[]) => {
    return new Promise((resolve, reject) => {
      if (typeof key !== 'string' && Array.isArray(key)) {
        logger('key should be either string or cllection of strings');
        reject();
      }
      chrome.storage.sync.remove(key, () => {
        return resolve(true);
      });
    });
  };

  const onChange = (funcOnChange: onStorageChange) => {
    chrome.storage.onChanged.addListener(funcOnChange);
  };

  return { set, get, remove, onChange };
};

export default storage();
