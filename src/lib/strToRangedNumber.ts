import strToHash from './_strToHash';

const strToRangedNumber = (value: string, max: number) => {
  const seed = strToHash(value);
  return Math.ceil(Math.abs(Math.sin(seed)) * max);
};

export default strToRangedNumber;
