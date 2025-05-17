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
      const { token, user } = result.data;
      setUser(user);
      setToken(token);
      localStorage.setItem("token", token);
      return res.data;
    } catch (error) {
      return error.response.data;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
