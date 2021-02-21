import useSWR from 'swr';
import storage from './storage';
import { LOAD_SUCCESS, LOAD_LOADING, LOAD_FAIL } from '../constants/loadState';
import { STORE_WEBSITES, STORE_WEBSITES_INDEX } from '@/constants/storeKey';
import makeLogger from './makeLogger';

const logger = makeLogger('lib/useSite');

function useSite(id: string) {
  const { data: sites = {}, error } = useSWR<websitesData>(
    STORE_WEBSITES,
    storage.get
  );

  logger({ sites, error });

  let loadState = LOAD_LOADING;

  if (error) loadState = LOAD_FAIL;
  if (!error && sites) loadState = LOAD_SUCCESS;
  const site = sites[id];
  if (!site) loadState = LOAD_FAIL;

  return { site, loadState };
}

export default useSite;
