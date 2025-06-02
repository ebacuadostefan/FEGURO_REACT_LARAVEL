import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ToastNotification from "../ToastNotification";
import ErrorHandler from "../../handler/ErrorHandler";

const LogoutForm: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setMessage("Logout successful");
      setIsVisible(true);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      ErrorHandler(error, null);
      setMessage("Failed to logout.");
      setIsVisible(true);
    }
  };

  return (
    <>
      <button type="button" onClick={handleLogout} className="dropdown-item text-danger d-flex gap-2 align-content-center">
        <i className="bi bi-box-arrow-left"></i> Logout
      </button>
      <ToastNotification
        message={message}
        type="success"
        onClose={() => setIsVisible(false)}
        isVisible={isVisible}/>
    </>
  );
};

export default LogoutForm;