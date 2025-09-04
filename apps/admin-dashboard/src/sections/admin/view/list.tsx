import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import { useCallback } from 'react';
import {
  useDeleteAdminMutation,
  useGetAdminsQuery,
} from 'src/api/hooks/admins';
import { usePagination } from 'src/auth/hooks/use-pagination';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { PermissionGuard } from 'src/components/guard/permission-guard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { toast } from 'src/components/snackbar';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSkeleton,
  useTable,
} from 'src/components/table';
import { DashboardContent } from 'src/layouts/dashboard';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import AdminTableRow from '../admin-table-row';
import { AdminPermission } from '../../../../../../libs/role/src/lib/types/permission-type.type';

export default function AdminListView() {
  const table = useTable({ defaultOrderBy: 'orderNumber' });
  const denseHeight = table.dense ? 60 : 80;
  const router = useRouter();
  const { pageNumber, navigateToPage } = usePagination();

  const { data, isPending } = useGetAdminsQuery({ page: pageNumber });

  const adminsEmpty = data?.data.data.length === 0;
  const admins = data?.data.data || [];
  const pagination = data?.data;

  const handleEditRow = useCallback(
    (id: number) => {
      router.push(paths.dashboard.admins.edit(id));
    },
    [router]
  );

  const { mutateAsync: deleteAdmin } = useDeleteAdminMutation();

  const handleDeleteRow = useCallback(
    async (id: number) => {
      try {
        await deleteAdmin(id);
        toast.success('Admin successfully deleted');
      } catch (error) {
        console.error(error);
        toast.error(error?.message || 'Error deleting admin');
      }
    },
    [deleteAdmin]
  );

  const TABLE_HEAD = [
    { id: 'id', label: 'Id', width: 50 },
    { id: 'name', label: 'Name', width: 200 },
    { id: 'email', label: 'Email', width: 200 },
    { id: 'role', label: 'Role', width: 200 },
    { id: 'status', label: 'Status', width: 200 },
    { id: '', width: 100 },
  ];

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Admins List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Admins List' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
        action={
          <PermissionGuard requiredPermission={AdminPermission.ADD}>
            <Button
              href={paths.dashboard.admins.new}
              color="primary"
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Add Admin
            </Button>
          </PermissionGuard>
        }
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
                  [...Array(10)].map((_, index) => (
                    <TableSkeleton key={index} sx={{ height: denseHeight }} />
                  ))
                ) : (
                  <>
                    {admins.map((row) => (
                      <AdminTableRow
                        key={row.id}
                        row={row}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                      />
                    ))}
                  </>
                )}

                {admins.length === 0 && <TableNoData notFound={adminsEmpty} />}
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
    </DashboardContent>
  );
}
