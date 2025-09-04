import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import { useGetUsersQuery } from 'src/api/hooks/users';
import { usePagination } from 'src/auth/hooks/use-pagination';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Scrollbar } from 'src/components/scrollbar';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSkeleton,
  useTable,
} from 'src/components/table';
import { DashboardContent } from 'src/layouts/dashboard';
import { paths } from 'src/routes/paths';

import UserTableRow from '../user-table-row';

export default function UsersListView() {
  const table = useTable({ defaultOrderBy: 'id' });
  const denseHeight = table.dense ? 60 : 80;
  const { pageNumber, navigateToPage } = usePagination();
  const { data, isPending: isGetUsersPending } = useGetUsersQuery({
    page: pageNumber,
  });

  const users = data?.data.data || [];
  const usersEmpty = users.length === 0;
  const pagination = data?.data;

  const TABLE_HEAD = [
    { id: 'id', label: 'Id', width: 50 },
    { id: 'name', label: 'Name', width: 200 },
    { id: 'email', label: 'Email', width: 200 },
    { id: 'phoneNumber', label: 'Phone', width: 200 },
    { id: 'dateOfBirth', label: 'Date Of Birth', width: 200 },
    { id: 'gender', label: 'Gender', width: 200 },
    { id: '', width: 100 },
  ];

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Users List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Users List' },
        ]}
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
                {isGetUsersPending ? (
                  [...Array(10)].map((i, index) => (
                    <TableSkeleton key={index} sx={{ height: denseHeight }} />
                  ))
                ) : (
                  <>
                    {users.map((row) => (
                      <UserTableRow key={row.id} row={row} />
                    ))}
                  </>
                )}

                {users.length === 0 && <TableNoData notFound={usersEmpty} />}
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
