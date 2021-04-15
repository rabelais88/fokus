import { STORE_WEBSITES, STORE_WEBSITES_INDEX } from '@/constants/storeKey';
import storage from '@/lib/storage';
import makeError from '@/lib/makeError';
import makeId from '@/lib/makeId';
import makeResult from '@/lib/makeResult';
// WIP --- all data structures will be reorganized with DAO

interface getSiteArg {
  (siteId: string): Promise<resolvable<websiteData>>;
}
export const getSite: getSiteArg = async (siteId: string) => {
  try {
    const websites = await storage.get<websitesData>(STORE_WEBSITES);
    return makeResult(websites[siteId] || {});
  } catch (error) {
    return makeError(undefined, error);
  }
};

interface getSitesArg {
  (arg: { keyword?: string }): Promise<resolvable<websiteData[]>>;
}
export const getSites: getSitesArg = async ({ keyword = '' }) => {
  try {
    const websites = await storage.get<websitesData>(STORE_WEBSITES);
    const websitesId = await storage.get<websitesIndex>(STORE_WEBSITES_INDEX);
    const sites = websitesId.map((siteId) => websites[siteId]);
    const re = new RegExp(keyword, 'i');
    const filteredSites = sites.filter(
      (site) => re.test(site.description) || re.test(site.title)
    );
    return makeResult(filteredSites);
  } catch (error) {
    return makeError(undefined, error);
  }
};

interface editSiteArg {
  (site: websiteData): Promise<resolvable<websitesData>>;
}
export const editSite: editSiteArg = async (site: websiteData) => {
  try {
    const sites = await storage.get<websitesData>(STORE_WEBSITES);
    const siteExists = !!sites[site.id];
    if (!siteExists) return makeError('SITE_NOT_EXIST');
    const newSites = {
      ...(sites as {}),
      [site.id]: site,
    };
    await storage.set(STORE_WEBSITES, newSites);
    return makeResult(newSites);
  } catch (error) {
    return makeError(undefined, error);
  }
};

interface addSiteArg {
  (site: websiteData): Promise<resolvable<websiteData>>;
}
export const addSite: addSiteArg = async (site: websiteData) => {
  try {
    const id = makeId();
    const newSite = {
      ...site,
      id,
    };

    const sites = await storage.get(STORE_WEBSITES);
    const newSites = {
      ...(sites as {}),
      [id]: newSite,
    };
    const sitesId = await storage.get(STORE_WEBSITES_INDEX);
    const newSitesId = [...(sitesId as []), id];

    const jobs = [
      storage.set(STORE_WEBSITES, newSites),
      storage.set(STORE_WEBSITES_INDEX, newSitesId),
    ];
    await Promise.all(jobs);
    return makeResult(newSite);
  } catch (error) {
    return makeError(undefined, error);
  }
};
