import { Button, Input } from "@/components/ui";
import React, { useState } from "react";
import settings from "@/settings.json";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth.js";
import BraveWarning from "@/components/turnos/BraveWarning";
import { validateToken } from "@/utilities/auth";

const LogIn = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [userForm, setUserForm] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserForm({
      ...userForm,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const session = await login({
        username: userForm.username,
        password: userForm.password,
      });

      // Validación más robusta
      if (session?.data?.token && session?.data?.id) {
        // Verificar que el token sea válido antes de redirigir
        const isValidToken = await validateToken({
          tokenParam: session.data.token,
        });
        if (isValidToken) {
          navigate("/");
        } else {
          setError("Error de autenticación. Intente nuevamente.");
        }
      } else {
        setError(session?.error || "Error de autenticación");
      }
    } catch (error) {
      console.error(error);
      setError("Error de conexión. Intente nuevamente.");
    }
  };

  return (
    <>
      <BraveWarning />
      <section>
        <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--primary)]">
          <div className="flex items-center justify-center w-24 h-24 mb-8 bg-white rounded-full shadow-lg">
            <img src={settings.logoSystem} alt="Logo" className="w-16 h-16" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            {settings.nameSystem}
          </h1>
          <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-center text-gray-800">
              Bienvenido
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-700">
                  Usuario
                </label>
                <Input
                  onChange={handleChange}
                  type="text"
                  id="username"
                  name="username"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <Input
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className=" text-gray-500">
                  {showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                </button>
              </div>
              <p className="text-red-500">{error}</p>
              <Button type="submit" className="w-full" title="Iniciar sesion" />
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default LogIn;
