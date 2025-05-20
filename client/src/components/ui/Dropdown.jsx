import { useEffect, useRef, useState } from 'react';

const Dropdown = ({ trigger, children }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  // Cerrar al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setOpen(!open)} className="cursor-pointer select-none">
        {trigger}
      </div>

      {open && (
        <div className="absolute mt-2 rounded-md shadow-lg bg-white ring-1 ring-black/5 z-50">
          <div className="py-1 text-sm text-[var(--text)]">{children}</div>
        </div>
      )}
    </div>
  );
}

export default Dropdown;