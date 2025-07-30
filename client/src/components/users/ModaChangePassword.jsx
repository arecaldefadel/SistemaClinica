import React, { useState } from "react";
import { Input, Button, LookupField } from "../ui";
import { useToast } from "@/hooks/useToast"; // asumimos que tenés este hook
import { api } from "@/pages/User/services/service";

const ModaChangePassword = ({ setShowModal, refresh }) => {
  const { showToast } = useToast();
  const [datosSubmit, setDatosSubmit] = useState({
    password: "",
    newPassword: "",
    repeatNewPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = ({ name, value }) => {
    setDatosSubmit({
      ...datosSubmit,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let request = {};
    const { newPassword, repeatNewPassword } = datosSubmit;
    request = await api.changePassword({ newPassword, repeatNewPassword });
    console.log(request);
    if (request.status !== 204) {
      showToast({
        title: "Error",
        message: request.data.message,
        type: "error",
        duration: 3000,
      });
      return;
    }
    showToast({
      title: "",
      message: "Actualizado correctamente",
      type: "success",
      duration: 3000,
    });
    refresh();
  };

  return (
    <div className="flex flex-col gap-4">
      <form className="flex flex-col gap-4" onSubmit={(e) => handleSubmit(e)}>
        <div className="flex gap-4 md:flex-row  flex-col justify-center items-center">
          <Input
            label={"Nueva Contraseña"}
            name={"newPassword"}
            type={showPassword ? "text" : "password"}
            autoComplete="off"
            value={datosSubmit?.newPassword}
            onChange={(e) =>
              handleChange({ name: "newPassword", value: e.target.value })
            }
            className="max-sm:w-full"
          />
          <Input
            label={"Repetir Nueva Contraseña"}
            name={"repeatNewPassword"}
            type={showPassword ? "text" : "password"}
            autoComplete="off"
            value={datosSubmit?.repeatNewPassword}
            onChange={(e) =>
              handleChange({ name: "repeatNewPassword", value: e.target.value })
            }
            className="max-sm:w-full"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className=" text-gray-500">
            {showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          </button>
        </div>

        <div className="flex flex-row">
          <div className="flex gap-4">
            <Button
              title="Cancelar"
              variant="danger"
              onClick={() => setShowModal(false)}
            />
            <Button title="Guardar" type={"submit"} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default ModaChangePassword;
