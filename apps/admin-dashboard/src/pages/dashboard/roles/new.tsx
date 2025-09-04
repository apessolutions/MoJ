import { Helmet } from 'react-helmet-async';

import RolesNewView from 'src/sections/roles/view/new';


export default function RolesNewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Roles New</title>
      </Helmet>

      <RolesNewView />
    </>
  );
}
