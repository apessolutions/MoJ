import type { SxProps, SelectChangeEvent } from '@mui/material';

import { useCallback } from 'react';

import { Select, Checkbox, MenuItem, InputLabel, FormControl, OutlinedInput } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

export type TableSelectFilterProps<T extends { id: number }> = {
  data: T[];
  filter: { id: number }[];
  renderValue: (values: T[]) => React.ReactNode;
  render: (item: T) => React.ReactNode;
  setFilter: (filter: T[]) => void;
  title: string;
  sx?: SxProps;
};
export const TableSelectFilter = <T extends { id: number }>({
  data,
  title,
  filter,
  setFilter,
  render,
  renderValue,
  sx,
}: TableSelectFilterProps<T>) => {
  const select = useBoolean();
  const handleChange = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      const {
        target: { value },
      } = event;

      const isString = typeof value === 'string';
      if (isString) {
        const item = data.find((d) => String(d.id) === value);
        if (item) {
          setFilter([item]);
        }
      } else {
        const items = data.filter((i) => value.includes(String(i.id)));
        setFilter(items);
      }
    },
    [data, setFilter]
  );

  const handleClose = useCallback(() => {
    select.onFalse();
  }, [select]);

  return (
    <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 }, ...sx }}>
      <InputLabel htmlFor={title}>{title}</InputLabel>

      <Select
        multiple
        value={filter.map((v) => String(v.id))}
        open={select.value}
        onOpen={select.onTrue}
        onClose={handleClose}
        input={<OutlinedInput label={title} />}
        onChange={handleChange}
        renderValue={(values) =>
          renderValue(
            values.map((v) => data.find((d) => String(d.id) === v)).filter(Boolean) as T[]
          )
        }
        inputProps={{ id: title }}
        sx={{ textTransform: 'capitalize' }}
      >
        {data.map((option, index) => (
          <MenuItem key={index} value={String(option.id)}>
            <Checkbox disableRipple size="small" checked={filter.some((f) => f.id === option.id)} />
            {render(option)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
