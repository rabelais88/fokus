import useSWR, { mutate } from 'swr';
import { getDebugMode, setDebugMode } from '@/lib/controller';
import { SWR_DEBUG_MODE } from '@/constants';
import { useCallback } from 'react';
import useLogger from '@/lib/useLogger';

const useDebugMode = () => {
  const logger = useLogger('lib/src/useDebugModule');
  const { data, error, revalidate } = useSWR(SWR_DEBUG_MODE, getDebugMode);
  const debugMode = !error && data;
  logger({ debugMode, data, error });
  const _setDebugMode = useCallback((v: boolean) => {
    logger('setDebugMode', v);
    setDebugMode(v);
    mutate(SWR_DEBUG_MODE, v);
  }, []);
  return {
    setDebugMode: _setDebugMode,
    debugMode: debugMode || false,
    revalidate,
  };
};

export default useDebugMode;
