import UsersTable from "../../components/tables/user/UsersTable";
import type { User } from "../../interfaces/users/User";
import MainLayout from "../../layouts/MainLayout";

const User = () => {
  const content = (
    <>
      <UsersTable/>
    </>
  );

  return <MainLayout content={content} />;
};

export default User;