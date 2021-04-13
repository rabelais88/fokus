import makeLogger from './makeLogger';
import getDefaultValues from '@/constants/getStoreDefault';

const logger = makeLogger('storage(dev)');

const storage = () => {
  const set = (key: string, value: any) => {
    return new Promise((resolve, reject) => {
      localStorage.setItem(key, JSON.stringify(value));
      resolve(true);
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
        const _value = localStorage.getItem(key);
        if (!_value) {
          const defaultValues = getDefaultValues();
          return resolve(defaultValues[key]);
        }
        return resolve(JSON.parse(_value));
      }
    });
  }

  const remove = (key: string | string[]) => {
    return new Promise((resolve, reject) => {
      if (typeof key !== 'string' && Array.isArray(key)) {
        logger('key should be either string or cllection of strings');
        reject();
      }
      if (typeof key !== 'string') return resolve(false);
      localStorage.removeItem(key);
      return resolve(true);
    });
  };

  const onChange = (funcOnChange: onStorageChange) => {
    window.onstorage = (ev: StorageEvent) => {
      funcOnChange({ ...localStorage }, ev.newValue || '');
    };
  };

  return { set, get, remove, onChange };
};

export default storage();
