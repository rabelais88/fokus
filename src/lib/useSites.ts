import useSWR from 'swr';
import storage from './storage';
import { LOAD_SUCCESS, LOAD_LOADING, LOAD_FAIL } from '../constants/loadState';

function useSites() {
  const { data, error } = useSWR('sites', storage.get);
  let loadState = LOAD_LOADING;
  if (error) loadState = LOAD_FAIL;
  if (!error && data) loadState = LOAD_SUCCESS;
  return { sites: data, loadState };
}

export default useSites;
