import { mutate } from 'swr';
import storage from '@/lib/storage';
import makeId from '@/lib/makeId';
import makeLogger from '@/lib/makeLogger';
import { STORE_WEBSITES, STORE_WEBSITES_INDEX } from '@/constants/storeKey';

const logger = makeLogger('lib/addSite');

async function addSite(_site: websiteData): Promise<resolvable> {
  const id = makeId();
  console.log({ id });

  const site = {
    ..._site,
    id,
  };

  const sites = await storage.get(STORE_WEBSITES);
  const newSites = {
    ...(sites as {}),
    [id]: site,
  };

  const sitesId = await storage.get(STORE_WEBSITES_INDEX);
  const newSitesId = [...(sitesId as []), id];

  logger({ newSites, newSitesId });

  const jobs = [
    storage.set(STORE_WEBSITES, newSites),
    storage.set(STORE_WEBSITES_INDEX, newSitesId),
  ];
  await Promise.all(jobs);
  mutate(STORE_WEBSITES, newSites);
  mutate(STORE_WEBSITES_INDEX, newSitesId);

  return { result: true, error: null, errorCode: '' };
}

export default addSite;
