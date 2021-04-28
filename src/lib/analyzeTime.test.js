import analyzeTime from './analyzeTime';

describe('analyzeTime', () => {
  it('2000-01-01 01:02', () => {
    const timeA = new Date('2000-01-01 01:02').getTime();
    expect(analyzeTime(timeA)).toEqual({
      year: 2000,
      month: 1,
      day: 1,
      hour24: 1,
      hour: 1,
      minute: 2,
      noon: false,
    });
  });
});
