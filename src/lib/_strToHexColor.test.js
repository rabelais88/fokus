import strToHexColor from './_strToHexColor';
describe('strToHexColor', () => {
  it('must yield proper hex color from string', () => {
    const color = strToHexColor('abcd');
    const re = /^#[0-9a-f]{6}$/i;
    expect(re.test(color)).toEqual(true);
  });
});
