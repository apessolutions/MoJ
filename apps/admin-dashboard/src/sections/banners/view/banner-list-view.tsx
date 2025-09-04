import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { useCallback } from 'react';
import { toast } from 'sonner';
import {
  useDeleteBannerMutation,
  useGetBannersQuery,
} from 'src/api/hooks/banner';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { EmptyContent } from 'src/components/empty-content';
import { Iconify } from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import BannerCard from '../banner-card';
import { BannerItemSkeleton } from '../banner-skeleton';
import { PermissionGuard } from 'src/components/guard/permission-guard';
import { BannerPermission } from '../../../../../../libs/role/src/lib/types/permission-type.type';
import { SortableGrid } from '../sortable-grid';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function BannerListView() {
  const router = useRouter();
  const { mutateAsync: deleteBanner } = useDeleteBannerMutation();
  const { data, isPending } = useGetBannersQuery();

  const banners = data?.data || [];

  const bannersEmpty = banners.length === 0;

  const handleEditRow = useCallback(
    (id: number) => {
      router.push(paths.dashboard.banner.edit(id));
    },
    [router]
  );
  const handleDeleteRow = useCallback(
    (id: number) => {
      try {
        deleteBanner(id);
      } catch (error) {
        toast.error(error?.message || 'Error deleting banner');
      }
    },
    [deleteBanner]
  );

  const renderSkeleton = (
    <>
      {[...Array(9)].map((_, index) => (
        <BannerItemSkeleton key={index} />
      ))}
    </>
  );
  return (
    <Container maxWidth={'lg'}>
      <CustomBreadcrumbs
        heading="Banner List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Banners',
            href: paths.dashboard.banner.list,
          },
        ]}
        action={
          <PermissionGuard requiredPermission={BannerPermission.ADD}>
            <Button
              component={RouterLink}
              href={paths.dashboard.banner.new}
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Banner
            </Button>
          </PermissionGuard>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {isPending && (
        <Box
          gap={5}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3 , 2fr)',
          }}
        >
          {renderSkeleton}
        </Box>
      )}

      {banners.length > 0 && (
        <SortableGrid
          banners={banners}
          handleDeleteRow={handleDeleteRow}
          handleEditRow={handleEditRow}
        />
      )}

      {bannersEmpty && !isPending && <EmptyContent title="No Banners Found" />}
    </Container>
  );
}

// ----------------------------------------------------------------------
