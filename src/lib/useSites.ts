import useSWR from 'swr';
import storage from './storage';
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
}) {
  const websites = useSWR<websitesData>(STORE_WEBSITES, storage.get);
  const websitesId = useSWR<websitesIndex>(STORE_WEBSITES_INDEX, storage.get);

  logger({ websites, websitesId });

  let loadState = LOAD_LOADING;
  if (websites.error || websitesId.error) loadState = LOAD_FAIL;
  if (!websites.error && !websitesId.error && websites.data && websitesId.data)
    loadState = LOAD_SUCCESS;
  const sites = (websitesId.data || []).map(
    (siteId) => (websites.data || {})[siteId]
  );

  const re = new RegExp(keyword, 'ig');
  const filteredSites = sites.filter(
    (site) => re.test(site.description) || re.test(site.title)
  );
  return { sites: filteredSites, loadState };
}

export default useSites;
