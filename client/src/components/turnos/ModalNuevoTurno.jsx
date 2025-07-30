import React, { useEffect, useState } from "react";
import { Input, Button, LookupField, Dropdown } from "../ui";
import {
  addTurno,
  updateTurno,
} from "@/pages/Dashboard/services/turnos.services.js";
import usePagination from "@/hooks/usePagination";
import { useToast } from "@/hooks/useToast"; // asumimos que tenés este hook
import { formatDateArg, nvl } from "@/utilities";
import { getPacientes } from "@/pages/Dashboard/services/pacientes.services";
import CalendarioTurnos from "./CalendarioTurnos";

const ModalNuevoTurno = ({ setShowModal, turno, refresh }) => {
  const isModify = nvl(turno?.ID) > 0;
  const [datosSubmit, setDatosSubmit] = useState({
    paciente: isModify ? turno?.PACIENTE : "",
    fecha: isModify ? formatDateArg(turno?.FECHA, true) : turno?.FECHA || "",
    hora: isModify ? turno?.HORA : "",
  });

  const pacientesPagination = usePagination();
  const [listPacientes, setListPacientes] = useState([]);
  const [isLoadingLookUpOS, setIsLoadingLookUpOS] = useState(false);
  const [searchParams, setSearchParams] = useState({
    estado: 1,
    [isModify > 0 ? "ID" : "paciente"]: isModify > 0 ? turno?.PACIENTE_ID : "",
  });

  const pacienteTableOptions = {
    hidden: ["OS"],
    idTable: "ID",
    th: {
      ID: { label: "Código", width: "50px" },
      NOMBRE: { label: "Nombre", width: "auto" },
      APELLIDO: { label: "Apellido", with: "auto" },
      TELEFONO: { label: "Teléfono", width: "auto" },
      OBRA_SOCIAL: { label: "Obra Social", width: "auto" },
      OS: { label: "OS_CODE", width: "auto" },
    },
    actions: [],
  };

  useEffect(() => {
    Promise.all([
      getPacientes({
        page: pacientesPagination.actualPage,
        pageSize: pacientesPagination.countRows,
        paramsFilter: searchParams,
      }),
    ]).then((res) => {
      const [resPaciente] = res;

      pacientesPagination.asignarCountPage(
        resPaciente?.request?.meta?.totalPages || 0
      );
      pacientesPagination.asignarCountRecords(
        resPaciente?.request?.meta?.total || 0
      );
      setListPacientes(resPaciente?.request?.datos);
      setIsLoadingLookUpOS(false);
    });
  }, [
    isLoadingLookUpOS,
    pacientesPagination.countRows,
    pacientesPagination.actualPage,
  ]);

  const handleSearchParams = ({ field, value }) => {
    setSearchParams({ ...searchParams, [field]: value });
    setIsLoadingLookUpOS(true);
  };

  const { showToast } = useToast();

  const handleChange = ({ name, value }) => {
    setDatosSubmit({
      ...datosSubmit,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { paciente, fecha, hora } = datosSubmit;

    let request = {};
    if (isModify) {
      request = await updateTurno({ id: turno?.ID, paciente, fecha, hora });
    } else {
      request = await addTurno({ paciente, fecha, hora });
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
      title: isModify
        ? `Turno de ${turno.NOMBRE} ${turno.APELLIDO}`
        : "Nuevo paciente",
      message: isModify
        ? "Actualizado correctamente"
        : "Agregado correctamente",
      type: "success",
      duration: 3000,
    });
    refresh();
  };

  return (
    <>
      <section>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 md:flex-row  flex-col max-sm:w-full">
              <LookupField
                data={listPacientes}
                displayField="NOMBRE"
                label="Pacientes"
                loading={isLoadingLookUpOS}
                onSelect={(row) =>
                  handleChange({ name: "paciente", value: row })
                }
                value={isModify ? `${turno.NOMBRE} ${turno.APELLIDO}` : ""}
                onSearch={(item) =>
                  handleSearchParams({ field: "paciente", value: item })
                }
                options={pacienteTableOptions}
                pagination={pacientesPagination}
              />
              <Input
                name="fecha"
                type="date"
                label="Fecha del turno"
                value={datosSubmit.fecha}
                onChange={(e) => handleChange(e.target)}
              />
              <Input
                name="hora"
                type="time"
                label="Hora"
                value={datosSubmit.hora}
                onChange={(e) => handleChange(e.target)}
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

export default ModalNuevoTurno;
