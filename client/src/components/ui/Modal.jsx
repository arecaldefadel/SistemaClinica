import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, size , children }) {
  
  useEffect(() => {
    const closeOnEsc = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', closeOnEsc);
    return () => window.removeEventListener('keydown', closeOnEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const sizes = {
    lg: "lg",
    xl: "xl",
    full:"full"
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className={`bg-[var(--background)] text-[var(--text)] rounded-2xl shadow-xl p-6  max-w-${sizes[size] || "lg" } relative`}>
        <button
          className="absolute top-2 right-2 text-xl text-[var(--muted)] hover:text-[var(--text)]"
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          &times;
        </button>
        {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
        <div>{children}</div>
      </div>
    </div>
  );
}