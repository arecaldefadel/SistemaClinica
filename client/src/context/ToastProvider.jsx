import { useState } from "react";
import { ToastContext } from "./ToastContext";
import ToastContainer from "@/components/ui/ToastContainer";

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = ({ title, message, type = 'info', duration = 3000, position = 'top-right' }) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, position, title }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
}