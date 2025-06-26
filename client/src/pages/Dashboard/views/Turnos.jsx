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

import ModalNuevoTurno from "@/components/turnos/ModalNuevoTurno";

import ConfirmDialog from "@/components/ui/ConfirmDialog";
import CalendarioTurnos from "@/components/turnos/CalendarioTurnos";
import { useState } from "react";
import ModalSearhTurnos from "@/components/turnos/ModalSearchTurno";

const Turnos = () => {
  const [showTurnoModal, setShowTurnoModal] = useState(false);
  const [refreshCalendario, setRefreshCalendario] = useState(false);
  const [showTablaTurnos, setShowTablaTurnos] = useState(false);

  return (
    <div className="flex flex-col gap-4 p-4 w-full">
      <TitleContent
        title="Panel de Turnos"
        subtitle="Aquí puedes ver cada uno de los turnos. Puedes agregar, editar o eliminar turnos."
      />
      {/* Filtros */}
      <section className="flex flex-col gap-3 ">
        <div className="flex flex-row items-center gap-4">
          <Button
            title="Agregar Turno"
            className="rounded-2xl"
            onClick={() => {
              setShowTurnoModal(true);
            }}
          />
          <Button
            title="Buscar turno"
            className="rounded-2xl"
            onClick={() => {
              setShowTablaTurnos(true);
            }}
          />
        </div>
      </section>
      <div className="flex flex-col gap-4">
        <CalendarioTurnos refresh={refreshCalendario}></CalendarioTurnos>
        <div className="gap-4 w-full"></div>
      </div>
      {
        // Modal para modificar turno de turno
        showTurnoModal && (
          <Modal
            isOpen={showTurnoModal}
            onClose={() => setShowTurnoModal(false)}
            title={"Agregar turno"}
            size={"lg"}
          >
            <ModalNuevoTurno
              setShowModal={setShowTurnoModal}
              refresh={() => {
                setShowTurnoModal(false);
                setRefreshCalendario(!refreshCalendario);
              }}
            />
          </Modal>
        )
        // Fin del modal
      }
      {showTablaTurnos ? (
        <Modal
          isOpen={showTablaTurnos}
          onClose={() => setShowTablaTurnos(false)}
          title={"Turnos"}
          size={"lg"}
        >
          <ModalSearhTurnos/>
        </Modal>
      ) : null}
    </div>
  );
};

export default Turnos;
