import makeResult from '@/lib/makeResult';
import makeError from '@/lib/makeError';

async function resolver<T = any>(...arg: any[]): Promise<resolvable<T>> {
  try {
    const [func, ...args] = arg;
    const req = await func(...args);
    return makeResult(req);
  } catch (err) {
    return makeError(err);
  }
}

export default resolver;
