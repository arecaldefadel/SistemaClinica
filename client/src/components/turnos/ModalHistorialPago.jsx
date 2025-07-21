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
import usePagination from "@/hooks/usePagination.js";
import { useToast } from "@/hooks/useToast";
import { findInObject, nvl } from "@/utilities/index.js";
import ConfirmDialog from "@/components/ui/ConfirmDialog.jsx";
import {
  deletePago,
  getEstadosPago,
} from "@/pages/Dashboard/services/pagos.services.js";
import { getHistorialPagos } from "@/pages/Dashboard/services/pagos.services.js";
import ModalNuevoPago from "./ModalNuevoPago";

const HistorialPagos = ({ cliente, refesh }) => {
  const pagosPagination = usePagination();
  const [clientId, setClientId] = useState(cliente);
  const [listPagos, setListPagos] = useState([]);
  const [showPagoModal, setShowPagoModal] = useState(false);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [pagoSelected, setPagoSelected] = useState(0);
  const [searchParams, setSearchParams] = useState({});
  const [listEstadosPago, setListEstadosPago] = useState([]);
  const [showConfirmacionDelete, setShowConfirmacionDelete] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    Promise.all([getEstadosPago()]).then((res) => {
      const [resEstados] = res;
      setClientId(cliente);
      setListEstadosPago(resEstados.request);
    });
  }, [cliente]);

  useEffect(() => {
    Promise.all([
      getHistorialPagos({
        id: clientId,
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
  }, [
    isLoadingTable,
    pagosPagination.countRows,
    pagosPagination.actualPag,
    clientId,
  ]);

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
      message: "Eliminado correctamente",
      type: "success",
      duration: 3000,
    });
    setIsLoadingTable(true);
    refesh();
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
    hidden: ["ID", "ESTADO", "PERIODO", "CLIENTE"],
    idTable: "ID",
    th: {
      ID: { label: "id", width: "auto" },
      ESTADO: { label: "", width: "auto" },
      PERIODO: { label: "", width: "auto" },
      ESTADO_DESCRI: { label: "Estado", width: "auto" },
      PERIODO_DESCRI: { label: "Periodo", width: "auto" },
      PAGO_PLUS: { label: "Plus", width: "auto" },
      CLIENTE: { label: "", width: "auto" },
      FECHA_PAGO: { label: "Últ. Actualización", width: "auto" },
      OBSERVACION: { label: "Observación", width: "auto" },
      USUARIO: { label: "Usuario", width: "auto" },
    },
    classConditions: classConditionsOptions,
    actions: [
      {
        icon: "edit",
        title: "Editar",
        func: (id) => {
          let pago = findInObject(listPagos, id, "ID");
          pago = { ...pago, PACIENTE: clientId };
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
    ],
  };

  return (
    <div className="flex flex-col gap-4 p-4 w-full">
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

            <Button
              title="Buscar"
              className="rounded-2xl max-lg:hidden"
              onClick={() => {
                console.log(searchParams);
                setIsLoadingTable(true);
              }}
            />
          </div>
          <div className="flex flex-row items-center gap-4">
            <Button
              title="Agregar Pago"
              className="rounded-2xl"
              onClick={() => {
                setShowPagoModal(true);
                setPagoSelected({ PACIENTE: clientId });
              }}
            />
            <Button
              title="Buscar"
              className="rounded-2xl min-lg:hidden"
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
            title={nvl(pagoSelected?.ID) ? `Modificar pago` : "Agregar pago"}>
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
    </div>
  );
};

export default HistorialPagos;
