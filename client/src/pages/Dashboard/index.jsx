import { useEffect, useState } from "react";
import {
  Card,
  TitleContent,
  Table as Table,
  Modal,
  Button,
} from "@/components/ui";
import usePagination from "@/hooks/usePagination";
import useSession from "@/hooks/useSession";
import {
  getStats,
  getTurnos,
  sendNotification,
  setTurnoAtendido,
} from "./services/turnos.services";
import { useToast } from "@/hooks/useToast"; // asumimos que tenés este hook
import { findInObject } from "@/utilities";
import dayjs from "dayjs";
dayjs.locale("es");

const Index = () => {
  useSession();
  const [turnos, setTurnos] = useState([]);
  const turnosPagination = usePagination();
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [stats, setStats] = useState({
    cantPacientes: 0,
    cantidadNuevos: 0,
    cantidadTurnos: 0,
    cantidadTurnosPend: 0,
  });
  const { showToast } = useToast();
  const fechaActual = dayjs();

  useEffect(() => {
    // page: paginationForms?.actualPage ?? 1, limit: parseInt(paginationForms?.countRows) ?? 10,
    Promise.all([
      getTurnos({
        page: turnosPagination.actualPage,
        pageSize: turnosPagination.countRows,
        paramsFilter: { fecha: fechaActual.format("YYYY-MM-DD") },
      }),
    ]).then((res) => {
      const [resTurno] = res;
      const { datos, meta } = resTurno.request;
      setTurnos(datos || []);
      turnosPagination.asignarCountPage(meta?.totalPages || 0);
      turnosPagination.asignarCountRecords(meta?.total || 0);
      turnosPagination.asignarCountRows(5);
      setIsLoadingTable(false);
    });
  }, [isLoadingTable, turnosPagination.actualPage, turnosPagination.countRows]);

  useEffect(() => {
    // page: paginationForms?.actualPage ?? 1, limit: parseInt(paginationForms?.countRows) ?? 10,
    Promise.all([getStats()]).then((res) => {
      const [resStats] = res;
      setStats(resStats.request);
    });
  }, [isLoadingTable]);

  const handleNotifications = async () => {
    const request = await sendNotification();
    if (request.error) {
      showToast({
        title: "Error",
        message: request.message,
        type: "error",
        duration: 3000,
      });
      return;
    }

    const { request: avisos } = request;
    let confirmados = "";

    avisos.map((item, index) => {
      const { value } = item;
      if (item.status === "fulfilled")
        confirmados += `• ${value.name} ${
          avisos.length === index + 1 ? "" : `\n`
        }`;
    });

    showToast({
      title: `Notificado a:`,
      message: confirmados,
      type: "success",
      duration: 3000,
    });
  };

  const handleSetAtendido = async ({ id, atendido }) => {
    const turno = findInObject(turnos, id, "ID");
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

  /** Sirve para agregar una clase a un registro en base a un valor de un campo  */
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
      HORA: { label: "Hora", width: "auto" },
      TELEFONO: { label: "Teléfono", width: "auto" },
      OBRA_SOCIAL: { label: "Obra Social", width: "auto" },
      OS: { label: "OS_CODE", width: "auto" },
      PACIENTE: { label: "", with: "auto" },
    },
    classConditions: classConditionsOptions,
    actions: [
      {
        icon: "check",
        title: "Atendido",
        func: async (id) => {
          await handleSetAtendido({ id, atendido: 1 });
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
          await handleSetAtendido({ id, atendido: 0 });
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
    <div className="flex flex-col gap-4 p-4 w-full">
      <TitleContent
        title="Panel principal"
        subtitle="Aquí puedes ver un resumen de los turnos y pacientes."
      />
      {/* Estadisticas */}
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1 max-lg:grid-cols-3 max-md:gap-2 max-sm:p-4">
          <Card title={"Total Pacientes"}>
            <div className="flex flex-col">
              <span className="text-4xl max-sm:text-2xl  font-semibold text-[var(--accent)]">
                {stats.cantPacientes}
              </span>
              <span className="">
                {" "}
                + {stats.cantidadNuevos} más que el mes pasado.
              </span>
            </div>
          </Card>
          <Card title={"Turnos de hoy"}>
            <div className="flex flex-col">
              <span className="text-4xl max-sm:text-2xl font-semibold text-[var(--accent)]">
                {stats.cantidadTurnos}
              </span>
              <span className=""> {stats.cantidadTurnosPend} pendiente</span>
            </div>
          </Card>
          <Card title={"Avisos"}>
            <div className="flex flex-col justify-center items-center">
              <Button
                // title="Enviar recordatorios"
                className={"w-20"}
                icon={"paper-plane"}
                onClick={handleNotifications}
              />
              <span className="text-gray-500">
                Recordar a pacientes de turnos para mañana
              </span>
            </div>
          </Card>
        </div>
        {/* Contentido */}
        <Table
          data={turnos}
          pagination={turnosPagination}
          loading={false}
          options={tableOptions}
        />
        <div className="gap-4 w-full"></div>
      </div>
    </div>
  );
};

export default Index;
