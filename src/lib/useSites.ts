import useSWR from 'swr';
import storage from './storage';
import { LOAD_SUCCESS, LOAD_LOADING, LOAD_FAIL } from '../constants/loadState';
import { STORE_WEBSITES } from '@/constants/storeKey';

function useSites() {
  const { data, error } = useSWR(STORE_WEBSITES, storage.get);
  let loadState = LOAD_LOADING;
  if (error) loadState = LOAD_FAIL;
  if (!error && data) loadState = LOAD_SUCCESS;
  return { sites: <{ description: string; regex: string }[]>data, loadState };
}

export default useSites;
