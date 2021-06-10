import {
  LOAD_FAIL,
  LOAD_INIT,
  LOAD_LOADING,
  LOAD_SUCCESS,
  SWR_WEBSITES,
} from '@/constants';
import { getPagingDefault } from '@/constants/getStoreDefault';
import useSWR from 'swr';
import { getSites, searchSiteTitle } from '../controller/site';
import useLogger from '../useLogger';

interface useSitesArg extends pagingArg {
  title?: string;
}

interface useSitesResult extends paging<websiteData> {
  loadState: loadStateType;
}

type useSitesFunc = (arg: useSitesArg) => useSitesResult;

const useSites: useSitesFunc = ({ size = Infinity, title = '', cursorId }) => {
  const logger = useLogger('useSites');
  logger({ size, title });
  const { data, error } = useSWR(
    [SWR_WEBSITES, size, cursorId, title],
    async () => {
      if (title !== '')
        return await searchSiteTitle(title).getAll({ size, cursorId });
      return getSites({ size, cursorId });
    }
  );
  logger('result', { data, error });

  const result: useSitesResult = {
    loadState: LOAD_INIT,
    ...getPagingDefault(),
  };

  if (error) {
    result.loadState = LOAD_FAIL;
    return result;
  }

  if (!error && !data) {
    result.loadState = LOAD_LOADING;
    return result;
  }

  if (!data) {
    return result;
  }

  result.loadState = LOAD_SUCCESS;
  result.items = data.items;
  result.count = data.count;
  result.hasNext = data.hasNext;
  return result;
};

export default useSites;
