import { useEffect, useState } from "react";
import {
  Card,
  TitleContent,
  TableV2 as Table,
  Modal,
  Input,
  Button,
} from "@/components/ui";
import usePagination from "@/hooks/usePagination";
import ModalNewUser from "@/components/users/ModalNewUser";
import { getPacientes } from "../services/services";

const Pacientes = () => {
  const pacientesPagination = usePagination();
  const [listPacientes, setListPacientes] = useState([])
  const [showPacienteModal, setShowPacienteModal] = useState(false);
  const [isLoadingTable, setIsLoadingTable] = useState(false);

  useEffect(() => {
    Promise.all([getPacientes({ page: 1, pageSize: 10 })]).then((res) => {
      const [resPaciente] = res;
      pacientesPagination.asignarCountPage(resPaciente?.request?.meta?.totalPages || 0);
      pacientesPagination.asignarCountRecords(resPaciente?.request?.meta?.total || 0);
      pacientesPagination.asignarCountRows(5);
      setListPacientes(resPaciente?.request?.datos)
      setIsLoadingTable(false);
    });
  }, [isLoadingTable]);

  // const listPacientes = {
  //   data: [
  //     {
  //       id: 1,
  //       name: "Juan Perez",
  //       phone: "123456789",
  //       insurance: "OSDE",
  //     },
  //     {
  //       id: 2,
  //       name: "Maria Gomez",
  //       phone: "987654321",
  //       insurance: "Galeno",
  //     },
  //     {
  //       id: 3,
  //       name: "Pedro Martinez",
  //       phone: "456789123",
  //       insurance: "Sancor",
  //     },
  //   ],
  // };

  const tableOptions = {
    hidden: ["id"],
    idTable: "id",
    th: {
      id: { label: "Código", width: "auto" },
      name: { label: "Nombre", width: "auto" },
      phone: { label: "Teléfono", width: "auto" },
      insurance: { label: "Obra Social", width: "auto" },
    },
    actions: [
      {
        icon: "edit",
        title: "Editar",
        func: () => {
          setShowPacienteModal(true);
        },
      },
      {
        icon: "trash",
        title: "Eliminar",
        func: (id) => {
          alert(`Esta apunto de eliminar a ${id}`);
        },
      },
    ],
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
            />
            <Input type="text" placeholder="Obra Social" />
            <Button
              title="Buscar"
              className="rounded-2xl"
              onClick={() => setIsLoadingTable(true)}
            />
          </div>
          <div className="flex flex-row items-center gap-4">
            <Button
              title="Agregar Paciente"
              className="rounded-2xl"
              onClick={() => setShowPacienteModal(true)}
            />
          </div>
        </section>
      </Card>
      <div className="flex flex-col gap-4">
        {/* Contentido */}
        <Table
          data={listPacientes.data}
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
            title="Modificar Turno"
          >
            <ModalNewUser setShowModal={setShowPacienteModal} />
          </Modal>
        )
        // Fin del modal
      }
    </div>
  );
};

export default Pacientes;
