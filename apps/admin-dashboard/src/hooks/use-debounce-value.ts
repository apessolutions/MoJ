import { useMemo, useState } from 'react';

import { useDebounce } from './use-debounce';

export const useDebounceValue = (initialValue: string, delay: number) => {
  const [value, setValue] = useState(initialValue);
  const debouncedValue = useDebounce(value, delay);
  const memoizedValue = useMemo(() => [debouncedValue, setValue] as const, [debouncedValue]);
  return memoizedValue;
};
