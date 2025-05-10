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

const Pacientes = () => {
  const pacientesPagination = usePagination();
  const [showPacienteModal, setShowPacienteModal] = useState(false);
  const [isLoadingTable, setIsLoadingTable] = useState(false);

  useEffect(() => {
    pacientesPagination.asignarCountPage(10);
    pacientesPagination.asignarCountRecords(100);
    pacientesPagination.asignarCountRows(5);
    setIsLoadingTable(false);
  }, [pacientesPagination.actualPage, isLoadingTable]);

  const listPacientes = {
    data: [
      {
        id: 1,
        name: "Juan Perez",
        phone: "123456789",
        insurance: "OSDE",
      },
      {
        id: 2,
        name: "Maria Gomez",
        phone: "987654321",
        insurance: "Galeno",
      },
      {
        id: 3,
        name: "Pedro Martinez",
        phone: "456789123",
        insurance: "Sancor",
      },
    ],
  };

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
            <div className="flex flex-col gap-4">
              <form className="flex flex-col gap-4">
                <label htmlFor="paciente">Paciente</label>
                <input
                  type="text"
                  id="paciente"
                  name="paciente"
                  className="border border-gray-300 rounded-lg p-2"
                />
                <label htmlFor="fecha">Fecha</label>
                <input
                  type="date"
                  id="fecha"
                  name="fecha"
                  className="border border-gray-300 rounded-lg p-2"
                />
                <button
                  type="submit"
                  className="bg-[var(--accent)] text-white rounded-lg p-2"
                >
                  Guardar
                </button>
              </form>
            </div>
          </Modal>
        )
        // Fin del modal
      }
    </div>
  );
};

export default Pacientes;
