import UsersTable from "../../components/tables/user/UsersTable";
import type { Users } from "../../interfaces/users/Users";
import MainLayout from "../../components//layout/MainLayout";

const Users = () => {
  const content = (
    <>
      <UsersTable/>
    </>
  );

  return <MainLayout content={content} />;
};

export default Users;