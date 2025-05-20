import { useEffect, useState } from "react";
import {
  Card,
  TitleContent,
  Table,
  Modal,
  Input,
  Button,
  Dropdown,
  LookupField,
} from "@/components/ui";
import usePagination from "@/hooks/usePagination";
import ModalNewUser from "@/components/users/ModalNewUser";
import { getObrasSociales, getPacientes } from "../services/services";
import { findInObject, nvl } from "@/utilities";

const Pacientes = () => {
  const pacientesPagination = usePagination();
  const [listPacientes, setListPacientes] = useState([]);
  const [showPacienteModal, setShowPacienteModal] = useState(false);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [pacienteSelected, setPacienteSelected] = useState(0)
  
  const obrasSocialesPagination = usePagination();
  const [listObrasSociales, setObrasSociales] = useState([]);
  const [isLoadingLookUpOS, setIsLoadingLookUpOS] = useState(false);
  const [searchObraSocial, setSearchObraSocial] = useState('')

  useEffect(() => {
    Promise.all([
      getPacientes({ page: 1, pageSize: 10 }),
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

  useEffect( () =>{
        Promise.all([
      getObrasSociales({
        page: obrasSocialesPagination.actualPage,
        pageSize: obrasSocialesPagination.countRows,
        paramsFilter: [{ field: 'DESCRIPCION', value: searchObraSocial }]
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
  }, [obrasSocialesPagination.actualPage, obrasSocialesPagination.countRows, searchObraSocial])
/*
	id_cliente ID, 
    nombre_personas NOMBRE, 
    apellido_personas APELLIDO, 
    telefono_cliente TELEFONO, 
    os_abreviatura OBRA_SOCIAL

*/
  const tableOptions = {
    hidden: ['OS'],
    idTable: "ID",
    th: {
      ID: { label: "Código", width: "auto" },
      NOMBRE: { label: "Nombre", width: "auto" },
      APELLIDO:{ label: "Apellido", with: "auto"},
      TELEFONO: { label: "Teléfono", width: "auto" },
      OBRA_SOCIAL: { label: "Obra Social", width: "auto" },
      OS: { label: "OS_CODE", width: "auto" },
    },
    actions: [
      {
        icon: "edit",
        title: "Editar",
        func: (id) => {
          setShowPacienteModal(true);
          const paciente = findInObject(listPacientes, id, "ID") 
          setPacienteSelected(paciente)
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
            />
            <Input type="text" placeholder="Obra Social" />

            <LookupField
              data={listObrasSociales}
              displayField="DESCRIPCION"
              label="Obras Sociales"
              loading={isLoadingLookUpOS}
              onSelect={(row) => console.log(row)}
              onSearch={(item) => setSearchObraSocial(item)}
              options={tableOptions2}
              pagination={obrasSocialesPagination}
              hideLabel
            />

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
              onClick={() => {setShowPacienteModal(true); setPacienteSelected({})}}
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
            title={ nvl(pacienteSelected?.ID)? "Modificar paciente" : "Agregar paciente"}
          >
            <ModalNewUser setShowModal={setShowPacienteModal} paciente={pacienteSelected} refresh={
              () => {setIsLoadingTable(true); setShowPacienteModal(false)}
            } />
          </Modal>
        )
        // Fin del modal
      }
    </div>
  );
};

export default Pacientes;
