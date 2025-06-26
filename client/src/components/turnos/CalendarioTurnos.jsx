import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import usePagination from "@/hooks/usePagination";
import { useToast } from "@/hooks/useToast"; // asumimos que tenés este hook
import { findInObject, nvl } from "@/utilities";
import {
  deleteTurno,
  getTurnos,
  getTurnosPorMes,
  setTurnoAtendido,
} from "@/pages/Dashboard/services/turnos.services";
import {
  Card,
  Table,
  Modal,
  Input,
  Button,
} from "@/components/ui";
import ModalNuevoTurno from "@/components/turnos/ModalNuevoTurno";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

dayjs.locale("es");

const CalendarioTurnos = ({refresh}) => {
  const [mesActual, setMesActual] = useState(dayjs());
  const [turnos, setTurnos] = useState([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const turnosPagination = usePagination();
  const [listTurnos, setListTurnos] = useState([]);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [searchParams, setSearchParams] = useState({});
  const [turnoSelected, setTurnoSelected] = useState(0);
  const [showTurnoModal, setShowTurnoModal] = useState(false);
  const [ showTurnosModal, setShowTurnosModal ] = useState(false)
  const [showConfirmacionDelete, setShowConfirmacionDelete] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    Promise.all([
      getTurnosPorMes({ page: 1, pageSize: 10, paramsFilter: {fecha: mesActual.format('YYYY-MM')} }),
    ]).then((res) => {
      const [resTurno] = res;
      const { datos } = resTurno.request;
        setTurnos(datos || []);

    })
  }, [mesActual, isLoadingTable, refresh]);
  
  const diasDelMes = () => {
    const inicio = mesActual.startOf("month").startOf("week");
    const fin = mesActual.endOf("month").endOf("week");
    const dias = [];
    let dia = inicio;

    while (dia.isBefore(fin)) {
      dias.push(dia);
      dia = dia.add(1, "day");
    }

    return dias;
  };

  const turnosPorDia = (fecha) => {
    return turnos.filter((t) => t.FECHA === fecha.format("YYYY-MM-DD"));
  };

  const cambiarMes = (valor) => {
    setMesActual(mesActual.add(valor, "month"));
    setDiaSeleccionado(null);
  };



  const handleSearchParams = ({ field, value }) => {
    setSearchParams({ ...searchParams, [field]: value });
  };

  const handleCargarTurnos = async ({ fecha }) =>{

    const resTurno =  await getTurnos({ page: 1, pageSize: 10, paramsFilter: { fecha } })
          turnosPagination.asignarCountPage(
        resTurno?.request?.meta?.totalPages || 0
      );
      turnosPagination.asignarCountRecords(resTurno?.request?.meta?.total || 0);
      turnosPagination.asignarCountRows(5);
      setListTurnos(resTurno?.request?.datos);
      setIsLoadingTable(false);
  }

  const handleDeleteTurno = async ({ id }) => {
    const request = await deleteTurno({ id });
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
      title: `Turno ${turnoSelected?.NOMBRE} ${turnoSelected?.APELLIDO}`,
      message: "Eliminado correctamente",
      type: "success",
      duration: 3000,
    });
    setIsLoadingTable(true);
  };

  const handleSetAtendido = async ({ id, atendido }) => {
    const turno = findInObject(listTurnos, id, "ID");
    const request = await setTurnoAtendido({ id, atendido });
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
      title: `Turno ${turno?.NOMBRE} ${turno?.APELLIDO}`,
      message: "Actualizado correctamente",
      type: "success",
      duration: 3000,
    });
    setIsLoadingTable(true);
  };

  const handleSelectRow = (id) => {
    const turno = findInObject(listTurnos, id, "ID");
    setTurnoSelected(turno);
  };

  const classConditionsOptions = [
    {
      value: "Si",
      field: "ATENDIDO",
      class: "bg-green-200",
      oper: "=",
    },
    {
      value: "No",
      field: "ATENDIDO",
      class: "bg-red-200",
      oper: "=",
    },
  ];

  const tableOptions = {
    hidden: ["OS", "ID", "PACIENTE"],
    idTable: "ID",
    th: {
      ID: { label: "Código", width: "50px" },
      ATENDIDO: { label: "Atendido", width: "50px" },
      NOMBRE: { label: "Nombre", width: "auto" },
      APELLIDO: { label: "Apellido", with: "auto" },
      FECHA: { label: "Fecha", width: "auto" },
      HORA: { label: "Hora", width: "auto" },
      TELEFONO: { label: "Teléfono", width: "auto" },
      OBRA_SOCIAL: { label: "Obra Social", width: "auto" },
      OS: { label: "OS_CODE", width: "auto" },
      PACIENTE: { label: "", with: "auto" },
    },
    classConditions: classConditionsOptions,
    actions: [
      {
        icon: "edit",
        title: "Editar",
        func: (id) => {
          setShowTurnoModal(true);
          const turno = findInObject(listTurnos, id, "ID");
          setTurnoSelected(turno);
        },
      },
      {
        icon: "trash",
        title: "Eliminar",
        func: (id) => {
          setShowConfirmacionDelete(true);
          const turno = findInObject(listTurnos, id, "ID");
          setTurnoSelected(turno);
        },
      },
      {
        icon: "check",
        title: "Atendido",
        func: async (id) => {
          handleSelectRow(id);
          await handleSetAtendido({ id, atendido: 1 });
          await handleCargarTurnos({fecha: diaSeleccionado})
        },
        condition: {
          field: "ATENDIDO",
          value: "No",
          oper: "=",
        },
      },
      {
        icon: "cancel",
        title: "No Atendido",
        func: async (id) => {
          handleSelectRow(id);
          await handleSetAtendido({ id, atendido: 0 });
          await handleCargarTurnos({fecha: diaSeleccionado})
        },
        condition: {
          field: "ATENDIDO",
          value: "Si",
          oper: "=",
        },
      },
    ],
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          className="text-sm text-gray-600 cursor-pointer hover:text-gray-900"
          onClick={() => cambiarMes(-1)}
        >
          ← Mes anterior
        </button>
        <h2 className="text-lg font-bold">{mesActual.format("MMMM YYYY")}</h2>
        <button className="text-sm text-gray-600 cursor-pointer hover:text-gray-900" onClick={() => cambiarMes(1)}>
          Mes siguiente →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((dia) => (
          <div key={dia} className="font-bold text-gray-500">
            {dia}
          </div>
        ))}
        {diasDelMes().map((dia) => {
          const fechaStr = dia.format("YYYY-MM-DD");
          const esHoy = dia.isSame(dayjs(), "day");
          const tieneTurnos = turnosPorDia(dia).length > 0;
          const esOtroMes = !dia.isSame(mesActual, "month");

          return (
            <div
              key={fechaStr}
              id={fechaStr}
              className={`rounded-md p-2 cursor-pointer border transition-all
                ${esOtroMes ? "bg-gray-100 text-gray-400" : ""}
                ${esHoy ? "border-blue-500" : "border-transparent"}
                ${
                  tieneTurnos
                    ? "bg-[var(--button-danger)] hover:bg-[var(--button-danger-hover)] text-white"
                    : "hover:bg-gray-200"
                }
              `}
              onClick={() => {  
                handleCargarTurnos({fecha: fechaStr})
                setShowTurnosModal(true)
                setDiaSeleccionado(fechaStr)}
              }
            >
              {dia.date()}
            </div>
          );
        })}
      </div>
{/* 
      {diaSeleccionado && (
 
      )} */}

            {
        // Modal para modificar turno de turno
        showTurnosModal && (
          <Modal
            isOpen={showTurnosModal}
            onClose={() => setShowTurnosModal(false)}
            title={`Turnos del ${dayjs(diaSeleccionado).format('dddd DD [de] MMMM')}`}
            size={"full"}
          >
       <div className="rounded-md bg-white shadow">
          <Card>
            <section className="flex flex-col gap-3 ">
              <div className="flex flex-row items-center gap-4 flex-wrap">
                <Input
                  name="paciente"
                  type="text"
                  placeholder="Nombre y Apellido"
                  onChange={(e) =>
                    handleSearchParams({
                      field: "paciente",
                      value: e.target.value,
                    })
                  }
                />
                <Input
                  name="telefono"
                  type="text"
                  placeholder="Teléfono"
                  onChange={(e) =>
                    handleSearchParams({
                      field: "telefono",
                      value: e.target.value,
                    })
                  }
                />
                <Button
                  title="Buscar"
                  className="rounded-2xl"
                  onClick={() => {
                    setIsLoadingTable(true);
                  }}
                />
              </div>
              <div className="flex flex-row items-center gap-4">
                <Button
                  title="Agregar Turno"
                  className="rounded-2xl"
                  onClick={() => {
                    setShowTurnoModal(true);
                    setTurnoSelected({});
                  }}
                />
              </div>
            </section>
          </Card>
          <Table
            data={listTurnos}
            pagination={turnosPagination}
            loading={isLoadingTable}
            options={tableOptions}
            selectedFunction={handleSelectRow}
          />
        </div>
          </Modal>
        )
        // Fin del modal
      }
      {
        // Modal para modificar turno de turno
        showTurnoModal && (
          <Modal
            isOpen={showTurnoModal}
            onClose={() => setShowTurnoModal(false)}
            title={nvl(turnoSelected?.ID) ? "Modificar turno" : "Agregar turno"}
          >
            <ModalNuevoTurno
              setShowModal={setShowTurnoModal}
              turno={nvl(turnoSelected?.ID) ? turnoSelected : {FECHA: diaSeleccionado}}
              refresh={ async () => {
                setIsLoadingTable(true);
                await handleCargarTurnos({fecha: diaSeleccionado})
                setShowTurnoModal(false);
              }}
            />
          </Modal>
        )
        // Fin del modal
      }

      {showConfirmacionDelete && (
        <ConfirmDialog
          open={showConfirmacionDelete}
          onCancel={() => setShowConfirmacionDelete(false)}
          onConfirm={ async () => {
            setShowConfirmacionDelete(false);
            await handleDeleteTurno({ id: turnoSelected?.ID });
            await handleCargarTurnos({fecha: diaSeleccionado})
          }}
          title={`¿Eliminar al turno ${turnoSelected?.NOMBRE} ${turnoSelected?.APELLIDO}?`}
          message="Esta acción no se puede deshacer."
          variant="danger"
        />
      )}
    </div>
  );
};

export default CalendarioTurnos;
