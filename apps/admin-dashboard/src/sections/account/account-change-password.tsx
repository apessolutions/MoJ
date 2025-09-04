import { zodResolver } from '@hookform/resolvers/zod';
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import { useForm } from 'react-hook-form';
import { useChangePasswordMutation } from 'src/api/hooks/auth';
import { Form, RHFTextField } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { toast } from 'src/components/snackbar';
import { useBoolean } from 'src/hooks/use-boolean';
import { getServerError } from 'src/utils/axios';
import { z as zod } from 'zod';

// ----------------------------------------------------------------------

export default function AccountChangePassword() {
  const old_password = useBoolean();
  const new_password = useBoolean();
  const new_password_confirmation = useBoolean();
  const { mutateAsync: changePassword } = useChangePasswordMutation();
  const ChangePassWordSchema = zod
    .object({
      old_password: zod.string().min(1, { message: 'Please Enter Old password' }),
      new_password: zod
        .string()
        .min(1, { message: 'New password is required' })
        .min(8, { message: 'Password must be at least 8 characters long' })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\x20-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]).+$/, {
          message: 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character',
        }),
      new_password_confirmation: zod
        .string()
        .min(1, { message: 'Please confirm your new password' }),
    })
    .refine((data) => data.new_password === data.new_password_confirmation, {
      path: ['new_password_confirmation'],
      message: 'Passwords do not match',
    })
    .refine((data) => data.new_password !== data.old_password, {
      path: ['new_password'],
      message: 'New password must be different from the old password',
    });

  const defaultValues = {
    old_password: '',
    new_password: '',
    new_password_confirmation: '',
  };

  const methods = useForm({
    resolver: zodResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = methods;


  const onSubmit = handleSubmit(async (data) => {
    try {
      await changePassword(data);
      toast.success('Password changed successfully');
      reset();
    } catch (error) {
      getServerError(error, setError);
      toast.error('Failed to change password');
    }
  });


  return (
    <Form methods={methods} onSubmit={onSubmit} >
      <Stack
        component={Card}
        spacing={3}
        sx={{ p: 3 }}
      >

        <RHFTextField
          name="old_password"
          type={old_password.value ? 'text' : 'password'}
          label="Old Password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={old_password.onToggle} edge="end">
                  <Iconify icon={old_password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <RHFTextField
          name="new_password"
          label="New Password"
          type={new_password.value ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={new_password.onToggle} edge="end">
                  <Iconify icon={new_password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <RHFTextField
          name="new_password_confirmation"
          type={new_password_confirmation.value ? 'text' : 'password'}
          label="Confirm New Password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={new_password_confirmation.onToggle} edge="end">
                  <Iconify
                    icon={
                      new_password_confirmation.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'
                    }
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
        <LoadingButton color="primary" type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 'auto' }}>
          Save Changes
        </LoadingButton>
      </Stack>
    </Form>
  );
}
