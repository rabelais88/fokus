import makeError from './makeError';

describe('makeError', () => {
  it('should yield proper default message', () => {
    const err = makeError();
    expect(err).toEqual({
      errorCode: 'ERROR_CODE_UNKNOWN',
      error: {},
      result: null,
    });
  });
  it('should yield proper error with given message & data', () => {
    const err = makeError('ERROR_1', { aaa: 111 });
    expect(err).toEqual({
      errorCode: 'ERROR_1',
      error: { aaa: 111 },
      result: null,
    });
  });
});
