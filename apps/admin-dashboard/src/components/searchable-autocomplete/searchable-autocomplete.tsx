import type { SxProps } from '@mui/material';

import React from 'react';

import { Box, TextField, Autocomplete } from '@mui/material';

export type SearchableAutocompleteProps<T> = {
  isFetching: boolean;
  data: T[];
  value?: T | T[] | null;
  required?: boolean;
  label?: string;
  placeholder?: string;
  error?: string;
  sx?: SxProps;
  disabled?: boolean;
  multiple?: boolean;
  setSearch: (value: string) => void;
  getOptionLabel: (option: T) => string;
  onChange: (value: T | T[] | null) => void;
  renderOption: (option: T) => JSX.Element;
};

export const SearchableAutocomplete = <T,>({
  isFetching,
  data,
  value,
  label,
  placeholder,
  required,
  error,
  sx,
  multiple,
  disabled,
  setSearch,
  getOptionLabel,
  onChange,
  renderOption,
}: SearchableAutocompleteProps<T>) => (
  <Autocomplete
    fullWidth
    id={label}
    disablePortal
    loading={isFetching}
    options={data}
    value={value || null}
    multiple={multiple}
    disabled={disabled}
    onInputChange={(_, search, reason) => {
      if (reason === 'reset') return;
      setSearch(search);
    }}
    getOptionLabel={getOptionLabel}
    isOptionEqualToValue={(option, item) => (option as any)?.id === (item as any)?.id}
    onChange={(_, search) => {
      onChange(search);
    }}
    renderOption={(props, option) => (
      <Box component="li" {...props} key={(option as any)?.id}>
        {renderOption(option)}
      </Box>
    )}
    renderInput={(params) => (
      <TextField
        {...params}
        sx={sx}
        required={required}
        label={label}
        placeholder={placeholder}
        error={!!error}
        helperText={error}
        inputProps={{
          ...params.inputProps,
          autoComplete: 'new-password',
        }}
      />
    )}
  />
);
