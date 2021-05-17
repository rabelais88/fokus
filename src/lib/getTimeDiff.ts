import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const getDuration = (timestamp: number, timestampAlt: number) => {
  const tsDiff = timestamp - timestampAlt;
  const diff = dayjs.duration(tsDiff);
  const isFuture = tsDiff < 0;

  return {
    year: Math.abs(diff.years()),
    month: Math.abs(diff.months()),
    day: Math.abs(diff.days()),
    hour: Math.abs(diff.hours()),
    minute: Math.abs(diff.minutes()),
    second: Math.abs(diff.seconds()),
    isFuture,
  };
};

export default getDuration;
