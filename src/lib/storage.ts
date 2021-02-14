import makeLogger from './makeLogger';

const logger = makeLogger('storage');

type defaultValueType = () => { [key: string]: any };
const getDefaultValues: defaultValueType = () => ({
  sites: {},
});

const storage = () => {
  const set = (key: string, value: any) => {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set({ [key]: value }, () => resolve(true));
    });
  };

  const get = (key: string | string[]) => {
    return new Promise((resolve, reject) => {
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
        return resolve(items);
      });
    });
  };

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
