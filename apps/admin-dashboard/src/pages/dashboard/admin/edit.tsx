import { Helmet } from 'react-helmet-async';

import AdminEditView from 'src/sections/admin/view/edit';




export default function AdminEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Admin Edit</title>
      </Helmet>

      <AdminEditView />
    </>
  );
}
