interface makeResultArg<T = any> {
  (result: T): resolved<T>;
}

/* istanbul ignore next */
const makeResult: makeResultArg = (result) => {
  return { errorCode: '', error: null, result };
};

export default makeResult;
