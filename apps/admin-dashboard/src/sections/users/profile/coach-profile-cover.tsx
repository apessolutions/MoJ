/* eslint-disable @nx/enforce-module-boundaries */
import { Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { FALLBACK_PROFILE_COVER } from 'src/constants/cover';
import { bgGradient, varAlpha } from 'src/theme/styles';
import { getInitials } from 'src/utils/string';

import { UserDto } from '../../../../../../libs/contract/src/lib/admin/v1/user/user.dto';

export type UserProfileCoverProps = {
  user: UserDto;
};

export function UserProfileCover({ user }: UserProfileCoverProps) {
  const theme = useTheme();

  const profileImage = user.photo || FALLBACK_PROFILE_COVER;

  return (
    <Box
      sx={{
        ...bgGradient({
          color: `0deg, ${varAlpha(
            theme.vars.palette.primary.darkerChannel,
            0.8
          )}, ${varAlpha(theme.vars.palette.primary.darkerChannel, 0.8)}`,
          imgUrl: FALLBACK_PROFILE_COVER,
        }),
        height: 1,
        color: 'common.white',
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        sx={{
          left: { md: 24 },
          bottom: { md: 24 },
          zIndex: { md: 10 },
          pt: { xs: 6, md: 0 },
          position: { md: 'absolute' },
        }}
      >
        <Avatar
          alt={user.firstName}
          src={profileImage}
          sx={{
            mx: 'auto',
            width: { xs: 64, md: 128 },
            height: { xs: 64, md: 128 },
            border: `solid 2px ${theme.vars.palette.common.white}`,
          }}
        >
          {getInitials(user.firstName)}
        </Avatar>

        <ListItemText
          sx={{
            mt: 2,
            ml: { md: 3 },
            textAlign: { xs: 'center', md: 'unset' },
          }}
          primary={`${user.firstName} ${user.lastName}`}
          secondary={
            <Box display="flex" flexDirection="column">
              <Typography variant="body2">{user.email}</Typography>
            </Box>
          }
          primaryTypographyProps={{ typography: 'h4' }}
          secondaryTypographyProps={{
            mt: 0.5,
            color: 'inherit',
            component: 'span',
            typography: 'body2',
            sx: { opacity: 0.48 },
          }}
        />
      </Stack>
    </Box>
  );
}
