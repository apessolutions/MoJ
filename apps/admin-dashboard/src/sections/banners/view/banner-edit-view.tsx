import Container from '@mui/material/Container';
import { useGetBannerQuery } from 'src/api/hooks/banner';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { LoadingScreen } from 'src/components/loading-screen';
import { paths } from 'src/routes/paths';

import BannersNewEditForm from '../banner-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function BannerEditView({ id }: Props) {
  const { data, isPending } = useGetBannerQuery(+id);

  const banner = data?.data;

  return (
    <Container maxWidth={'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Banners',
            href: paths.dashboard.banner.list,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {isPending && <LoadingScreen />}
      {banner && <BannersNewEditForm currentBanner={banner} />}
    </Container>
  );
}
