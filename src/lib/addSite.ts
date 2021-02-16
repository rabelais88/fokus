import { mutate } from 'swr';
import storage from './storage';
import { nanoid } from 'nanoid';
import makeLogger from './makeLogger';
import { STORE_WEBSITES } from '@/constants/storeKey';

const logger = makeLogger('addSite');

async function addSite(regex: string, description: string) {
  const id = nanoid();

  const sites = await storage.get(STORE_WEBSITES);
  const newSites = {
    ...(sites as {}),
    [id]: { regex, description },
  };

  logger({ newSites });
  await storage.set(STORE_WEBSITES, newSites);
  mutate(STORE_WEBSITES, newSites);
}

export default addSite;
