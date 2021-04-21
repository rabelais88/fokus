import useSWR from 'swr';
import storage from '@/lib/storage';
import { LOAD_SUCCESS, LOAD_LOADING, LOAD_FAIL } from '../constants/loadState';
import { STORE_WEBSITES, STORE_WEBSITES_INDEX } from '@/constants/storeKey';
import makeLogger from './makeLogger';

const logger = makeLogger('lib/useSites');
function useSites({
  keyword = '',
  cursor = 0,
}: {
  keyword?: string;
  cursor?: number;
} = {}) {
  const websites = useSWR<websitesData>(STORE_WEBSITES, storage.get);
  const websitesId = useSWR<websitesIndex>(STORE_WEBSITES_INDEX, storage.get);

  logger({ websites, websitesId });

  let loadState = LOAD_LOADING;
  const hasError = websites.error || websitesId.error;
  if (hasError) loadState = LOAD_FAIL;
  const noError = !websites.error && !websitesId.error;
  const hasData = websites.data && websitesId.data;
  if (noError && hasData) loadState = LOAD_SUCCESS;
  const _websitesId = websitesId.data || [];
  const _websites = websites.data || {};
  const sites = _websitesId.map((siteId) => _websites[siteId]);

  const re = new RegExp(keyword, 'i');
  const filteredSites = sites.filter((site) => {
    if (!site) return false;
    return re.test(site.description) || re.test(site.title);
  });
  const noSite = filteredSites.length === 0;
  return { sites: filteredSites, noSite, loadState };
}

export default useSites;
