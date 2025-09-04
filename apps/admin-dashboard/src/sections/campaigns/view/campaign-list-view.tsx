import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import { toast } from 'sonner';
import {
  useDeleteCampaignMutation,
  useGetCampaignsQuery,
} from 'src/api/hooks/campaign';
import { usePagination } from 'src/auth/hooks/use-pagination';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { PermissionGuard } from 'src/components/guard/permission-guard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSkeleton,
  useTable,
} from 'src/components/table';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';

import CampaignTableRow from '../campaigns-table-row';
import { CampaignPermission } from '../../../../../../libs/role/src/lib/types/permission-type.type';
import { useCallback } from 'react';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'Title', label: 'Title', width: 100 },
  { id: 'Message', label: 'Message', width: 300 },
  { id: 'Gender', label: 'Gender', width: 50 },
  { id: 'minAge', label: 'Min. Age', width: 80 },
  { id: 'maxAge', label: 'Max. Age', width: 80 },
  { id: '', label: '', width: 80 },
];

// ----------------------------------------------------------------------

export function CampaignListView() {
  const table = useTable({ defaultOrderBy: 'id' });

  const { pageNumber, navigateToPage } = usePagination();

  const { mutate: deleteCampaign } = useDeleteCampaignMutation();
  const { data, isPending } = useGetCampaignsQuery({ page: pageNumber });

  const denseHeight = table.dense ? 60 : 80;

  const campaigns = data?.data.data || [];
  const pagination = data?.data;

  const notFound = campaigns.length === 0 && !isPending;

  const handleOnDeleteRow = useCallback((id: number) => {
    deleteCampaign(id, {
      onError(error) {
        toast.error(error.message);
      },
    });
  }, []);

  return (
    <Container maxWidth={'lg'}>
      <CustomBreadcrumbs
        heading="List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Campaigns List',
            href: paths.dashboard.campaign.list,
          },
        ]}
        action={
          <PermissionGuard requiredPermission={CampaignPermission.ADD}>
            <Button
              component={RouterLink}
              href={paths.dashboard.campaign.new}
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Campaign
            </Button>
          </PermissionGuard>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <Card>
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table
              size={table.dense ? 'small' : 'medium'}
              sx={{ minWidth: 960 }}
            >
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
              />

              <TableBody>
                {isPending ? (
                  [...Array(10)].map((i, index) => (
                    <TableSkeleton key={index} sx={{ height: denseHeight }} />
                  ))
                ) : (
                  <>
                    {campaigns.map((row, index) => (
                      <CampaignTableRow
                        key={index}
                        row={row}
                        onDeleteRow={() => handleOnDeleteRow(row.id)}
                      />
                    ))}
                  </>
                )}

                {campaigns.length === 0 && <TableNoData notFound={notFound} />}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={pagination?.totalRecords || 0}
          page={(pagination?.page || 1) - 1}
          rowsPerPage={pagination?.take || 0}
          rowsPerPageOptions={[10]}
          onPageChange={(e, pageNumberTest) => {
            table.onChangePage(e, pageNumberTest);
            navigateToPage(pageNumberTest + 1);
          }}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>
    </Container>
  );
}
