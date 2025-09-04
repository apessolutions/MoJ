import { Helmet } from 'react-helmet-async';

import RolesEditView from 'src/sections/roles/view/edit';



export default function RolesEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Roles Edit</title>
      </Helmet>

      <RolesEditView />
    </>
  );
}
