import { ref, readonly } from 'vue';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  persistent?: boolean;
}

interface ToastOptions {
  title?: string;
  duration?: number;
  persistent?: boolean;
}

const toasts = ref<Toast[]>([]);

let toastId = 0;

const generateId = () => `toast-${++toastId}`;

const addToast = (
  type: Toast['type'],
  message: string,
  options: ToastOptions = {}
): string => {
  const id = generateId();
  const toast: Toast = {
    id,
    type,
    message,
    title: options.title,
    duration: options.duration ?? 5000,
    persistent: options.persistent ?? false,
  };

  toasts.value.push(toast);
  return id;
};

const removeToast = (id: string) => {
  const index = toasts.value.findIndex(toast => toast.id === id);
  if (index > -1) {
    toasts.value.splice(index, 1);
  }
};

const clearAllToasts = () => {
  toasts.value = [];
};

export const useToast = () => {
  const success = (message: string, options?: ToastOptions) => {
    return addToast('success', message, options);
  };

  const error = (message: string, options?: ToastOptions) => {
    return addToast('error', message, options);
  };

  const warning = (message: string, options?: ToastOptions) => {
    return addToast('warning', message, options);
  };

  const info = (message: string, options?: ToastOptions) => {
    return addToast('info', message, options);
  };

  const remove = (id: string) => {
    removeToast(id);
  };

  const clear = () => {
    clearAllToasts();
  };

  return {
    toasts: readonly(toasts),
    success,
    error,
    warning,
    info,
    remove,
    clear,
  };
};

// Global toast instance for use across the app
export const toast = {
  success: (message: string, options?: ToastOptions) => addToast('success', message, options),
  error: (message: string, options?: ToastOptions) => addToast('error', message, options),
  warning: (message: string, options?: ToastOptions) => addToast('warning', message, options),
  info: (message: string, options?: ToastOptions) => addToast('info', message, options),
};

// Export toasts for global access
export { toasts };