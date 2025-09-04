import type { SyntheticEvent } from 'react';
import type { ICountry } from 'src/types/core';

import { useFormContext } from 'react-hook-form';

import { useGetCountries } from 'src/api/core';

import { Iconify } from 'src/components/iconify';
import { RHFAutocomplete } from 'src/components/hook-form/rhf-autocomplete';

type Props = {
  required: boolean;
  name: string;
  text: string;
};

export default function RHFCountryAutocomplete({ required, name, text }: Props) {
  const { setValue } = useFormContext();
  const { countries, countriesLoading } = useGetCountries();
  return (
    <RHFAutocomplete
      required={required}
      name={name}
      label={text}
      options={countriesLoading ? [] : countries.map((c) => c)}
      getOptionLabel={(option: string | ICountry) => {
        if (typeof option === 'string') return option;
        return option.name;
      }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={(event: SyntheticEvent<Element, Event>, value) => {
        setValue(name, value as ICountry, { shouldValidate: true });
      }}
      renderOption={(props, option) => {
        const { code, name: n } = countries.filter((c) => c.id === option.id)[0];
        return (
          <li {...props} key={code}>
            <Iconify
              key={code}
              icon={`circle-flags:${code.toLowerCase()}`}
              width={28}
              sx={{ mr: 1 }}
            />
            {n}
          </li>
        );
      }}
    />
  );
}
