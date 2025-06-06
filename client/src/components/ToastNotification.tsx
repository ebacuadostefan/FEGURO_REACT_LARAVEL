import React, { useEffect } from 'react';

interface ToastNotificationProps {
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  onClose: () => void;
  isVisible: boolean;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({
  message,
  type,
  onClose,
  isVisible,
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const toastTypeClasses = {
    info: 'bg-info',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-danger',
  };

  const toastClass = toastTypeClasses[type] || 'bg-secondary';

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`toast align-items-center text-white ${toastClass} border-0 show`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style={{ position: 'fixed', top: '72px', right: '20px', zIndex: 1050 }}>
      <div className="d-flex">
        <div className="toast-body">{message}</div>
            <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                onClick={onClose}
                aria-label="Close">
            </button>
      </div>
    </div>
  );
};

export default ToastNotification;