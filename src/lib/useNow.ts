import { useEffect, useState, useMemo } from 'react';

const useNow = (
  interval = 1000,
  onTick?: (arg: { now: Date; timestampNow: number }) => void
) => {
  const [now, setNow] = useState(new Date());
  const timestampNow = useMemo(() => now.getTime(), [now]);
  useEffect(() => {
    const _timer = setInterval(() => {
      setNow(new Date());
      if (typeof onTick === 'function') onTick({ now, timestampNow });
      return function cleanup() {
        clearInterval(_timer);
      };
    }, interval);
  }, []);
  return { now, timestampNow };
};

export default useNow;
