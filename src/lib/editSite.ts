import { mutate } from 'swr';
import storage from './storage';
import makeLogger from './makeLogger';
import { STORE_WEBSITES, STORE_WEBSITES_INDEX } from '@/constants/storeKey';

const logger = makeLogger('lib/addSite');

async function editSite(site: websiteData): Promise<resolvable> {
  const sites = await storage.get<websitesData>(STORE_WEBSITES);
  const siteExists = !!sites[site.id];
  if (!siteExists) throw new Error('no correspond site with given site id');
  const newSites = {
    ...(sites as {}),
    [site.id]: site,
  };

  logger({ newSites });

  await storage.set(STORE_WEBSITES, newSites);
  mutate(STORE_WEBSITES, newSites);

  return { result: true, error: null, errorCode: '' };
}

export default editSite;
