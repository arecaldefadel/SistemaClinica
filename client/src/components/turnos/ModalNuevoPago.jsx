import React, { useEffect, useState } from "react";
import { Input, Button, LookupField, Dropdown, Select } from "../ui";
// import usePagination from "@/hooks/usePagination";
import { useToast } from "@/hooks/useToast"; // asumimos que tenés este hook
// import { getPacientes } from "@/pages/Dashboard/services/pacientes.services";
import {
  addPagos,
  getEstadosPago,
  updatePagos,
} from "@/pages/Dashboard/services/pagos.services";
import { nvl } from "@/utilities";

const ModalNuevoTurno = ({ setShowModal, pago, refresh }) => {
  const isModify = nvl(pago?.ID) > 0;
  // console.log({ isModify, pago });
  const [datosSubmit, setDatosSubmit] = useState({
    paciente: pago?.PACIENTE || "",
    estado: isModify ? pago?.ESTADO : "",
    periodo: isModify ? pago?.PERIODO_PAGO : "",
    plus: isModify ? pago?.PAGO_PLUS.replace("-", "") : "",
    observacion: isModify ? pago?.OBSERVACION : "",
  });

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

  const { showToast } = useToast();

  const handleChange = ({ name, value }) => {
    setDatosSubmit({
      ...datosSubmit,
      [name]: value,
    });
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
