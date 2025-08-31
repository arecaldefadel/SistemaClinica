import { useEffect, useState } from "react";
import axios from "axios";
import { ENDPOINTS } from "@/utilities/contanstes.js";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const login = async ({ username, password }) => {
    try {
      const res = await axios.post(ENDPOINTS.LOGIN, {
        username,
        password,
      });

      const result = res.data;
      // Validación más estricta
      if (result.error || !result.data?.token || !result.data?.id) {
        throw new Error(result.msg || "Error de autenticación");
      }

      const { token, nombre, apellido, id } = result.data;

      // Validar formato del token JWT
      if (!isValidJWTFormat(token)) {
        throw new Error("Token inválido");
      }

      setUser(`${nombre} ${apellido}`);
      setToken(token);
      localStorage.setItem("token", token);
      localStorage.setItem("nombreUser", `${nombre} ${apellido}`);
      localStorage.setItem("userId", id);

      return { success: true, data: result.data };
    } catch (error) {
      return { success: false, error: error.response.data };
    }
  };

  // Función para validar formato JWT
  const isValidJWTFormat = (token) => {
    if (!token || typeof token !== "string") return false;
    const parts = token.split(".");
    return parts.length === 3;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("nombreUser");
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
