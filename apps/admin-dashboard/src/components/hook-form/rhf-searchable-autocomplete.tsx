import { Controller, useFormContext } from 'react-hook-form';

import { SearchableAutocomplete } from '../searchable-autocomplete';

import type { SearchableAutocompleteProps } from '../searchable-autocomplete';

export type RHFSearchableAutocompleteProps<T> = Omit<SearchableAutocompleteProps<T>, 'error'> & {
  name: string;
};
export const RHFSearchableAutocomplete = <T,>({
  isFetching,
  data,
  value,
  label,
  placeholder,
  required,
  sx,
  name,
  setSearch,
  getOptionLabel,
  onChange,
  renderOption,
  disabled,
  multiple,
}: RHFSearchableAutocompleteProps<T>) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <SearchableAutocomplete
          error={error?.message}
          isFetching={isFetching}
          data={data}
          disabled={disabled}
          value={value}
          label={label}
          placeholder={placeholder}
          required={required}
          sx={sx}
          setSearch={setSearch}
          multiple={multiple}
          getOptionLabel={getOptionLabel as any}
          onChange={onChange as any}
          renderOption={renderOption as any}
        />
      )}
    />
  );
};
