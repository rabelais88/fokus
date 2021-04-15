interface makeResultArg<T = any> {
  (result: T): resolved<T>;
}
const makeResult: makeResultArg = (result) => {
  return { errorCode: '', error: null, result };
};

export default makeResult;
