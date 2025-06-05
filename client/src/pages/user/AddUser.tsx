import { useRef, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import UserForm from "../../components/forms/user/UserForm";

const AddUser = () => {
  const [loadingStore, setLoadingStore] = useState(false);
  const submitFormRef = useRef<(() => void) | null>(null);

  const handleUserAdded = (message: string) => {
    alert(message);
  };

  const content = (
    <>
      {loadingStore && <div>Loading...</div>}
      <UserForm
        setSubmitForm={submitFormRef}
        setLoadingStore={setLoadingStore}
        onUserAdded={handleUserAdded}
      />
    </>
  );

  return <MainLayout content={content} />;
};

export default AddUser;