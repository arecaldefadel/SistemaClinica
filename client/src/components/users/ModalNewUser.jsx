import React, { useEffect, useState } from "react";
import { Input, Button, LookupField } from "../ui";
import {
  addPaciente,
  getObrasSociales,
  updatePaciente,
} from "@/pages/Dashboard/services/services";
import usePagination from "@/hooks/usePagination";
import { useToast } from "@/hooks/useToast"; // asumimos que tenés este hook
import { nvl } from "@/utilities";
const ModalNewUser = ({ setShowModal, paciente, refresh }) => {
  // Formulario de carga de datos para los pacientes.
  const isModify = nvl(paciente?.ID) > 0 
  const [datosSubmit, setDatosSubmit] = useState({
    nombre: isModify ? paciente?.NOMBRE : "",
    apellido: isModify ? paciente?.APELLIDO : "",
    telefono: isModify ? paciente?.TELEFONO : "",
    descriOS: isModify ? paciente?.OBRA_SOCIAL : "",
    obraSocial: isModify ? paciente?.OS : "",
  });


  const obrasSocialesPagination = usePagination();
  const [listObrasSociales, setObrasSociales] = useState([]);
  const [isLoadingLookUpOS, setIsLoadingLookUpOS] = useState(false);
  const [searchObraSocial, setSearchObraSocial] = useState({
    [isModify > 0 ? "ID" : "ABREV"] : isModify > 0 ? paciente?.OS : "",
  });

  const { showToast } = useToast();

  useEffect(() => {
    Promise.all([
      getObrasSociales({
        page: obrasSocialesPagination.actualPage,
        pageSize: obrasSocialesPagination.countRows,
        paramsFilter: searchObraSocial,
      }),
    ]).then((res) => {
      const [resObrasSociales] = res;
      // Respuesta Obras Sociales.
      obrasSocialesPagination.asignarCountPage(
        resObrasSociales?.request.meta.totalPages
      );
      obrasSocialesPagination.asignarCountRecords(
        resObrasSociales?.request.meta.total
      );
      obrasSocialesPagination.asignarCountRows(5);
      setObrasSociales(resObrasSociales?.request?.datos);
      setIsLoadingLookUpOS(false);
    });
  }, [
    obrasSocialesPagination.actualPage,
    obrasSocialesPagination.countRows,
    searchObraSocial,
  ]);

  const handleChange = ({ name, value }) => {
    setDatosSubmit({
      ...datosSubmit,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nombre, apellido, telefono, obraSocial } = datosSubmit
    let request = {}
    if(isModify){
      request = await updatePaciente({ id: paciente?.ID, nombre, apellido, telefono, obraSocial })
    }else{
      request = await addPaciente({ nombre, apellido, telefono, obraSocial });
    }

    if (request.status !== 204) {
      showToast({
        title: "Error",
        message: request.message,
        type: "error",
        duration: 3000,
      });
      return;
    }
    showToast({
      title: isModify? `Paciente ${paciente?.NOMBRE} ${paciente?.APELLIDO}` : "Nuevo paciente",
      message: isModify? "Actualizado correctamente" : "Agregado correctamente",
      type: "success",
      duration: 3000,
    });
    refresh()
  };

  const handleSearchObraSocial = (item) => {
    setSearchObraSocial({ "ABREV": item });
  };

  const oSocialesTableOptions = {
    hidden: ["id"],
    idTable: "ID",
    th: {
      ID: { label: "Código", width: "auto" },
      ABREV: { label: "Abrev", width: "auto" },
      TIPO: { label: "Tipo", width: "auto" },
    },
    actions: [],
  };

  return (
    <>
      <section>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 md:flex-row  flex-col max-sm:w-full">
              <Input
                label={"Nombre"}
                name={"nombre"}
                value={datosSubmit?.nombre}
                className="max-sm:w-full"
                onChange={(e) => handleChange(e.target)}
              />
              <Input
                label={"Apellido"}
                name={"apellido"}
                value={datosSubmit?.apellido}
                className="max-sm:w-full"
                onChange={(e) => handleChange(e.target)}
              />
            </div>
            <div className="flex gap-4 md:flex-row  flex-col max-sm:w-full">
              <Input
                label={"Teléfono"}
                name={"telefono"}
                type="number"
                value={datosSubmit?.telefono}
                className="max-sm:w-full"
                onChange={(e) => handleChange(e.target)}
              />
              <LookupField
                data={listObrasSociales}
                displayField="ABREV"
                label="Obras Sociales"
                loading={isLoadingLookUpOS}
                onSelect={(row) =>
                  handleChange({ name: "obraSocial", value: row })
                }
                value={datosSubmit.descriOS}
                onSearch={(item) => handleSearchObraSocial(item)}
                options={oSocialesTableOptions}
                pagination={obrasSocialesPagination}
              />
            </div>
            <div className="flex flex-row">
              <div className="flex gap-4">
                <Button
                  title="Cancelar"
                  variant="danger"
                  onClick={() => setShowModal(false)}
                />
                <Button title="Guardar" type="button" onClick={handleSubmit} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ModalNewUser;
