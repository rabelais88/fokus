import makeId from './makeId';

describe('makeId', () => {
  it('should yield different value for each iteration', () => {
    const [a, b, c] = Array.from({ length: 3 }).map(() => makeId());
    expect(a).not.toEqual(b);
    expect(b).not.toEqual(c);
    expect(a).not.toEqual(c);
  });
});
