import UserForm from "../../components/forms/user/Form";
import type { User } from "../../interfaces/users/User";
import MainLayout from "../../layouts/MainLayout";

const User = () => {
  const content = (
    <>
      <UserForm/>
    </>
  );

  return <MainLayout content={content} />;
};

export default User;