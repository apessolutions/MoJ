import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import { useCallback } from 'react';
import {
  useDeleteRoleMutation,
  useGetRolesListQuery,
} from 'src/api/hooks/roles';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { PermissionGuard } from 'src/components/guard/permission-guard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { toast } from 'src/components/snackbar';
import {
  TableHeadCustom,
  TableNoData,
  TableSkeleton,
  useTable,
} from 'src/components/table';
import { DashboardContent } from 'src/layouts/dashboard';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import RoleTableRow from '../role-table-row';
import { RolePermission } from '../../../../../../libs/role/src/lib/types/permission-type.type';

export default function RolesListView() {
  const table = useTable({ defaultOrderBy: 'orderNumber' });
  const denseHeight = table.dense ? 60 : 80;
  const router = useRouter();
  const { data, isPending: isGetRolesPending } = useGetRolesListQuery();

  const roles = data?.data || [];
  const rolesEmpty = roles.length === 0;

  const handleEditRow = useCallback(
    (id: number) => {
      router.push(paths.dashboard.roles.edit(id));
    },
    [router]
  );
  const { mutateAsync: deleteRole } = useDeleteRoleMutation();
  const handleDeleteRow = useCallback(
    async (id: number) => {
      try {
        await deleteRole(id);
        toast.success('Role successfully deleted');
      } catch (error) {
        console.error(error);
        toast.error(error?.message || 'Error deleting role');
      }
    },
    [deleteRole]
  );

  const TABLE_HEAD = [
    { id: 'id', label: 'Id', width: 50 },
    { id: 'name', label: 'Name', width: 200 },
    { id: 'description', label: 'Description', width: 200 },
    { id: '', width: 100 },
  ];

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Roles List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Roles List' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
        action={
          <PermissionGuard requiredPermission={RolePermission.ADD}>
            <Button
              href={paths.dashboard.roles.new}
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Add Role
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
                {isGetRolesPending ? (
                  [...Array(10)].map((i, index) => (
                    <TableSkeleton key={index} sx={{ height: denseHeight }} />
                  ))
                ) : (
                  <>
                    {roles.map((row) => (
                      <RoleTableRow
                        key={row.id}
                        row={row}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                      />
                    ))}
                  </>
                )}

                {roles.length === 0 && <TableNoData notFound={rolesEmpty} />}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
      </Card>
    </DashboardContent>
  );
}
