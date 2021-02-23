import { mutate } from 'swr';
import storage from './storage';
import makeLogger from './makeLogger';
import { STORE_WEBSITES, STORE_WEBSITES_INDEX } from '@/constants/storeKey';
import _omit from 'lodash/omit';
import _pull from 'lodash/pull';

const logger = makeLogger('lib/removeSite');

async function removeSite(siteId: string): Promise<resolvable> {
  const sites = await storage.get<websitesData>(STORE_WEBSITES);
  const sitesId = await storage.get<websitesIndex>(STORE_WEBSITES_INDEX);

  const siteExists = !!sites[siteId];
  if (!siteExists) throw new Error('no correspond site with given site id');

  const newSites = _omit(sites, [siteId]);
  const newSitesId = _pull(sitesId, siteId);
  logger({ newSites, newSitesId });

  await storage.set(STORE_WEBSITES_INDEX, newSitesId);
  mutate(STORE_WEBSITES_INDEX, newSitesId);
  await storage.set(STORE_WEBSITES, newSites);
  mutate(STORE_WEBSITES, newSites);

  return { result: true, error: null, errorCode: '' };
}

export default removeSite;
