import { Helmet } from 'react-helmet-async';

import AdminListView from 'src/sections/admin/view/list';



export default function AdminListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Admin List</title>
      </Helmet>

      <AdminListView />
    </>
  );
}
