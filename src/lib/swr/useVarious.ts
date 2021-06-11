import useSWR, { mutate } from 'swr';
import {
  SWR_VARIOUS,
  LOAD_SUCCESS,
  LOAD_LOADING,
  LOAD_FAIL,
  STORE_VARIOUS,
  LOAD_INIT,
} from '@/constants';
import getDefaultValues, { storageVarious } from '@/constants/getStoreDefault';
import {
  setVariousAll,
  setVarious,
  getVariousAll,
} from '@/lib/controller/various';

interface useVariousResult {
  various: storageVarious;
  loadState: loadStateType;
  setVariousAll: typeof setVariousAll;
  setVarious: typeof setVarious;
  revalidate: revalidateTypeAlt;
}
const _setVarious: typeof setVarious = async (K, val) => {
  const newVarious = await setVarious(K, val);
  mutate(SWR_VARIOUS, newVarious);
  return newVarious;
};
const _setVariousAll: typeof setVariousAll = async (val) => {
  const newVarious = await setVariousAll(val);
  mutate(SWR_VARIOUS, newVarious);
  return newVarious;
};
const useVarious = (): useVariousResult => {
  const { data, error, revalidate } = useSWR(SWR_VARIOUS, async () =>
    getVariousAll()
  );

  const result: useVariousResult = {
    various: getDefaultValues()[STORE_VARIOUS],
    loadState: LOAD_INIT,
    setVariousAll: _setVariousAll,
    setVarious: _setVarious,
    revalidate,
  };
  if (!data && !error) {
    result.loadState = LOAD_LOADING;
    return result;
  }
  if (error) {
    result.loadState = LOAD_FAIL;
    return result;
  }
  if (!data) {
    return result;
  }
  result.loadState = LOAD_SUCCESS;
  result.various = data;

  return result;
};

export default useVarious;
