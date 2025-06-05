import { useEffect, useState } from "react";
import {
  Card,
  TitleContent,
  Table,
  Modal,
  Input,
  Button,
  Select,
  LookupField,
} from "@/components/ui";
import usePagination from "@/hooks/usePagination";
import { useToast } from "@/hooks/useToast"; // asumimos que tenés este hook
import ModalNewUser from "@/components/users/ModalNewUser";
import {
  deleteTurno,
  getTurnos,
} from "../services/services";
import { findInObject, nvl } from "@/utilities";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

const Turnos = () => {
  const turnosPagination = usePagination();
  const [listTurnos, setListTurnos] = useState([]);
  const [showTurnoModal, setShowTurnoModal] = useState(false);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [turnoSelected, setTurnoSelected] = useState(0);

  const [searchParams, setSearchParams] = useState({estado: 1});

  const [showConfirmacionDelete, setShowConfirmacionDelete] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    Promise.all([
      getTurnos({ page: 1, pageSize: 10, paramsFilter: searchParams }),
    ]).then((res) => {
      const [resTurno] = res;

      turnosPagination.asignarCountPage(
        resTurno?.request?.meta?.totalPages || 0
      );
      turnosPagination.asignarCountRecords(
        resTurno?.request?.meta?.total || 0
      );
      turnosPagination.asignarCountRows(5);
      setListTurnos(resTurno?.request?.datos);
      setIsLoadingTable(false);
    });
  }, [isLoadingTable, turnosPagination.actualPage]);


  const handleSearchParams = ({ field, value }) => {
    setSearchParams({ ...searchParams, [field]: value });
  };

  const handleDeleteTurno = async ({ id }) => {
    const request = await deleteTurno({ id });
    console.log(request);
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

  const classConditionsOptions = [
    {
      value: "Activo",
      field: "ESTADO",
      class: "bg-green-200",
      oper: "=",
    },
    {
      value: "Inactivo",
      field: "ESTADO",
      class: "bg-red-200",
      oper: "=",
    },
  ];

  const tableOptions = {
    hidden: ["OS"],
    idTable: "ID",
    th: {
      ID: { label: "Código", width: "50px" },
      ESTADO: { label: "Estado", width: "50px" },
      NOMBRE: { label: "Nombre", width: "auto" },
      APELLIDO: { label: "Apellido", with: "auto" },
      TELEFONO: { label: "Teléfono", width: "auto" },
      OBRA_SOCIAL: { label: "Obra Social", width: "auto" },
      OS: { label: "OS_CODE", width: "auto" },
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
        condition: {
          field: "ESTADO",
          value: "Activo",
          oper: "=",
        },
      },
    ],
  };

  return (
    <div className="flex flex-col gap-4 p-4 w-full">
      <TitleContent
        title="Panel de Turnos"
        subtitle="Aquí puedes ver cada uno de los turnos. Puedes agregar, editar o eliminar turnos."
      />
      {/* Filtros */}
      <Card>
        <section className="flex flex-col gap-3 ">
          <div className="flex flex-row items-center gap-4">
            <Input
              name="turno"
              type="text"
              placeholder="Nombre y Apellido"
              onChange={(e) =>
                handleSearchParams({ field: "turno", value: e.target.value })
              }
            />

            <Select
              name={"estado"}
              items={[
                { value: 1, name: "Activo" },
                { value: 0, name: "Inactivo" },
              ]}
              value={searchParams?.estado || ''}
              placeholder="Selec. estado"
              onChange={(e) =>
                handleSearchParams({ field: "estado", value: e.target.value })
              }
            />

            <Button
              title="Buscar"
              className="rounded-2xl"
              onClick={() => {
                console.log(searchParams);
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
      <div className="flex flex-col gap-4">
        {/* Contentido */}
        <Table
          data={listTurnos}
          pagination={turnosPagination}
          loading={isLoadingTable}
          options={tableOptions}
        />
        <div className="gap-4 w-full"></div>
      </div>
      {
        // Modal para modificar turno de turno
        showTurnoModal && (
          <Modal
            isOpen={showTurnoModal}
            onClose={() => setShowTurnoModal(false)}
            title={
              nvl(turnoSelected?.ID)
                ? "Modificar turno"
                : "Agregar turno"
            }
          >
            <ModalNewUser
              setShowModal={setShowTurnoModal}
              turno={turnoSelected}
              refresh={() => {
                setIsLoadingTable(true);
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
          onConfirm={() => {
            setShowConfirmacionDelete(false);
            handleDeleteTurno({ id: turnoSelected?.ID });
          }}
          title={`¿Eliminar al turno ${turnoSelected?.NOMBRE} ${turnoSelected?.APELLIDO}?`}
          message="Esta acción no se puede deshacer."
          variant="danger"
        />
      )}
    </div>
  );
};

export default Turnos;
