import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Stack, { StackProps } from '@mui/material/Stack';

// ----------------------------------------------------------------------

type BannerItemSkeletonProps = StackProps;

export function BannerItemSkeleton({ sx, ...other }: BannerItemSkeletonProps) {
  return (
    <Stack
      component={Paper}
      direction="row"
      variant="outlined"
      sx={{
        borderRadius: 2,
        ...sx,
      }}
      {...other}
    >
      <Stack spacing={2} flexGrow={1} mb={1}>
        <Skeleton sx={{ width: 1, height: 250 }} />
        <Skeleton sx={{ width: `calc(100% - 40px)`, height: 20, mx: 1 }} />
        <Skeleton sx={{ width: `calc(100% - 60px)`, height: 20, mx: 1 }} />
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------
