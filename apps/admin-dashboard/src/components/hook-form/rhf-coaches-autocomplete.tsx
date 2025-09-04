
import { useGetCoachesList } from "src/api/core"

import { RHFAutocompleteID } from "./rhf-autocomplete-id";

type Props = {
  name: string;
  label: string
}
export default function RHFCoachesAutocomplete({ name, label }: Props) {
  const { coaches, coachesLoading } = useGetCoachesList()

  return (
    <RHFAutocompleteID
      freeSolo
      name={name}
      label={label}
      options={coachesLoading ? [] : coaches}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.id === value}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          {option.name}
        </li>
      )}
    />
  )
}

