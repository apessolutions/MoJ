import { useMemo, useState, useCallback } from 'react';

// ----------------------------------------------------------------------

export type UseTabsReturn<T extends string> = {
  value: T;
  setValue: React.Dispatch<React.SetStateAction<T>>;
  onChange: (event: React.SyntheticEvent, newValue: T) => void;
};

export const useTabs = <T extends string>(defaultValue: T): UseTabsReturn<T> => {
  const [value, setValue] = useState(defaultValue);

  const onChange = useCallback((event: React.SyntheticEvent, newValue: T) => {
    setValue(newValue);
  }, []);

  const memoizedValue = useMemo(() => ({ value, setValue, onChange }), [onChange, value]);

  return memoizedValue;
};
