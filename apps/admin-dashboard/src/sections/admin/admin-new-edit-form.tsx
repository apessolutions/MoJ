/* eslint-disable @nx/enforce-module-boundaries */
import { zodResolver } from '@hookform/resolvers/zod';
import LoadingButton from '@mui/lab/LoadingButton';
import { IconButton, InputAdornment } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import {
  useCreateAdminMutation,
  useUpdateAdminMutation,
} from 'src/api/hooks/admins';
import { useGetRolesListQuery } from 'src/api/hooks/roles';
import { Form, RHFTextField } from 'src/components/hook-form';
import { RHFMultiSelect } from 'src/components/hook-form/rhf-select';
import { RHFSwitch } from 'src/components/hook-form/rhf-switch';
import { Iconify } from 'src/components/iconify';
import { toast } from 'src/components/snackbar';
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { getServerError } from 'src/utils/axios';
import { z as zod } from 'zod';

import { AdminDto } from '../../../../../libs/contract/src/lib/admin/v1/admin/admin.dto';

type Props = {
  currentAdmin?: AdminDto | null;
};

const formSchema = zod.object({
  firstName: zod.string().min(1, {
    message: 'Please enter a first name.',
  }),
  lastName: zod.string().min(1, {
    message: 'Please enter a last name.',
  }),
  email: zod.string().email(),
  password: zod
    .string()
    .min(8)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\x20-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]).+$/,
      {
        message:
          'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character',
      }
    )
    .or(zod.literal('')),
  password_confirmation: zod.string().min(8).or(zod.literal('')),
  isSuper: zod.boolean().default(false),
  roleIds: zod.array(zod.number()),
  status: zod.boolean().default(true),
});

type FormValues = zod.infer<typeof formSchema>;

export default function AdminsNewEditForm({ currentAdmin }: Props) {
  const mdUp = useResponsive('up', 'md');
  const password = useBoolean();
  const password_confirmation = useBoolean();
  const { data } = useGetRolesListQuery();
  // roles, rolesLoading
  const router = useRouter();

  const defaultValues = useMemo<FormValues>(
    () => ({
      email: currentAdmin?.email || '',
      password: '',
      password_confirmation: '',
      firstName: currentAdmin?.firstName || '',
      lastName: currentAdmin?.lastName || '',
      isSuper: currentAdmin?.isSuper || false,
      roleIds: currentAdmin?.roles.map((role) => role.id) || [],
      status: currentAdmin?.status || true,
    }),
    [currentAdmin]
  );

  const adminFormSchema = formSchema
    .refine(
      (data) => {
        if (currentAdmin) return true;
        return (
          data.password === data.password_confirmation && data.password !== ''
        );
      },
      {
        path: ['password_confirmation'],
        message: 'Passwords do not match.',
      }
    )
    .refine(
      (data) => {
        if (currentAdmin) return true;
        return data.password.length > 0;
      },
      {
        path: ['password'],
        message: 'Please enter a password.',
      }
    );

  const methods = useForm<FormValues>({
    resolver: zodResolver(adminFormSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = methods;

  const { mutateAsync: createAdmin } = useCreateAdminMutation();
  const { mutateAsync: updateAdmin } = useUpdateAdminMutation(currentAdmin?.id);

  const onSubmit = handleSubmit(async (data) => {
    const { password, password_confirmation, ...rest } = data;
    try {
      if (currentAdmin) {
        await updateAdmin(rest);
        toast.success('Changes saved.');
      } else {
        await createAdmin(data);
        toast.success('Admin created.');
      }
      router.push(paths.dashboard.admins.list);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
      getServerError(error, setError);
    }
  });

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Admin Details
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Fill in the details of the admin.
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Admin Details" />}

          <Box
            columnGap={2}
            rowGap={3}
            p={3}
            alignItems="center"
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              md: 'repeat(2, 1fr)',
            }}
          >
            <RHFTextField required name="firstName" label="First Name" />
            <RHFTextField required name="lastName" label="Last Name" />
            <RHFTextField required name="email" label="Email" />

            <RHFMultiSelect
              options={(data?.data || []).map((option) => ({
                label: option.title,
                value: option.id,
              }))}
              required
              name="roleIds"
              label="Roles"
            />
            {!currentAdmin && (
              <>
                <RHFTextField
                  required
                  name="password"
                  label="Password"
                  type={password.value ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={password.onToggle} edge="end">
                          <Iconify
                            icon={
                              password.value
                                ? 'solar:eye-bold'
                                : 'solar:eye-closed-bold'
                            }
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <RHFTextField
                  required
                  name="password_confirmation"
                  label="Confirm Password"
                  type={password_confirmation.value ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={password_confirmation.onToggle}
                          edge="end"
                        >
                          <Iconify
                            icon={
                              password_confirmation.value
                                ? 'solar:eye-bold'
                                : 'solar:eye-closed-bold'
                            }
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </>
            )}

            <RHFSwitch label="Super Admin" name="isSuper" />
          </Box>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid
        xs={12}
        md={8}
        sx={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <RHFSwitch name="status" label="Active" />
        <LoadingButton
          color="primary"
          type="submit"
          variant="contained"
          size="medium"
          loading={isSubmitting}
        >
          {!currentAdmin ? 'Create Admin' : 'Save Changes'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}
        {renderActions}
      </Grid>
    </Form>
  );
}
