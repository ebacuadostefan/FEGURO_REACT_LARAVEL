import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ToastNotification from "./ToastNotification";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn, justLoggedOut, setJustLoggedOut } = useAuth();

  const [showLogoutToast, setShowLogoutToast] = useState(false);
  const [showLoginToast, setShowLoginToast] = useState(false);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!isLoggedIn && justLoggedOut) {
      // Show logout success toast notification
      setShowLogoutToast(true);
      setJustLoggedOut(false);

      const timer = setTimeout(() => {
        setShowLogoutToast(false);
        setRedirect(true);
      }, 1500);

      return () => clearTimeout(timer);
    } else if (!isLoggedIn) {
      // Show "must login" toast notification
      setShowLoginToast(true);

      const timer = setTimeout(() => {
        setShowLoginToast(false);
        setRedirect(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, justLoggedOut, setJustLoggedOut]);

  if (!isLoggedIn && redirect) {
    return <Navigate to="/" replace />;
  }

  if (!isLoggedIn) {
    if (showLogoutToast) {
      return (
        <ToastNotification
          message="Logout successful."
          type="success"
          onClose={() => setShowLogoutToast(false)}
          isVisible={showLogoutToast}
        />
      );
    }
    if (showLoginToast) {
      return (
        <ToastNotification
          message="You must be logged in to access this page."
          type="error"
          onClose={() => setShowLoginToast(false)}
          isVisible={showLoginToast}
        />
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
