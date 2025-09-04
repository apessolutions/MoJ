import type { AutocompleteProps } from '@mui/material/Autocomplete';

import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export type AutocompleteBaseProps = Omit<
  AutocompleteProps<any, boolean, boolean, boolean>,
  'renderInput'
>;

export type RHFAutocompleteProps = AutocompleteBaseProps & {
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  hiddenLabel?: boolean;
  helperText?: React.ReactNode;
  options: Array<{ id: string | number;[key: string]: any }>;
};

export function RHFAutocompleteID({
  required,
  name,
  label,
  helperText,
  hiddenLabel,
  placeholder,
  options,
  ...other
}: RHFAutocompleteProps) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          {...field}
          id={`rhf-autocomplete-${name}`}
          options={options}
          onChange={(event, newValue) => {
            setValue(name, newValue ? newValue.id : null, { shouldValidate: true });
          }}
          value={options.find(option => option.id === field.value) || null}
          isOptionEqualToValue={(option, value) => {
            // If value is an object (initial load), compare ids
            if (typeof value === 'object' && value !== null) {
              return option.id === value.id;
            }
            // If value is a primitive (after selection), compare directly
            return option.id === value;
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              required={required}
              label={label}
              placeholder={placeholder}
              error={!!error}
              helperText={error ? error?.message : helperText}
              inputProps={{
                ...params.inputProps,
                autoComplete: 'new-password',
              }}
            />
          )}
          {...other}
        />
      )}
    />
  );
}


