import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ErrorHandler from "../../handler/ErrorHandler";
import { LoginFieldErrors } from "../../interfaces/auth/LoginFieldErrors";
import LoadingSpinner from "../Spinner";
import ToastNotification from "../ToastNotification";

const LoginForm = () => {
  const { login, justLoggedOut, setJustLoggedOut } = useAuth();
  const navigate = useNavigate();

  const [state, setState] = useState({
    loadingLogin: false,
    email: "",
    password: "",
    errors: {} as LoginFieldErrors,
  });

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (justLoggedOut) {
      setMessage("Logout successful");
      setIsSuccess(true);
      setIsVisible(true);
      setJustLoggedOut(false);
    }
  }, [justLoggedOut, setJustLoggedOut]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();

    setState((prevState) => ({
      ...prevState,
      loadingLogin: true,
      errors: {},
    }));

    login(state.email, state.password)
      .then(() => {
        handleShowAlertMessage("Login successful!", true, true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      })
      .catch((error) => {
        if (error.response?.status === 422) {
          setState((prevState) => ({
            ...prevState,
            errors: error.response.data.errors,
          }));
        } else if (error.response?.status === 401) {
          handleShowAlertMessage(error.response.data.message, false, true);
        } else {
          ErrorHandler(error, null);
          handleShowAlertMessage("An unexpected error occurred.", false, true);
        }
      })
      .finally(() => {
        setState((prevState) => ({
          ...prevState,
          loadingLogin: false,
        }));
      });
  };

  const handleShowAlertMessage = (
    message: string,
    isSuccess: boolean,
    isVisible: boolean
  ) => {
    setMessage(message);
    setIsSuccess(isSuccess);
    setIsVisible(isVisible);
  };

  const handleCloseAlertMessage = () => {
    setMessage("");
    setIsSuccess(false);
    setIsVisible(false);
  };

  return (
    <div className="d-flex justify-content-center align-items-center h-100">
      <div
        className="p-4 shadow rounded bg-white"
        style={{ width: "100%", maxWidth: "400px" }}>
        <header className="text-center">
          <h2>SIGN IN</h2>
        </header>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email">Email</label>
            <div className="input-group">
              <span className="input-group-text" id="email-addon">
                <i className="bi bi-envelope"></i>
              </span>
              <input
                type="text"
                className={`form-control ${state.errors.email ? "is-invalid" : ""}`}
                name="email"
                id="email"
                aria-describedby="email-addon"
                value={state.email}
                onChange={handleInputChange}
                autoFocus
              />
            </div>
            {state.errors.email && (
              <span className="text-danger">{state.errors.email[0]}</span>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="password">Password</label>
            <div className="input-group">
              <span className="input-group-text" id="password-addon">
                <i className="bi bi-lock"></i>
              </span>
              <input
                type="password"
                className={`form-control ${state.errors.password ? "is-invalid" : ""}`}
                name="password"
                id="password"
                aria-describedby="password-addon"
                value={state.password}
                onChange={handleInputChange}
              />
            </div>
            {state.errors.password && (
              <span className="text-danger">{state.errors.password[0]}</span>
            )}
          </div>
          <div className="d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={state.loadingLogin}
            >
              {state.loadingLogin ? (
                <>
                  <LoadingSpinner /> Logging In...
                </>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>

        {/* Toast Notification */}
        <ToastNotification
          message={message}
          type={isSuccess ? "success" : "error"}
          onClose={handleCloseAlertMessage}
          isVisible={isVisible}
        />
      </div>
    </div>
  );
};

export default LoginForm;