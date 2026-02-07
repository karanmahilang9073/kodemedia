import { useEffect } from 'react';

export const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
    warning: 'bg-yellow-50 border-yellow-200',
  }[type];

  const textColor = {
    success: 'text-green-600',
    error: 'text-red-600',
    info: 'text-blue-600',
    warning: 'text-yellow-600',
  }[type];

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg border ${bgColor} ${textColor} shadow-lg font-medium text-sm animate-slide-in-right`}>
      {message}
    </div>
  );
};

export default Toast;
