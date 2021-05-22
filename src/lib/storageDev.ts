import makeLogger from './makeLogger';
import getDefaultValues, { storageState } from '@/constants/getStoreDefault';

const logger = makeLogger('storage(dev)');

const storage = () => {
  function set<K extends keyof storageState>(key: K, value: storageState[K]) {
    return new Promise((resolve, reject) => {
      localStorage.setItem(key, JSON.stringify(value));
      resolve(true);
    });
  }

  function get<K extends keyof storageState>(key: K): Promise<storageState[K]> {
    return new Promise((resolve, reject) => {
      logger('get()', { key });
      if (typeof key !== 'string') {
        logger('key should be string');
        reject();
      }

      const _value = localStorage.getItem(key);
      if (!_value) {
        const defaultValues = getDefaultValues();
        return resolve(defaultValues[key]);
      }
      return resolve(JSON.parse(_value));
    });
  }

  const onChange = (funcOnChange: onStorageChange) => {
    window.onstorage = (ev: StorageEvent) => {
      funcOnChange({ ...localStorage }, ev.newValue || '');
    };
  };

  return { set, get, onChange };
};

export default storage();
