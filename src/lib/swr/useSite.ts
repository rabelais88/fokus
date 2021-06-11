import {
  LOAD_FAIL,
  LOAD_INIT,
  LOAD_LOADING,
  LOAD_SUCCESS,
  STORE_WEBSITES,
  SWR_WEBSITE,
} from '@/constants';
import getDefaultValues from '@/constants/getStoreDefault';
import useSWR from 'swr';
import { getSite } from '@/lib/controller/site';

interface useSiteResult {
  site: websiteData;
  loadState: loadStateType;
  revalidate: revalidateTypeAlt;
}

const useSite = (siteId: string) => {
  const { data, error, revalidate } = useSWR([SWR_WEBSITE, siteId], async () =>
    getSite(siteId)
  );

  const result: useSiteResult = {
    site: getDefaultValues()[STORE_WEBSITES],
    loadState: LOAD_INIT,
    revalidate,
  };

  if (error) {
    result.loadState = LOAD_FAIL;
    return result;
  }

  if (!data && !error) {
    result.loadState = LOAD_LOADING;
    return result;
  }

  if (!data) {
    return result;
  }

  result.loadState = LOAD_SUCCESS;
  result.site = data;
  return result;
};

export default useSite;
