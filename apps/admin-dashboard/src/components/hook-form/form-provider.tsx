import type { SxProps } from '@mui/material';
import { Box } from '@mui/material';
import type { UseFormReturn } from 'react-hook-form';
import { FormProvider as RHFForm } from 'react-hook-form';

// ----------------------------------------------------------------------

export type FormProps = {
  onSubmit?: () => void;
  children: React.ReactNode;
  methods: UseFormReturn<any>;
  sx?: SxProps;
};

export function Form({ children, onSubmit, methods, sx }: FormProps) {
  return (
    <RHFForm {...methods}>
      <Box
        component="form"
        onSubmit={onSubmit}
        noValidate
        autoComplete="off"
        sx={sx}
      >
        {children}
      </Box>
    </RHFForm>
  );
}
