import { useEffect, useState } from "react";
import {
  Button,
  Tooltip,
  Card,
  TitleContent,
  Table,
  Modal,
  Input,
  Dropdown,
} from "@/components/ui";
import usePagination from "@/hooks/usePagination"; // asumimos que tenés este hook
import { useToast } from "@/hooks/useToast"; // asumimos que tenés este hook

const pacientes = [
  {
    id: 1,
    name: "Juan Perez",
    phone: "123456789",
    insurance: "OSDE",
    date: "2023-10-01",
  },
  {
    id: 2,
    name: "Maria Gomez",
    phone: "987654321",
    insurance: "Galeno",
    date: "2023-10-02",
  },
  {
    id: 3,
    name: "Pedro Martinez",
    phone: "456789123",
    insurance: "Sancor",
    date: "2023-10-03",
  },
  {
    id: 4,
    name: "Ana Torres",
    phone: "123123123",
    insurance: "Swiss Medical",
    date: "2023-10-04",
  },
  {
    id: 5,
    name: "Luis Benitez",
    phone: "321321321",
    insurance: "Medife",
    date: "2023-10-05",
  },
];

export default function Playground() {
  const [modalOpen, setModalOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const pacientesPagination = usePagination();
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    pacientesPagination.asignarCountPage(10);
    pacientesPagination.asignarCountRecords(100);
    pacientesPagination.asignarCountRows(5);
  });

  const { showToast } = useToast();
  const handleToast = ({ typeVar = "success" }) => {
    showToast({
      title: "Titulo de la notificación",
      message: "Descripción de la notificación",
      type: typeVar, // success, error, info
      duration: 3000,
    });
  };

  return (
    <div className="p-8  py-5">
      <h1 className="text-2xl font-bold mb-6">🎨 Playground de Componentes</h1>

      {/* Tooltip + Button */}
      <section className="rounded-lg bg-gray-200 p-4 shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-2">Tooltip + Botón</h2>
        <Tooltip text="Este es un botón con tooltip">
          <div className="flex flex-row gap-4">
            <Button
              onClick={() => alert("Hiciste click")}
              title="Botón de prueba"
            />
            <Button
              variant={"warning"}
              onClick={() => alert("Hiciste click")}
              title="Botón de Waring"
            />
            <Button
              variant={"danger"}
              onClick={() => alert("Hiciste click")}
              title="Botón de Danger"
            />
          </div>
        </Tooltip>
      </section>

      {/* Modal */}
      <section className="rounded-lg bg-gray-200 p-4 shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-2">Modal</h2>
        <Button title="Abrir Modal" onClick={() => setModalOpen(true)} />

        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Formulario de ejemplo"
        >
          <form className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Nombre</label>
              <input
                type="text"
                className="w-full border border-[var(--muted)] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Teléfono</label>
              <input
                type="tel"
                className="w-full border border-[var(--muted)] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button title="Guardar" onClick={() => setModalOpen(false)} />
              <Button
                title="Cancelar"
                variant="danger"
                onClick={() => setModalOpen(false)}
              />
            </div>
          </form>
        </Modal>
      </section>

      {/* Input */}
      <section className="rounded-lg bg-gray-200 p-4 shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-2">Inputs</h2>
        <div className="max-w-md space-y-4">
          <Input
            label="Nombre"
            name="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Juan Pérez"
          />

          <Input
            label="Teléfono"
            name="telefono"
            type="tel"
            placeholder="123456789"
          />
        </div>
      </section>

      <section className="rounded-lg bg-gray-200 p-4 shadow-md mb-6">
        <h1 className="text-2xl font-bold">🧪 Tabla de Pacientes</h1>
        <Table
          data={pacientes}
          pagination={pacientesPagination}
          options={{
            idTable: "id",
            th: {
              name: { label: "Nombre", width: "200px" },
              phone: { label: "Teléfono", width: "150px" },
              insurance: { label: "Obra Social", width: "180px" },
              date: { label: "Fecha", width: "120px" },
            },
            classConditions: [],
            actions: [
              {
                icon: "edit",
                title: "Editar",
                func: (id) => {
                  alert(id);
                },
              },
              {
                icon: "trash",
                title: "Eliminar",
                func: (id) => {
                  alert(id);
                },
              },
            ],
          }}
          selectedFunction={(id) => setSelected(id)}
          checkSelect={{ activate: true, initialState: false }}
        />
        {selected && <p className="text-sm">Seleccionado ID: {selected}</p>}
      </section>

      <section className="rounded-lg bg-gray-200 p-4 shadow-md mb-6">
        <Dropdown
          trigger={
            <span className="font-medium text-[var(--accent)]">Augusto 👤</span>
          }
        >
          <button className="w-full text-left px-4 py-2 hover:bg-[var(--gray)]">
            Modificar perfil
          </button>
          <button className="w-full text-left px-4 py-2 hover:bg-[var(--gray)] text-[var(--button-danger)]">
            Cerrar sesión
          </button>
        </Dropdown>
      </section>
      <section className="rounded-lg bg-gray-200 p-4 shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-2">Toast</h2>
        <p className="text-sm mb-2">
          Los Toasts se muestran en la parte superior derecha de la pantalla.
          Puedes personalizar su posición y duración.
        </p>
        <div className="flex flex-row gap-4">
          <Button title="Mostrar Toast" onClick={handleToast} />
          <Button
            title="Mostrar Toast Warning"
            onClick={() => handleToast({ typeVar: "warn" })}
          />
          <Button
            title="Mostrar Toast Error"
            onClick={() => handleToast({ typeVar: "error" })}
          />
          <Button
            title="Mostrar Toast Info"
            onClick={() => handleToast({ typeVar: "info" })}
          />
        </div>
      </section>
    </div>
  );
}
