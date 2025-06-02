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
  deletePaciente,
  getObrasSociales,
  getPacientes,
  reactivePaciente,
} from "../services/services";
import { findInObject, nvl } from "@/utilities";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

const Pacientes = () => {
  const pacientesPagination = usePagination();
  const [listPacientes, setListPacientes] = useState([]);
  const [showPacienteModal, setShowPacienteModal] = useState(false);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [pacienteSelected, setPacienteSelected] = useState(0);

  const obrasSocialesPagination = usePagination();
  const [listObrasSociales, setObrasSociales] = useState([]);
  const [isLoadingLookUpOS, setIsLoadingLookUpOS] = useState(false);
  const [searchObraSocial, setSearchObraSocial] = useState("");
  const [searchParams, setSearchParams] = useState({estado: 1});

  const [showConfirmacionDelete, setShowConfirmacionDelete] = useState(false);
  const [showConfirmacionReactive, setShowConfirmacionReactive] =
    useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    Promise.all([
      getPacientes({ page: 1, pageSize: 10, paramsFilter: searchParams }),
    ]).then((res) => {
      const [resPaciente] = res;

      pacientesPagination.asignarCountPage(
        resPaciente?.request?.meta?.totalPages || 0
      );
      pacientesPagination.asignarCountRecords(
        resPaciente?.request?.meta?.total || 0
      );
      pacientesPagination.asignarCountRows(5);
      setListPacientes(resPaciente?.request?.datos);
      setIsLoadingTable(false);
    });
  }, [isLoadingTable]);

  useEffect(() => {
    Promise.all([
      getObrasSociales({
        page: obrasSocialesPagination.actualPage,
        pageSize: obrasSocialesPagination.countRows,
        paramsFilter: { ABREV: searchObraSocial },
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

  const handleSearchParams = ({ field, value }) => {
    setSearchParams({ ...searchParams, [field]: value });
  };
  const handleDeletePaciente = async ({ id }) => {
    const request = await deletePaciente({ id });
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
      title: `Paciente ${pacienteSelected?.NOMBRE} ${pacienteSelected?.APELLIDO}`,
      message: "Eliminado correctamente",
      type: "success",
      duration: 3000,
    });
    setIsLoadingTable(true);
  };

  const handleReactivePaciente = async ({ id }) => {
    const request = await reactivePaciente({ id }); 
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
      title: `Paciente ${pacienteSelected?.NOMBRE} ${pacienteSelected?.APELLIDO}`,
      message: "Reactivado correctamente",
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
          setShowPacienteModal(true);
          const paciente = findInObject(listPacientes, id, "ID");
          setPacienteSelected(paciente);
        },
      },
      {
        icon: "trash",
        title: "Eliminar",
        func: (id) => {
          setShowConfirmacionDelete(true);
          const paciente = findInObject(listPacientes, id, "ID");
          setPacienteSelected(paciente);
        },
        condition: {
          field: "ESTADO",
          value: "Activo",
          oper: "=",
        },
      },
      {
        icon: "refresh",
        title: "Reactivar",
        func: (id) => {
          setShowConfirmacionReactive(true);
          const paciente = findInObject(listPacientes, id, "ID");
          setPacienteSelected(paciente);
        },
        condition: {
          field: "ESTADO",
          value: "Inactivo",
          oper: "=",
        },
      },
    ],
  };

  const tableOptions2 = {
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
    <div className="flex flex-col gap-4 p-4 w-full">
      <TitleContent
        title="Panel de Pacientes"
        subtitle="Aquí puedes ver cada uno de los pacientes. Puedes agregar, editar o eliminar pacientes."
      />
      {/* Filtros */}
      <Card>
        <section className="flex flex-col gap-3 ">
          <div className="flex flex-row items-center gap-4">
            <Input
              name="paciente"
              type="text"
              placeholder="Nombre y Apellido"
              onChange={(e) =>
                handleSearchParams({ field: "paciente", value: e.target.value })
              }
            />

            <LookupField
              data={listObrasSociales}
              displayField="DESCRIPCION"
              label="Obras Sociales"
              loading={isLoadingLookUpOS}
              onSelect={(row) =>
                handleSearchParams({ field: "obraSocial", value: row })
              }
              onSearch={(item) => setSearchObraSocial(item)}
              options={tableOptions2}
              pagination={obrasSocialesPagination}
              hideLabel
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
              title="Agregar Paciente"
              className="rounded-2xl"
              onClick={() => {
                setShowPacienteModal(true);
                setPacienteSelected({});
              }}
            />
          </div>
        </section>
      </Card>
      <div className="flex flex-col gap-4">
        {/* Contentido */}
        <Table
          data={listPacientes}
          pagination={pacientesPagination}
          loading={isLoadingTable}
          options={tableOptions}
        />
        <div className="gap-4 w-full"></div>
      </div>
      {
        // Modal para modificar turno de paciente
        showPacienteModal && (
          <Modal
            isOpen={showPacienteModal}
            onClose={() => setShowPacienteModal(false)}
            title={
              nvl(pacienteSelected?.ID)
                ? "Modificar paciente"
                : "Agregar paciente"
            }
          >
            <ModalNewUser
              setShowModal={setShowPacienteModal}
              paciente={pacienteSelected}
              refresh={() => {
                setIsLoadingTable(true);
                setShowPacienteModal(false);
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
            handleDeletePaciente({ id: pacienteSelected?.ID });
          }}
          title={`¿Eliminar al paciente ${pacienteSelected?.NOMBRE} ${pacienteSelected?.APELLIDO}?`}
          message="Esta acción no se puede deshacer."
          variant="danger"
        />
      )}
      {showConfirmacionReactive && (
        <ConfirmDialog
          open={showConfirmacionReactive}
          onCancel={() => setShowConfirmacionReactive(false)}
          onConfirm={() => {
            setShowConfirmacionReactive(false);
            handleReactivePaciente({ id: pacienteSelected?.ID });
          }}
          title={`Reactivar al paciente ${pacienteSelected?.NOMBRE} ${pacienteSelected?.APELLIDO}?`}
          message="Esta acción no se puede deshacer."
          variant="danger"
        />
      )}
    </div>
  );
};

export default Pacientes;
