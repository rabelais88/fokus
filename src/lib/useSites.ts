import useSWR from 'swr';
import storage from './storage';
import { LOAD_SUCCESS, LOAD_LOADING, LOAD_FAIL } from '../constants/loadState';
import { STORE_WEBSITES } from '@/constants/storeKey';
import makeLogger from './makeLogger';

const logger = makeLogger('useSites');
function useSites() {
  const { data = [], error } = useSWR(STORE_WEBSITES, storage.get);
  logger({ data, error });
  let loadState = LOAD_LOADING;
  if (error) loadState = LOAD_FAIL;
  if (!error && data) loadState = LOAD_SUCCESS;
  return { sites: <websiteData[]>data, loadState };
}

export default useSites;
