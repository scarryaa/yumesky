import React, { createContext, useContext, useMemo, useState } from 'react';
import { Toast } from '../../components/Toast/Toast';

interface ToastType {
  message: string;
}

interface ToastContext {
  addToast: (toast: ToastType) => void;
  removeToast: () => void;
}

const toastContext = createContext<ToastContext>({
  addToast: () => {},
  removeToast: () => {}
})

export const Provider = ({ children }: React.PropsWithChildren<Record<string, unknown>>): JSX.Element => {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const addToast = (toast: ToastType): void => {
    setToasts([...toasts, toast]);
  };

  const removeToast = (): void => {
    setToasts(toasts.slice(1));
  };

  const methods = useMemo(() => ({
    addToast,
    removeToast
  }), [addToast, removeToast])

  return (
    <toastContext.Provider value={methods}>
        {children}

        {toasts.map((toast, index) => (
        <Toast key={index} message={toast.message} />
        ))}
    </toastContext.Provider>
  )
}

export const useToasts = (): ToastContext => {
  return useContext(toastContext);
}
