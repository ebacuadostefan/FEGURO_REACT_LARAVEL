import { useEffect } from "react";
import LoginForm from "../../components/forms/LoginForm";

const Login = () => {
  useEffect(() => {
    document.title = "Login";
  }, []);

  return (
    <>
      <LoginForm />
    </>
  );
};

export default Login;
