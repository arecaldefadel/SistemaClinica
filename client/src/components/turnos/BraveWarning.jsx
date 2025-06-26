import { useEffect, useState } from 'react';

export default function BraveErrorWarning() {
  const [isBrave, setIsBrave] = useState(false);

  useEffect(() => {
    const checkBrave = async () => {
      if (navigator.brave && await navigator.brave.isBrave()) {
        setIsBrave(true);
      }
    };
    checkBrave();
  }, []);

  if (!isBrave) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-200 text-yellow-900 border border-yellow-400 p-4 rounded-xl shadow-xl z-50 max-w-sm">
      <strong className="block mb-1">🛡️ ¡Estás usando Brave!</strong>
      <p className="text-sm">
        El <span className="font-semibold">Brave Shield</span> puede estar bloqueando funciones esenciales
        de esta aplicación. Desactivá el escudo para este sitio o usá modo incógnito para evitar errores.
      </p>
    </div>
  );
}
