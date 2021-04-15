import { mutate } from 'swr';
import storage from '@/lib/storage';
import makeLogger from './makeLogger';
import { STORE_WEBSITES, STORE_WEBSITES_INDEX } from '@/constants/storeKey';

const logger = makeLogger('lib/addSite');

async function editSiteOrder(sitesId: websitesIndex): Promise<resolvable> {
  if (!Array.isArray(sitesId)) throw new Error('sites id should be array!');
  if (sitesId.some((siteId) => typeof siteId !== 'string'))
    throw new Error('individual site id should be string!');

  logger({ sitesId });

  await storage.set(STORE_WEBSITES, sitesId);
  mutate(STORE_WEBSITES_INDEX, sitesId);
  return { result: true, error: null, errorCode: '' };
}

export default editSiteOrder;
