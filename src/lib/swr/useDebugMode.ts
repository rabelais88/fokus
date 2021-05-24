import useSWR, { mutate } from 'swr';
import { getDebugMode, setDebugMode } from '@/lib/controller';
import { STORE_DEBUG } from '@/constants';
import { useCallback } from 'react';
import useLogger from '@/lib/useLogger';

const useDebugMode = () => {
  const logger = useLogger('lib/src/useDebugModule');
  const { data, error } = useSWR(STORE_DEBUG, async () => getDebugMode());
  const debugMode = !error && data;
  logger({ debugMode, data, error });
  const _setDebugMode = useCallback((v: boolean) => {
    logger('setDebugMode', v);
    setDebugMode(v);
    mutate(STORE_DEBUG, v, true);
  }, []);
  return { setDebugMode: _setDebugMode, debugMode: debugMode || false };
};

export default useDebugMode;
