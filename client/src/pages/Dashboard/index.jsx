// import { getServices } from "../services/services.js";
import { useEffect, useState } from "react";
import {Card ,TitleContent ,TableV2 as Table ,Modal } from "@/components/ui";
import usePagination from "@/hooks/usePagination";
// import "@/assets/css/Dashboard.css";

const Index = () => {
  const pacientesPagination = usePagination();
  const [showPacienteModal, setShowPacienteModal] = useState(false);

  useEffect(() => {
    pacientesPagination.asignarCountPage(10);
    pacientesPagination.asignarCountRecords(100);
    pacientesPagination.asignarCountRows(5);
  });

  const listPacientes = {
    data: [
      {
        id: 1,
        atentido: 'No',
        name: "Juan Perez",
        phone: "123456789",
        insurance: "OSDE",
        date: "2023-10-01",

      },
      {
        id: 2,
        atentido: 'No',
        name: "Maria Gomez",
        phone: "987654321",
        insurance: "Galeno",
        date: "2023-10-02",

      },
      {
        id: 3,
        atentido: 'Si',
        name: "Pedro Martinez",
        phone: "456789123",
        insurance: "Sancor",
        date: "2023-10-03",
        
      },
    ],
  };

  /** Sirve para agregar una clase a un registro en base a un valor de un campo  */
  const classConditionsOptions = [
    {
      value: "Si",
      field: "atentido",
      class: "bg-green-200",
      oper: "=",
    },
    {
      value: "No",
      field: "atentido",
      class: "bg-red-200",
      oper: "=",
    }
  ];

  const tableOptions = {
    hidden: ['id'],
    idTable: "id",
    th: {
      id: { label: 'Código', width: '5px' },
      atentido: { label: 'Antendido', width: '50px' },
      name: { label: 'Nombre', width: '200px' },
      phone: { label: 'Teléfono', width: '150px' },
      insurance: { label: 'Obra Social', width: '180px' },
      date: { label: 'Fecha', width: '120px' },
    },
    classConditions: classConditionsOptions,
    actions: [
      {
        icon: 'check',
        title: "Atendido",
        func: (id) => { alert('Marcar como antendido a '+ id) },
        condition: {
          field: "atentido",
          value: "No",
          oper: "=",
        },
      },
      {
        icon: 'cancel',
        title: "No Atendido",
        func: (id) => { alert('Marcar como no antendido a '+ id) },
        condition: {
          field: "atentido",
          value: "Si",
          oper: "=",
        },
      },
    ],
  }

  return (
    <div className="flex flex-col gap-4 p-4 w-full">
      <TitleContent
        title="Panel principal"
        subtitle="Aquí puedes ver un resumen de los turnos y pacientes."
      />
      {/* Estadisticas */}
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1 max-lg:grid-cols-2 max-md:gap-2 max-sm:p-4">
          <Card title={"Total Pacientes"}>
            <div className="flex flex-col">
              <span className="text-4xl max-sm:text-2xl  font-semibold text-[var(--accent)]">
                30
              </span>
              <span className=""> + 3 más que el mes pasado.</span>
            </div>
          </Card>
          <Card title={"Turnos de hoy"}>
            <div className="flex flex-col">
              <span className="text-4xl max-sm:text-2xl font-semibold text-[var(--accent)]">
                5
              </span>
              <span className=""> 1 pendiente</span>
            </div>
          </Card>
        </div>
        {/* Contentido */}
        <Table
          data={listPacientes.data}
          pagination={pacientesPagination}
          loading={false}
          options = {tableOptions}
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

export default Index;
