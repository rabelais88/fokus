import makeLogger from '@/lib/makeLogger';
import getDefaultValues, { storageState } from '@/constants/getStoreDefault';

const logger = makeLogger('storage');

/**
 * @description
 * it does not work for Options.html
 */
const storage = () => {
  function set<K extends keyof storageState>(key: K, value: storageState[K]) {
    return new Promise((resolve, reject) => {
      logger('set()', { key, value });
      chrome.storage.sync.set({ [key]: value }, () => resolve(true));
    });
  }

  function get<K extends keyof storageState>(key: K): Promise<storageState[K]> {
    return new Promise((resolve, reject) => {
      logger('get()', { key });
      if (typeof key !== 'string') {
        logger('key should be string');
        reject();
      }

      chrome.storage.sync.get(key, (items) => {
        if (!items[key]) {
          const defaultValues = getDefaultValues();
          return resolve(defaultValues[key]);
        }
        return resolve(items[key]);
      });
    });
  }

  const onChange = (funcOnChange: onStorageChange) => {
    chrome.storage.onChanged.addListener(funcOnChange);
  };

  return { set, get, onChange };
};

export default storage();
