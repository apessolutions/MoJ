/* eslint-disable @nx/enforce-module-boundaries */
import { Card, Tab, Tabs } from '@mui/material';
import { Box } from '@mui/material';
import { USER_PROFILE_TABS, UserProfileTab } from 'src/constants/user-profile';
import { useTabs } from 'src/hooks/use-tabs';

import { UserDto } from '../../../../../libs/contract/src/lib/admin/v1/user/user.dto';

import { UserProfileCover } from './profile/coach-profile-cover';

export type UserProfileProps = {
  user: UserDto;
};

export const UserProfile = ({ user }: UserProfileProps) => {
  const tabs = useTabs<UserProfileTab>('profile');
  return (
    <Card sx={{ mb: 3, height: 290 }}>
      <UserProfileCover user={user} />
      <Box
        display="flex"
        justifyContent={{ xs: 'center', md: 'flex-end' }}
        sx={{
          width: 1,
          bottom: 0,
          zIndex: 9,
          px: { md: 3 },
          position: 'absolute',
          bgcolor: 'background.paper',
        }}
      >
        <Tabs value={tabs.value} onChange={tabs.onChange}>
          {USER_PROFILE_TABS.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              icon={tab.icon}
              label={tab.label}
            />
          ))}
        </Tabs>
      </Box>
    </Card>
  );
};
