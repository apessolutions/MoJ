/* eslint-disable @nx/enforce-module-boundaries */
import { zodResolver } from '@hookform/resolvers/zod';

import LoadingButton from '@mui/lab/LoadingButton';
import { Chip } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

import {
  Form as FormProvider,
  RHFAutocomplete,
  RHFTextField,
} from 'src/components/hook-form';

import { useResponsive } from 'src/hooks/use-responsive';
import { useRouter } from 'src/routes/hooks';

import { paths } from 'src/routes/paths';

import { CampaignDto } from '../../../../../libs/contract/src';
import { z } from 'zod';
import { GenderEnum } from '../../../../../libs/common/src/lib/enums/gender.enum';
import { useCreateCampaignMutation } from 'src/api/hooks/campaign';
import { toast } from 'sonner';
import { sentenceCase } from 'src/utils/change-case';
import { getServerError } from 'src/utils/axios';

// ----------------------------------------------------------------------
const formSchema = z.object({
  title: z.string().nonempty(),
  message: z.string().nonempty(),
  minAge: z.number().nullable(),
  maxAge: z.number().nullable(),
  gender: z.array(z.nativeEnum(GenderEnum)),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {};
const currentTime = new Date();
currentTime.setMinutes(0);

export default function CampaignsNewEditForm({}: Props) {
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');

  const defaultValues = useMemo<FormValues>(
    () => ({
      title: '',
      message: '',
      gender: [],
      minAge: null,
      maxAge: null,
    }),
    []
  );

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = methods;

  const { mutateAsync: createCampaign } = useCreateCampaignMutation();

  const onSubmit = handleSubmit(
    async ({ gender, maxAge, message, minAge, title }) => {
      const data = {
        title,
        message,
        gender,
        minAge: minAge || null,
        maxAge: maxAge || null,
      };
      try {
        await createCampaign(data);
        router.push(paths.dashboard.campaign.list);
      } catch (error) {
        toast.error(error.message || 'An Error Occurred');
        getServerError(error, setError);
      }
    }
  );

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Details
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Title, Message, Age...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Box
            columnGap={2}
            rowGap={3}
            p={3}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              md: 'repeat(1, 1fr)',
            }}
          >
            <RHFTextField name="title" label="Title" />
            <RHFTextField name="message" label="Message" multiline rows={4} />
            <RHFTextField name="minAge" label="Min Age" type="number" />
            <RHFTextField name="maxAge" label="Max Age" type="number" />
            <RHFAutocomplete
              label="Gender"
              name="gender"
              isOptionEqualToValue={(option, value) => option === value}
              multiple
              disableCloseOnSelect
              options={Object.values(GenderEnum)}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {sentenceCase(option)}
                </li>
              )}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={sentenceCase(option)}
                    size="small"
                    color="info"
                    variant="soft"
                  />
                ))
              }
            />
          </Box>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', justifyContent: 'right' }}>
        <LoadingButton
          type="submit"
          variant="contained"
          size="medium"
          color="primary"
          loading={isSubmitting}
        >
          Create Campaign
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}
        {renderActions}
      </Grid>
    </FormProvider>
  );
}
