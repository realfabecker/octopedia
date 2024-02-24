import { useCallback, useEffect } from "react";
import debounce from "lodash.debounce";

export const useDebouncedCallback = (
  callback: (v: any) => void,
  delay: number,
  dependencies: [] = [],
) => {
  const debouncedCallback = useCallback(
    debounce((v: any) => {
      callback(v);
    }, delay),
    [delay, ...dependencies],
  );

  useEffect(() => {
    return () => {
      debouncedCallback.cancel();
    };
  }, [debouncedCallback]);

  return debouncedCallback;
};
