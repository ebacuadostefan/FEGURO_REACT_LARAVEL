import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ToastNotification from "./ToastNotification";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn } = useAuth();

  const [showToast, setShowToast] = useState(false);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      setShowToast(true);
      const timer = setTimeout(() => {
        setRedirect(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isLoggedIn]);

  if (!isLoggedIn && redirect) {
    return <Navigate to="/" replace />;
  }

  if (!isLoggedIn) {
    return (
      <ToastNotification
        message="You must be logged in to access this page."
        type="error"
        onClose={() => setShowToast(false)}
        isVisible={showToast}
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;