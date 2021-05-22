import { mutate } from 'swr';
import storage from '@/lib/storage';
import makeLogger from '@/lib/makeLogger';
import { STORE_WEBSITES } from '@/constants/storeKey';

const logger = makeLogger('lib/editSite');

async function editSite(site: websiteData): Promise<resolvable> {
  const sites = await storage.get(STORE_WEBSITES);
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
