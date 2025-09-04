
import { useGetUsersList } from "src/api/core"

import { RHFAutocompleteID } from "./rhf-autocomplete-id";

type Props = {
  name: string;
  label: string;
}

export default function RhfUsersAutocomplete({ name, label }: Props) {
  const { users, usersLoading } = useGetUsersList()

  return (
    <RHFAutocompleteID
      freeSolo
      name={name}
      label={label}
      options={usersLoading ? [] : users}
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


