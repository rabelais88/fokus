import djb2 from './_strToHash';

/**
 * @description
 * turns hash string to Hex Color
 */
function hashStringToColor(str: string) {
  var hash = djb2(str);
  var r = (hash & 0xff0000) >> 16;
  var g = (hash & 0x00ff00) >> 8;
  var b = hash & 0x0000ff;
  return (
    '#' +
    ('0' + r.toString(16)).substr(-2) +
    ('0' + g.toString(16)).substr(-2) +
    ('0' + b.toString(16)).substr(-2)
  );
}

export default hashStringToColor;
