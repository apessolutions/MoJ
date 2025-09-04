import { zodResolver } from '@hookform/resolvers/zod';
import LoadingButton from '@mui/lab/LoadingButton';
import { MenuItem } from '@mui/material';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  useCreateBannerMutation,
  useUpdateBannerMutation,
} from 'src/api/hooks/banner';
import { useUploadFileMutation } from 'src/api/hooks/upload';
import {
  Form,
  RHFDatePicker,
  RHFSelect,
  RHFTextField,
} from 'src/components/hook-form';
import { Upload } from 'src/components/upload';
import { useResponsive } from 'src/hooks/use-responsive';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { BannerInternalType, BannerType, IBanner } from 'src/types/banner';
import { getServerError } from 'src/utils/axios';
import { z } from 'zod';

import { CreateBannerDto } from '../../../../../libs/contract/src/lib/admin/v1/banner/create-banner.dto';
import { UpdateBannerDto } from '../../../../../libs/contract/src/lib/admin/v1/banner/update-banner.dto';
// ----------------------------------------------------------------------

type Props = {
  currentBanner?: IBanner;
};

const formSchema = z
  .object({
    title: z.string().nonempty().max(255),
    type: z.nativeEnum(BannerType).default(BannerType.NONE),
    linkValue: z.string().default(''),
    internalType: z.nativeEnum(BannerInternalType).optional(),
    mediaId: z
      .number({
        message: 'Please upload a banner image',
      })
      .optional(),
    url: z
      .string({
        message: 'Please upload a banner image',
      })
      .nonempty({
        message: 'Please upload a banner image',
      }),
    media: z.instanceof(File).optional(),
    order: z.number().int().min(1),
    from: z.date().or(z.string().nonempty()).optional(),
    to: z.date().or(z.string().nonempty()).optional(),
  })
  .refine(
    (data) => {
      if (data.type === BannerType.EXTERNAL) {
        data.internalType = undefined;
        return z.string().url().safeParse(data.linkValue).success;
      }
      return true;
    },
    {
      message: 'Please enter a valid URL for external link',
      path: ['linkValue'],
    }
  )
  .refine(
    (data) => {
      if (data.type === BannerType.INTERNAL) {
        return z.string().url().safeParse(data.linkValue).success;
      }
      return true;
    },
    {
      message: 'Please enter a valid URL for internal link',
      path: ['linkValue'],
    }
  )
  .refine(
    (data) => {
      if (data.type === BannerType.INTERNAL && !data.internalType) {
        return false;
      }
      return true;
    },
    {
      message: 'internalType is required when type is INTERNAL',
    }
  )
  .refine((data) => {
    if (data.type === BannerType.NONE) {
      data.internalType = undefined;
      data.linkValue = '';
    }
    return true;
  });

export type FormValues = z.infer<typeof formSchema>;

export default function BannerNewEditForm({ currentBanner }: Props) {
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');
  const defaultValues = useMemo<Partial<FormValues>>(
    () => ({
      linkValue: currentBanner?.linkValue || '',
      type: currentBanner?.type || BannerType.NONE,
      mediaId: currentBanner?.media.id || undefined,
      url: currentBanner?.media.link || '',
      order: currentBanner?.order || 0,
      title: currentBanner?.title || '',
      internalType: currentBanner?.internalType || undefined,
      from: currentBanner?.from || undefined,
      to: currentBanner?.to || undefined,
    }),
    [currentBanner]
  );

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const {
    watch,
    setValue,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = methods;

  const values = watch();

  const { mutateAsync: uploadFile } = useUploadFileMutation();
  const { mutateAsync: createBanner } = useCreateBannerMutation();
  const { mutateAsync: updateBanner } = useUpdateBannerMutation(
    Number(currentBanner?.id)
  );
  const onSubmit = handleSubmit(async (data) => {
    // we need to upload files
    try {
      if (data.media) {
        const fileResponse = await uploadFile(data.media);
        data.mediaId = fileResponse.file.id;
      }

      if (!data.mediaId) return;

      // remove media and url from data
      const { media, url, ...rest } = data;

      if (currentBanner) {
        await updateBanner(rest as UpdateBannerDto);
        toast.success('Banner Updated Successfully');
      } else {
        await createBanner(rest as CreateBannerDto);
        toast.success('Banner Created Successfully');
      }
      router.push(paths.dashboard.banner.list);
    } catch (error) {
      toast.error(error.message || 'Something Went Wrong!');
      getServerError(error, setError);
    }
  });

  const handleDropLogoFile = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      setValue('url', URL.createObjectURL(file));
      setValue('media', file);
    },
    [setValue]
  );

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Details
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Fill in the details of the banner
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3, margin: 'auto' }}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">
                Banner Template
                <Typography component="span" sx={{ color: 'error.main' }}>
                  {' '}
                  *
                </Typography>
              </Typography>
              <Upload
                maxSize={3145728}
                value={values.url || null}
                accept={{
                  'image/*': ['.jpeg', '.jpg', '.png'],
                }}
                error={Boolean(errors.url?.message)}
                helperText={errors.url?.message?.toString()}
                onDrop={handleDropLogoFile}
                onDelete={() => {
                  setValue('url', '');
                  setValue('media', undefined);
                  setValue('mediaId', 0);
                }}
              />
            </Stack>

            <RHFTextField label="Title" name="title" required={true} />
            <RHFTextField
              label="Order"
              name="order"
              type="number"
              required={true}
            />
            <RHFSelect label="Type" name="type">
              <MenuItem value={BannerType.EXTERNAL}>External</MenuItem>
              <MenuItem value={BannerType.INTERNAL}>Internal</MenuItem>
              <MenuItem value={BannerType.NONE}>None</MenuItem>
            </RHFSelect>
            {values.type === BannerType.INTERNAL && (
              <RHFSelect label="Internal Type" name="internalType">
                <MenuItem value={BannerInternalType.EVENT}>Event</MenuItem>
              </RHFSelect>
            )}
            {(values.type === BannerType.EXTERNAL ||
              values.type === BannerType.INTERNAL) && (
              <RHFTextField
                label="Link Value"
                name="linkValue"
                required={true}
              />
            )}
            <Stack direction="row" spacing={2}>
              <RHFDatePicker label="From" name="from" />
              <RHFDatePicker label="To" name="to" />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', justifyContent: 'end' }}>
        <LoadingButton
          type="submit"
          variant="contained"
          color="primary"
          loading={isSubmitting}
        >
          {!currentBanner ? 'Create Banner' : 'Save Banner'}
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
