import strToRangedNumber from './strToRangedNumber';

describe('strToRangedNUmber', () => {
  it('string should be properly changed to number between range', () => {
    const val = strToRangedNumber('mytest', 5);
    const valAlt = strToRangedNumber('sdfsdfdsf', 12);
    expect(typeof val).toEqual('number');
    expect(typeof valAlt).toEqual('number');
    expect(val).toBeGreaterThanOrEqual(0);
    expect(valAlt).toBeGreaterThanOrEqual(0);
    expect(val).toBeLessThanOrEqual(5);
    expect(valAlt).toBeLessThanOrEqual(12);
  });
});
