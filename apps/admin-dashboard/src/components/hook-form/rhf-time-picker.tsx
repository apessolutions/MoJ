import type { Dayjs } from 'dayjs';
import type { TextFieldProps } from '@mui/material/TextField';
import type { TimePickerProps } from '@mui/x-date-pickers/TimePicker';

import dayjs from 'dayjs';
import { Controller, useFormContext } from 'react-hook-form';

import { TimePicker } from '@mui/x-date-pickers/TimePicker';

// ----------------------------------------------------------------------
interface RHFTimePickerProps extends TimePickerProps<Dayjs> {
  name: string;
}

export function RHFTimePicker({ name, slotProps, ...other }: RHFTimePickerProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TimePicker
          {...field}
          value={dayjs(field.value)}
          onChange={(newValue) => field.onChange(dayjs(newValue).format())}
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!error,
              helperText: error?.message ?? (slotProps?.textField as TextFieldProps)?.helperText,
              ...slotProps?.textField,
            },
            ...slotProps,
          }}
          {...other}
        />
      )}
    />
  );
}
