import { Navigate } from "react-router-dom";
import { validateToken } from "@/utilities/auth";
import { useEffect, useState } from "react";

const PrivateRoute = ({ children }) => {

  const [isValid, setIsValid] = useState(null); // null = cargando

  useEffect(() => {
    // Verifica si el token es válido
    Promise.all([validateToken()])
      .then((results) => {
        const [ok] = results;
        setIsValid(ok);
      })
      .catch((error) => {
        console.error("Error validating token:", error);
        setIsValid(false);
      });
  }, []);

  if (isValid === null) return <div className="p-4">Verificando sesión...</div>;
  if (!isValid) return <Navigate to="/login" replace />;

  return children;
}

export default PrivateRoute;