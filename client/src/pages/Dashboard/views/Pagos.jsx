import { useEffect, useState } from "react";
import {
  Card,
  TitleContent,
  Table,
  Modal,
  Input,
  Button,
  Select,
} from "@/components/ui";
import usePagination from "@/hooks/usePagination";
import { useToast } from "@/hooks/useToast";
import { findInObject, nvl } from "@/utilities";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import {
  deletePago,
  getEstadosPago,
  getResumenPagos,
} from "../services/pagos.services";
import ModalHistorialPago from "@components/turnos/ModalHistorialPago";
import ModalNuevoPago from "@components/turnos/ModalNuevoPago";

const Pagos = () => {
  const pagosPagination = usePagination();
  const [listPagos, setListPagos] = useState([]);
  const [showPagoModal, setShowPagoModal] = useState(false);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [pagoSelected, setPagoSelected] = useState(0);
  const [searchParams, setSearchParams] = useState({});
  const [listEstadosPago, setListEstadosPago] = useState([]);
  const [showHistorial, setShowHistorial] = useState(false);
  const [showConfirmacionDelete, setShowConfirmacionDelete] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    Promise.all([getEstadosPago()]).then((res) => {
      const [resEstados] = res;
      console.log(resEstados);
      setListEstadosPago(resEstados.request);
    });
  }, []);

  useEffect(() => {
    Promise.all([
      getResumenPagos({
        page: pagosPagination.actualPage,
        pageSize: pagosPagination.countRows,
        paramsFilter: searchParams,
      }),
    ]).then((res) => {
      const [resPago] = res;
      const { datos, meta } = resPago.request;

      pagosPagination.asignarCountPage(meta?.totalPages || 0);
      pagosPagination.asignarCountRecords(meta?.total || 0);
      setListPagos(datos);
      setIsLoadingTable(false);
    });
  }, [isLoadingTable, pagosPagination.countRows, pagosPagination.actualPage]);

  const handleSearchParams = ({ field, value }) => {
    setSearchParams({ ...searchParams, [field]: value });
  };

  const handleDeletePago = async ({ id }) => {
    const request = await deletePago(id);
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
      title: `Pago de ${pagoSelected?.NOMBRE} ${pagoSelected?.APELLIDO}`,
      message: "Eliminado correctamente",
      type: "success",
      duration: 3000,
    });
    setIsLoadingTable(true);
  };

  const classConditionsOptions = [
    {
      value: "Entr. pedido",
      field: "ESTADO_DESCRI",
      class: "bg-yellow-200",
      oper: "=",
    },
    {
      value: "Orden Autorizada",
      field: "ESTADO_DESCRI",
      class: "bg-orange-200",
      oper: "=",
    },
    {
      value: "Abonado",
      field: "ESTADO_DESCRI",
      class: "bg-green-200",
      oper: "=",
    },
    {
      value: "Token",
      field: "ESTADO_DESCRI",
      class: "bg-green-200",
      oper: "=",
    },
  ];

  const tableOptions = {
    hidden: ["ID", "ESTADO", "PERIODO_PAGO", "PACIENTE", "OBSERVACION"],
    idTable: "ID",
    th: {
      ID: { label: "id", width: "auto" },
      PACIENTE: { label: "", width: "auto" },
      OBSERVACION: { label: "", width: "auto" },
      NOMBRE: { label: "Nombre", width: "auto" },
      APELLIDO: { label: "Apellido", width: "auto" },
      DOCUMENTO: { label: "Documento", width: "auto" },
      ESTADO: { label: "Estado", width: "auto" },
      ESTADO_DESCRI: { label: "Estado", width: "auto" },
      PERIODO_PAGO: { label: "Periodo", width: "auto" },
      PERIODO_PAGO_DESCRI: { label: "Periodo", width: "auto" },
      PAGO_PLUS: { label: "Pago Plus", width: "auto" },
      FECHA_PAGO: { label: "Fecha de Pago", width: "auto" },
      OBRA_SOCIAL: { label: "Obra Social", width: "auto" },
    },
    classConditions: classConditionsOptions,
    actions: [
      {
        icon: "edit",
        title: "Editar",
        func: (id) => {
          const pago = findInObject(listPagos, id, "ID");
          setShowPagoModal(true);
          setPagoSelected(pago);
        },
      },
      {
        icon: "trash",
        title: "Eliminar",
        func: (id) => {
          setShowConfirmacionDelete(true);
          const pago = findInObject(listPagos, id, "ID");
          setPagoSelected(pago);
        },
      },
      {
        icon: "file-lines",
        title: "Historial",
        func: (id) => {
          setShowHistorial(true);
          const { PACIENTE, NOMBRE, APELLIDO } = findInObject(
            listPagos,
            id,
            "ID"
          );
          setPagoSelected({ PACIENTE, NOMBRE, APELLIDO });
        },
      },
    ],
  };

  return (
    <div className="flex flex-col gap-4 p-4 w-full">
      <TitleContent
        title="Panel de Pagos"
        subtitle="Aquí puedes ver cada uno de los pagos. Puedes agregar, editar o eliminar pagos."
      />
      {/* Filtros */}
      <Card>
        <section className="flex flex-col gap-3 ">
          <div className="flex flex-row items-center gap-4 flex-wrap">
            <Input
              name="paciente"
              type="text"
              placeholder="Nombre y Apellido"
              onChange={(e) =>
                handleSearchParams({ field: "paciente", value: e.target.value })
              }
            />
            <Input
              name="documento"
              type="text"
              placeholder="Documento"
              onChange={(e) =>
                handleSearchParams({
                  field: "documento",
                  value: e.target.value,
                })
              }
            />
            <Select
              name={"Estado"}
              items={listEstadosPago}
              config={{ descripCol: "DESCRIPCION", idCol: "ID" }}
              value={searchParams?.estado || ""}
              placeholder="Selec. estado"
              onChange={(e) =>
                handleSearchParams({ field: "estado", value: e.target.value })
              }
            />
          </div>
          <div className="flex flex-row items-center gap-4">
            <Button
              title="Agregar"
              icon={"plus"}
              variant="success"
              className="rounded-2xl"
              onClick={() => {
                setShowPagoModal(true);
                setPagoSelected({});
              }}
            />

            <Button
              title="Buscar"
              icon={"search"}
              className="rounded-2xl"
              onClick={() => {
                console.log(searchParams);
                setIsLoadingTable(true);
              }}
            />
          </div>
        </section>
      </Card>
      <div className="flex flex-col gap-4">
        {/* Contentido */}
        <Table
          data={listPagos}
          pagination={pagosPagination}
          loading={isLoadingTable}
          options={tableOptions}
        />
        <div className="gap-4 w-full"></div>
      </div>
      {
        // Modal para modificar turno de pago
        showPagoModal && (
          <Modal
            isOpen={showPagoModal}
            onClose={() => setShowPagoModal(false)}
            size={"full"}
            title={
              nvl(pagoSelected?.ID)
                ? `Modificar pago de ${pagoSelected?.APELLIDO} ${pagoSelected?.NOMBRE}`
                : "Agregar pago"
            }>
            <ModalNuevoPago
              setShowModal={setShowPagoModal}
              pago={pagoSelected}
              refresh={() => {
                setIsLoadingTable(true);
                setShowPagoModal(false);
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
            handleDeletePago({ id: pagoSelected?.ID });
          }}
          title={`¿Eliminar al pago de ${pagoSelected?.APELLIDO} ${pagoSelected?.NOMBRE}?`}
          message="Esta acción no se puede deshacer."
          variant="danger"
        />
      )}
      {showHistorial ? (
        <Modal
          isOpen={showHistorial}
          onClose={() => setShowHistorial(false)}
          title={`Historial del Pago - ${pagoSelected?.APELLIDO} ${pagoSelected?.NOMBRE} `}>
          <ModalHistorialPago
            refesh={() => {
              setIsLoadingTable;
            }}
            cliente={pagoSelected?.PACIENTE}></ModalHistorialPago>
        </Modal>
      ) : null}
    </div>
  );
};

export default Pagos;
