/**
 * @function strToHash
 * @description
 * turns string to hash number
 */
function strToHash(str: string): number {
  var hash = 5381;
  for (var i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i); /* hash * 33 + c */
  }
  return hash;
}

export default strToHash;
