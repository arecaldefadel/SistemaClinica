import { useState, useEffect } from "react";

function usePagination() {
  const [countPage, setCountPage] = useState(1);
  const [actualPage, setActualPage] = useState(1);
  const [countRows, setCountRows] = useState(10);
  const [countRecords, setCountRecords] = useState(0);

  useEffect(() => {
    if (actualPage > countPage) {
      setActualPage(countPage);
    }
  }, [countPage]);

  //============ navegador de tabla ============//
  const firstPage = () => setActualPage(1);
  /** Avanza la página */
  const nextPage = () => {
    const actual = actualPage === countPage ? actualPage : actualPage + 1;
    setActualPage(actual);
  };
  /** Retroceder la página */
  const previewPage = () => {
    const actual = actualPage === 1 ? 1 : actualPage - 1;
    setActualPage(actual);
  };
  /** Va a la últma página */
  const lastPage = () => setActualPage(countPage);
  /** Asigna la cantidad de páginas */
  const asignarCountPage = (count) => setCountPage(count);

  const asignarCountRows = (rows) => setCountRows(rows);

  const asignarPage = (page) => setActualPage(page);

  const asignarCountRecords = (records) => setCountRecords(records);

  return {
    actualPage,
    countPage,
    countRows,
    firstPage,
    nextPage,
    previewPage,
    lastPage,
    asignarCountPage,
    asignarCountRows,
    asignarPage,
    asignarCountRecords,
    countRecords,
  };
}

export default usePagination;
