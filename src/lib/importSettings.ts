// import STORE_PRESERVED_KEYS from '@/constants/STORE_PRESERVED_KEYS';
import openFile from '@/lib/file/openFile';
import { mutate } from 'swr';
import makeError from './makeError';
import makeLogger from './makeLogger';
import makeResult from './makeResult';
import storage from './storage';

const logger = makeLogger('lib/importSettings');

/**
 * @description
 * as it uses SWR, it must be executed inside a visible component
 */
const importSettings = async () => {
  const req = await openFile('.json');
  if (req.error) return req;
  if (!req.result) return makeError('RESULT_NULL');
  makeLogger(req.result);
  // const { settings } = JSON.parse(req.result);
  // const reconfigures = STORE_PRESERVED_KEYS.map(async (storeKey, i) => {
  //   logger('mutating store', storeKey, settings[i]);
  //   await storage.set(storeKey, settings[i]);
  //   await mutate(storeKey, settings[i]);
  // });
  // await Promise.all(reconfigures);
  return makeResult('SUCCESS');
};

export default importSettings;
