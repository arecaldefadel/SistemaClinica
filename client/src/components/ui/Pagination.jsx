import React, { useState } from "react";
import Icon from "./Icon";

const Pagination = ({ paginationHook }) => {
  const activate = paginationHook.actualPage;
  const totalPage = paginationHook.countPage;
  const hadleCantidadReg = (value) => paginationHook.asignarCountRows(value);
  const first = () => paginationHook.firstPage();
  const next = () => paginationHook.nextPage();
  const preview = () => paginationHook.previewPage();
  const last = () => paginationHook.lastPage();
  const [regSelected, setRegSelected] = useState(10);
  const totalRecords = paginationHook.countRecords;

  const resultados = `Resultados ${
    (activate - 1) * regSelected + 1 > totalRecords
      ? (activate - 1) * regSelected
      : (activate - 1) * regSelected + 1
  } - ${
    activate * regSelected > totalRecords
      ? totalRecords
      : activate * regSelected
  } de ${totalRecords}`;
  // const resultados2 = `${totalRecords}`;
  return (
    <>
      <div className="table-footer">
      <div className="flex gap-2 justify-between items-center">
          <div className="results-info text-nowrap">{resultados}</div>
          <div hidden className="results-info">Mostrar registros</div>
          <select
            name=""
            className="border border-gray-300 rounded-md px-3 py-2 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            id="showRecords"
            defaultValue={10}
            onChange={(e) => {
              hadleCantidadReg(e.target.value);
              setRegSelected(Number(e.target.value));
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
        </div>

        <div className="pagination">
          <button className="pagination-button" onClick={first}>
            <Icon iconName="angles-left" />
          </button>
          <button className="pagination-button prev" onClick={preview}> <Icon iconName="angle-left" /></button>
          
          <button className="pagination-button active">{activate}</button>
          <span className="text-nowrap"> de {totalPage}</span>
          <button className="pagination-button next" onClick={next}>
          <Icon iconName="angle-right" />
          </button>
          <button className="pagination-button" onClick={last}>
            <Icon iconName="angles-right" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Pagination;
