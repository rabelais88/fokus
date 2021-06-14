import { RefObject, useEffect } from 'react';

const useMount = <T = unknown>(ref: RefObject<T> | RefObject<T>[]) => {
  let refs = Array.isArray(ref) ? ref : [ref];
  let onMount = () => {};

  const mount = (func: () => void) => {
    onMount = func;
  };
  useEffect(
    () => {
      if (refs.every((r) => r.current !== null && r.current !== undefined)) {
        onMount();
      }
    },
    refs.map((r) => r.current)
  );
  return { mount };
};

export default useMount;
