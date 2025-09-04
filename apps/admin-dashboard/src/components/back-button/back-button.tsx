import type { LinkProps } from 'react-router-dom';
import type { SxProps, ButtonProps } from '@mui/material';

import { Stack, Button, IconButton, Typography } from '@mui/material';

import { RouterLink } from 'src/routes/components';

import { Iconify } from '../iconify';

export type BackButtonProps = {
  backLink: LinkProps['to'];
  state?: LinkProps['state'];
  title: string;
  sx?: SxProps;
  actions?: { label: string; action: () => void; props?: ButtonProps }[];
};
export const BackButton = ({ backLink, title, sx, actions, state }: BackButtonProps) => (
  <Stack
    spacing={3}
    direction={{ xs: 'column', md: 'row' }}
    justifyContent="space-between"
    sx={{
      mb: { xs: 3, md: 5 },
      ...sx,
    }}
  >
    <Stack spacing={1} direction="row" alignItems="flex-start">
      <IconButton
        sx={{ backgroundColor: (theme) => theme.palette.background.neutral }}
        component={RouterLink}
        href={backLink}
        state={state}
      >
        <Iconify icon="eva:arrow-ios-back-fill" />
      </IconButton>

      <Stack spacing={0.5}>
        <Stack spacing={1} direction="row" alignItems="center">
          <Typography variant="h4"> {title} </Typography>
        </Stack>
      </Stack>
    </Stack>
    <Stack spacing={1} direction="row" alignItems="flex-start">
      {actions?.map((action, index) => (
        <Button key={index} onClick={action.action} {...action.props}>
          {action.label}
        </Button>
      ))}
    </Stack>
  </Stack>
);
