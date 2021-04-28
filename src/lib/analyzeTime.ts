import dayjs from 'dayjs';

const analyzeTime = (timestamp: number) => {
  const timeInfo = dayjs(timestamp);
  const hour24 = timeInfo.hour();
  const result = {
    year: timeInfo.year(),
    month: timeInfo.month() + 1,
    day: timeInfo.date(),
    hour24,
    minute: timeInfo.minute(),
    hour: hour24 > 12 ? hour24 - 12 : hour24,
    noon: hour24 > 12,
  };

  return result;
};

export default analyzeTime;
