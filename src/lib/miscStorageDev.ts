import makeLogger from './makeLogger';
import getMiscDefault, { miscState } from '@/constants/getMiscDefault';

const logger = makeLogger('storage(dev)');

const storage = () => {
  function set<K extends keyof miscState>(key: K, value: miscState[K]) {
    return new Promise((resolve, reject) => {
      localStorage.setItem(key, JSON.stringify(value));
      resolve(true);
    });
  }

  function get<K extends keyof miscState>(key: K): Promise<miscState[K]> {
    return new Promise((resolve, reject) => {
      logger('get()', { key });
      if (typeof key !== 'string') {
        logger('key should be string');
        reject();
      }

      const _value = localStorage.getItem(key);
      if (!_value) {
        const defaultValues = getMiscDefault();
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
