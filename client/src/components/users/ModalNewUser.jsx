import React, { useState } from "react";
import { Input, Button } from "../ui";
const ModalNewUser = ({ setShowModal }) => {
  // Formulario de carga de datos para los pacientes.
  const [datosSubmit, setDatosSubmit ] = useState({
  //   nombrePaciente: "",
  //   apellidoPaciente: "",
  //   nroTelefonoPaciente: ""
  }); 


  const handleChange = (e) => {
    const { name, value } = e.target
    setDatosSubmit({
      ...datosSubmit,
      [name]: value
    })
  }

  const handleSubmit = (e) =>{
    e.preventDefault()
    console.log(datosSubmit)
  }

 return (<>
    <section>
        <div className="flex flex-col gap-4">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex gap-4 md:flex-row  flex-col max-sm:w-full">
              <Input
                label={"Nombre"}
                name={"nombre"}
                value={datosSubmit?.nombrePaciente}
                className="max-sm:w-full"
                onChange={handleChange}
              />
              <Input
                label={"Apellido"}
                name={"apellido"}
                value={datosSubmit?.apellidoPaciente}
                className="max-sm:w-full"
                onChange={handleChange}
              />
            </div>
            <div className="flex gap-4 md:flex-row  flex-col max-sm:w-full">
              <Input
                label={"Teléfono"}
                name={"telefono"}
                type="number"
                value={datosSubmit?.nroTelefonoPaciente}
                className="max-sm:w-full"
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-row">
              <div className="flex gap-4">
                <Button
                  title="Cancelar"
                  variant="danger"
                  onClick={() => setShowModal(false)}
                />
                <Button title="Guardar" type="submit" />
              </div>
            </div>
          </form>
        </div>
    </section>
  </>);
};

export default ModalNewUser;
