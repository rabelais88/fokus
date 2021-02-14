import strToHash from './_strToHash';

describe('strToHash', () => {
  it('should yield different hash for differnt strings', () => {
    const valA = strToHash('sdjkfljskfl');
    const valB = strToHash('testSTring');
    expect(typeof valA).toEqual('number');
    expect(typeof valB).toEqual('number');
    expect(valA).not.toEqual(valB);
  });
});
