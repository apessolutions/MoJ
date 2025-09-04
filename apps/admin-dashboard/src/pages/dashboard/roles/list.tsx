import { Helmet } from 'react-helmet-async';

import RolesListView from 'src/sections/roles/view/list';


export default function RolesListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Roles List</title>
      </Helmet>

      <RolesListView />
    </>
  );
}
