/* eslint-disable @nx/enforce-module-boundaries */
import { zodResolver } from '@hookform/resolvers/zod';
import LoadingButton from '@mui/lab/LoadingButton';
import { Checkbox, FormControlLabel } from '@mui/material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
} from '@mui/material';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useGetPermissionsListQuery } from 'src/api/hooks/core';
import {
  useCreateRoleMutation,
  useUpdateRoleMutation,
} from 'src/api/hooks/roles';
import { Form, RHFTextField } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { toast } from 'src/components/snackbar';
import { useResponsive } from 'src/hooks/use-responsive';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { getServerError } from 'src/utils/axios';
import { z as zod } from 'zod';

import { RoleDto } from '../../../../../libs/contract/src/lib/admin/v1/role/role.dto';

// ----------------------------------------------------------------------

type Props = {
  currentRole?: RoleDto | null;
};

const formSchema = zod.object({
  title: zod
    .string({
      required_error: 'Please Enter Role Title',
    })
    .min(1, {
      message: 'Title is Required',
    }),
  description: zod.string().optional(),
  permissions: zod.array(zod.string()),
});

type FormValues = zod.infer<typeof formSchema>;

export default function RoleNewEditForm({ currentRole }: Props) {
  const mdUp = useResponsive('up', 'md');
  const router = useRouter();

  const { data } = useGetPermissionsListQuery();

  const permissions = data?.data || [];

  const defaultValues = useMemo<FormValues>(
    () => ({
      title: currentRole?.title || '',
      description: currentRole?.description || '',
      permissions: currentRole?.permissions || [],
    }),
    [currentRole]
  );

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    setError,
    watch,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const selectedPermissions = watch('permissions');

  const addPermission = (permission: string) => {
    const permissions = new Set(selectedPermissions);
    permissions.add(permission);
    setValue('permissions', Array.from(permissions));
  };

  const removePermission = (permission: string) => {
    const permissions = new Set(selectedPermissions);
    permissions.delete(permission);
    setValue('permissions', Array.from(permissions));
  };

  const isChecked = (permission: string) => {
    return selectedPermissions.includes(permission);
  };

  useEffect(() => {
    if (currentRole) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRole, reset]);

  const { mutateAsync: createRole } = useCreateRoleMutation();
  const { mutateAsync: updateRole } = useUpdateRoleMutation(currentRole?.id);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentRole) {
        await updateRole(data);
        toast.success('Role updated successfully');
      } else {
        await createRole(data);
        toast.success('Role created successfully');
      }
      router.push(paths.dashboard.roles.list);
    } catch (error) {
      console.error(error);
      getServerError(error, setError);
      toast.error('An error occurred while processing your request');
    }
  });

  const renderDetails = (
    <>
      {mdUp && (
        <Grid item md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Details
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            title, description, permissions...
          </Typography>
        </Grid>
      )}

      <Grid item xs={12} md={8} sx={{ mb: 3 }}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}
          <Stack spacing={3} sx={{ p: 2 }}>
            <RHFTextField required label="Title" name="title" />
            <RHFTextField
              rows={4}
              multiline
              label="Description"
              name="description"
            />

            {permissions.map(
              (permission, index) =>
                permission.permissions.length > 0 && (
                  <Accordion key={index}>
                    <AccordionSummary
                      expandIcon={
                        <Iconify icon="eva:arrow-ios-downward-fill" />
                      }
                    >
                      <Typography
                        variant="subtitle1"
                        textTransform="capitalize"
                      >
                        {permission.name}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        {permission.permissions.map(({ label, permission }) => (
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            key={`${label}-${permission}`}
                          >
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={isChecked(permission)}
                                  onClick={
                                    isChecked(permission)
                                      ? () => removePermission(permission)
                                      : () => addPermission(permission)
                                  }
                                />
                              }
                              label={label}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                )
            )}
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid item md={4} />}
      <Grid
        item
        xs={12}
        md={8}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          p: 2,
        }}
      >
        <LoadingButton
          color="primary"
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
        >
          {!currentRole ? 'Create Role' : 'Save Changes'}
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
