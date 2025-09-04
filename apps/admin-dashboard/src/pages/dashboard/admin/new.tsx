import { Helmet } from 'react-helmet-async';

import AdminNewView from 'src/sections/admin/view/new';



export default function AdminNewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Admin New</title>
      </Helmet>

      <AdminNewView />
    </>
  );
}
