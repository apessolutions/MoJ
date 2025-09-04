import { zodResolver } from '@hookform/resolvers/zod';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useUpdateAdminMutation } from 'src/api/hooks/admins';
import { useGetMeQuery } from 'src/api/hooks/auth';
import { Form, RHFSwitch, RHFTextField } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';
import { z as zod } from 'zod';

export default function AccountGeneral() {
  const { data: { data: admin } = {} } = useGetMeQuery();
  const { mutateAsync: updateAdmin } = useUpdateAdminMutation(admin?.id);

  const UpdateUserSchema = zod.object({
    email: zod
      .string()
      .min(1, { message: 'Email is required' })
      .email('Please enter a valid email address'),
    firstName: zod.string().min(3, { message: 'First Name is required' }),
    lastName: zod.string().min(3, { message: 'Last Name is required' }),
    status: zod.boolean().optional(),
  });

  const defaultValues = useMemo(
    () => ({
      email: admin?.email || '',
      firstName: admin?.firstName || '',
      lastName: admin?.lastName || '',
      status: admin?.status || false,
    }),
    [admin]
  );

  const methods = useForm({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (admin) {
      reset(defaultValues);
    }
  }, [admin, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (admin?.id) {
        await updateAdmin(data);
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      const errorMessage = error.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
      setError('root', {
        type: 'manual',
        message: errorMessage,
      });
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Card>
            <Stack spacing={3} sx={{ p: 2 }}>
              <Box
                columnGap={2}
                rowGap={3}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  md: 'repeat(2, 1fr)',
                }}
              >
                <RHFTextField name="firstName" label="First Name" />
                <RHFTextField name="lastName" label="Last Name" />
                <RHFTextField name="email" label="Email" />
                <RHFSwitch name="status" label="Active" />
              </Box>
            </Stack>
          </Card>
          <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton
              color="primary"
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Save Changes
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </Form>
  );
}
