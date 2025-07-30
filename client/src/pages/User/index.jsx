import { Button, Input } from "@/components/ui";
import React, { useState } from "react";
import settings from "@/settings.json";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth.js";
import BraveWarning from "@/components/turnos/BraveWarning";

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
    const session = await login({
      username: userForm.username,
      password: userForm.password,
    });
    if (session?.status !== 200) {
      setError(session?.response.data);
    } else {
      navigate("/");
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
          <h1 className="text-4xl font-bold text-white mb-4">Bienvenido</h1>
          <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-center text-gray-800">
              {settings.nameSystem}
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
