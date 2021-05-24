import { useCallback } from 'react';
import makeLogger from '@/lib/makeLogger';

const useLogger = (moduleName: string) => {
  const logger = useCallback(makeLogger(moduleName), [moduleName]);
  return logger;
};

export default useLogger;
