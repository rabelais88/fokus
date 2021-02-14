import { mutate } from 'swr';
import storage from './storage';
import { nanoid } from 'nanoid';
import makeLogger from './makeLogger';

const logger = makeLogger('addSite');

async function addSite(regex: string, description: string) {
  const id = nanoid();

  const sites = await storage.get('sites');
  const newSites = {
    ...(sites as {}),
    [id]: { regex, description },
  };

  logger({ newSites });
  await storage.set('sites', newSites);
  mutate('sites', newSites);
}

export default addSite;
