import getTime from './getTime';
describe('getTime', () => {
  it('should yield proper number', () => {
    expect(typeof getTime()).toEqual('number');
  });
});
