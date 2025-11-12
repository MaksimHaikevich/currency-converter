import { useCallback, useEffect, useRef } from 'react';

export function useThrottle<T extends (...args: any[]) => unknown>(fn: T, ms: number) {
  const lastCallTsRef = useRef(0);
  const savedFnRef = useRef(fn);

  useEffect(() => {
    savedFnRef.current = fn;
  }, [fn]);

  return useCallback(
    (...args: Parameters<T>): ReturnType<T> | undefined => {
      const now = Date.now();
      if (now - lastCallTsRef.current >= ms) {
        lastCallTsRef.current = now;
        return savedFnRef.current(...args) as ReturnType<T>;
      }
      return undefined;
    },
    [ms],
  );
}
