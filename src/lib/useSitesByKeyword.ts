import useSWR from 'swr';
import storage from './storage';
import { LOAD_SUCCESS, LOAD_LOADING, LOAD_FAIL } from '../constants/loadState';
import { STORE_WEBSITES } from '@/constants/storeKey';
import makeLogger from './makeLogger';

const logger = makeLogger('lib/useSitesByKeyword');

function useSitesByKeyword(keyword: string) {
  const { data: sites = {}, error } = useSWR<websitesData>(
    STORE_WEBSITES,
    storage.get
  );

  logger({ sites, error });

  let loadState = LOAD_LOADING;
  let matchingSites: websiteData[] = [];

  if (error) loadState = LOAD_FAIL;
  if (!error && sites) loadState = LOAD_SUCCESS;

  if (sites) {
    const reKeyword = new RegExp(keyword, 'i');
    matchingSites = Object.values(sites).filter(
      (site) => reKeyword.test(site.title) || reKeyword.test(site.description)
    );
  }

  return { matchingSites, loadState };
}

export default useSitesByKeyword;
