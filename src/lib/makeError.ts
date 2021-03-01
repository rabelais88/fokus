interface makeErrorArg<T = any> {
  (errorCode?: string, error?: T): rejected<T>;
}
const makeError: makeErrorArg = (
  errorCode = 'ERROR_CODE_UNKNOWN',
  error = {}
) => {
  return { errorCode, error, result: null };
};

export default makeError;
