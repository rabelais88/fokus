import { STORE_WEBSITES } from '@/constants/storeKey';
import storage from '@/lib/storage';
import makeError from '@/lib/makeError';
import makeId from '@/lib/makeId';
import makeResult from '@/lib/makeResult';
// WIP --- all data structures will be reorganized with DAO

interface getSitesArg extends pagingArg {
  searchFunc?: pagingSearchFunc<websiteData>;
}

export const getSites = ({
  size = Infinity,
  cursorId,
  searchFunc,
}: getSitesArg = {}) => {
  return storage.getAll(STORE_WEBSITES, size, cursorId, searchFunc);
};

export const searchSiteTitle = (title: string) => {
  const searchFunc = (website: websiteData) => {
    const re = new RegExp(title, 'i');
    return re.test(website.title);
  };
  return {
    getAll: (arg: pagingArg) => getSites({ ...(arg || {}), searchFunc }),
  };
};

export const getSite = (siteId: string) => {
  return storage.get(STORE_WEBSITES, siteId);
};

export const addSite = (newSite: newWebsiteData) => {
  const id = makeId();
  const _newSite = { ...newSite, id };
  return storage.add(STORE_WEBSITES, _newSite);
};

export const removeSite = (siteId: string) => {
  return storage.remove(STORE_WEBSITES, siteId);
};

export const editSite = (targetSite: websiteData) => {
  return storage.set(STORE_WEBSITES, targetSite.id, targetSite);
};
