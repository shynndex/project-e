import { toast } from 'react-toastify';

export const useNotify = () => {
  const success = (message) => {
    toast.success(message, {
      icon: '✅'
    });
  };

  const error = (message) => {
    toast.error(message, {
      icon: '❌'
    });
  };

  const info = (message) => {
    toast.info(message, {
      icon: 'ℹ️'
    });
  };

  const warning = (message) => {
    toast.warning(message, {
      icon: '⚠️'
    });
  };

  return {
    success,
    error,
    info,
    warning
  };
};