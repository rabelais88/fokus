import getTimeDiff from './getTimeDiff';

describe('getTimeDiff', () => {
  it('should be able to tell future', () => {
    // 1 day, 5 minutes diff
    const timeA = new Date('2020-01-02 00:00').getTime();
    const timeB = new Date('2020-01-03 00:05').getTime();
    const diff = getTimeDiff(timeA, timeB);
    expect(diff).toEqual({
      year: 0,
      month: 0,
      hour: 0,
      day: 1,
      minute: 5,
      second: 0,
      isFuture: true,
    });
  });
  it('should be able to tell past', () => {
    // 3 year, 14 days diff
    const timeA = new Date('2020-01-20 00:00').getTime();
    const timeB = new Date('2017-01-06 00:00').getTime();
    const diff = getTimeDiff(timeA, timeB);
    expect(diff).toEqual({
      year: 3,
      month: 0,
      day: 14,
      hour: 0,
      minute: 0,
      second: 0,
      isFuture: false,
    });
  });
});
