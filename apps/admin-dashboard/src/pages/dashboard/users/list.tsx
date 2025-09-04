import { Helmet } from 'react-helmet-async';
import UsersListView from 'src/sections/users/view/list';

export default function UsersListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Users List</title>
      </Helmet>

      <UsersListView />
    </>
  );
}
