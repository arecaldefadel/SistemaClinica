import { useState, useEffect } from "react";
import { Card, Table, Modal, Input, Button } from "@/components/ui";
import { getTurnos } from "@/pages/Dashboard/services/turnos.services";
import usePagination from "@/hooks/usePagination";

const ModalSearhTurnos = () => {
  const [turnos, setTurnos] = useState([]);
  const turnosPagination = usePagination();
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [searchParams, setSearchParams] = useState({});

  useEffect(() => {
    // page: paginationForms?.actualPage ?? 1, limit: parseInt(paginationForms?.countRows) ?? 10,
    Promise.all([
      getTurnos({
        page: turnosPagination.actualPage,
        pageSize: turnosPagination.countRows,
        paramsFilter: searchParams,
      }),
    ]).then((res) => {
      const [resTurno] = res;
      const { datos, meta } = resTurno.request;
      setTurnos(datos || []);
      turnosPagination.asignarCountPage(meta?.totalPages || 0);
      turnosPagination.asignarCountRecords(meta?.total || 0);
      turnosPagination.asignarCountRows(5);

      setIsLoadingTable(false);
    });
  }, [isLoadingTable, turnosPagination.actualPage, turnosPagination.countRows]);

  const handleSearchParams = ({ field, value }) => {
    setSearchParams({ ...searchParams, [field]: value });
  };
  const classConditionsOptions = [
    {
      value: "Si",
      field: "ATENDIDO",
      class: "bg-green-200",
      oper: "=",
    },
    {
      value: "No",
      field: "ATENDIDO",
      class: "bg-red-200",
      oper: "=",
    },
  ];

  const tableOptions = {
    hidden: ["OS", "ID", "PACIENTE"],
    idTable: "ID",
    th: {
      ID: { label: "Código", width: "50px" },
      ATENDIDO: { label: "Atendido", width: "50px" },
      NOMBRE: { label: "Nombre", width: "auto" },
      APELLIDO: { label: "Apellido", with: "auto" },
      FECHA: { label: "Fecha", width: "auto" },
      HORA: { label: "Hora", width: "auto" },
      TELEFONO: { label: "Teléfono", width: "auto" },
      OBRA_SOCIAL: { label: "Obra Social", width: "auto" },
      OS: { label: "OS_CODE", width: "auto" },
      PACIENTE: { label: "", with: "auto" },
    },
    classConditions: classConditionsOptions,
    actions: [],
  };

  return (
    <>
      <div className="rounded-md bg-white shadow">
        <Card>
          <section className="flex flex-col gap-3 ">
            <div className="flex flex-row items-center gap-4 flex-wrap">
              <Input
                name="paciente"
                type="text"
                placeholder="Nombre y Apellido"
                onChange={(e) =>
                  handleSearchParams({
                    field: "paciente",
                    value: e.target.value,
                  })
                }
              />
              <Input
                name="telefono"
                type="text"
                placeholder="Teléfono"
                onChange={(e) =>
                  handleSearchParams({
                    field: "telefono",
                    value: e.target.value,
                  })
                }
              />
              <Button
                title="Buscar"
                icon={"search"}
                className="rounded-2xl"
                onClick={() => {
                  setIsLoadingTable(true);
                }}
              />
            </div>
          </section>
        </Card>
        <Table
          data={turnos}
          pagination={turnosPagination}
          loading={isLoadingTable}
          options={tableOptions}
        />
      </div>
    </>
  );
};

export default ModalSearhTurnos;
