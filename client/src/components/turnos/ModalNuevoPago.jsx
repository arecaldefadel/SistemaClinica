import React, { useEffect, useState } from "react";
import { Input, Button, LookupField, Dropdown, Select } from "../ui";
import usePagination from "@/hooks/usePagination";
import { useToast } from "@/hooks/useToast"; // asumimos que tenés este hook
import { getPacientes } from "@/pages/Dashboard/services/pacientes.services";
import {
  addPagos,
  getEstadosPago,
  updatePagos,
} from "@/pages/Dashboard/services/pagos.services";
import { nvl } from "@/utilities";

const ModalNuevoTurno = ({ setShowModal, pago, refresh, historial }) => {
  const isModify = nvl(pago?.ID) > 0;
  // console.log({ isModify, pago });
  const [datosSubmit, setDatosSubmit] = useState({
    paciente: pago?.PACIENTE || "",
    estado: isModify ? pago?.ESTADO : "",
    periodo: isModify ? pago?.PERIODO_PAGO : "",
    plus: isModify ? pago?.PAGO_PLUS.replace("-", "") : "",
    observacion: isModify ? pago?.OBSERVACION : "",
  });
  const pacientesPagination = usePagination();
  const [listPacientes, setListPacientes] = useState([]);
  const [isLoadingLookUpOS, setIsLoadingLookUpOS] = useState(false);
  const [searchParams, setSearchParams] = useState({
    estado: 1,
    [isModify > 0 ? "ID" : "paciente"]: isModify > 0 ? pago?.PACIENTE_ID : "",
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

  const [listEstadosPago, setListEstadosPago] = useState([]);
  const listPeriodos = [
    { ID: 1, DESCRIPCION: "Diario" },
    { ID: 2, DESCRIPCION: "Semanal" },
    { ID: 3, DESCRIPCION: "Mensual" },
  ];

  useEffect(() => {
    Promise.all([getEstadosPago()]).then((res) => {
      const [resEstados] = res;
      setListEstadosPago(resEstados.request);
    });
  }, []);

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
    pacientesPagination.actualPage,
    pacientesPagination.countRows,
  ]);
  const { showToast } = useToast();

  const handleChange = ({ name, value }) => {
    setDatosSubmit({
      ...datosSubmit,
      [name]: value,
    });
  };

  const handleSearchParams = ({ field, value }) => {
    setSearchParams({ ...searchParams, [field]: value });
    setIsLoadingLookUpOS(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let request = {};
    if (isModify) {
      request = await updatePagos(nvl(pago?.ID), datosSubmit);
    } else {
      request = await addPagos(datosSubmit);
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

    const tituloNotificacion = pago.NOMBRE
      ? `Pago de ${pago.NOMBRE || ""} ${pago.APELLIDO || ""}`
      : "Modificación de Pago";

    showToast({
      title: isModify ? tituloNotificacion : "Nuevo Pago",
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
            <div className="flex gap-4 md:flex-row  flex-col max-sm:w-full flex-wrap">
              {!historial ? (
                <LookupField
                  data={listPacientes}
                  displayField="NOMBRE"
                  label="Pacientes"
                  loading={isLoadingLookUpOS}
                  onSelect={(row) =>
                    handleChange({ name: "paciente", value: row })
                  }
                  value={isModify ? `${pago.NOMBRE} ${pago.APELLIDO}` : ""}
                  onSearch={(item) =>
                    handleSearchParams({ field: "paciente", value: item })
                  }
                  options={pacienteTableOptions}
                  pagination={pacientesPagination}
                />
              ) : null}

              <Select
                name={"estado"}
                label={"Estado"}
                items={listEstadosPago}
                config={{ descripCol: "DESCRIPCION", idCol: "ID" }}
                value={pago?.ESTADO || ""}
                placeholder="Selec. estado"
                onChange={(e) => {
                  handleChange({ name: "estado", value: e.target.value });
                }}
              />
              <Select
                name={"periodo"}
                label={"Periodo"}
                items={listPeriodos}
                config={{ descripCol: "DESCRIPCION", idCol: "ID" }}
                value={isModify ? `${pago.PERIODO_PAGO}` : ""}
                placeholder="Selec. estado"
                onChange={(e) => {
                  handleChange({ name: "periodo", value: e.target.value });
                }}
              />
              <Input
                name="observacion"
                label="Observación"
                type="text"
                value={datosSubmit?.observacion}
                onChange={(e) => handleChange(e.target)}
              />
              <Input
                name="plus"
                type="number"
                label="Plus"
                value={datosSubmit?.plus}
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
