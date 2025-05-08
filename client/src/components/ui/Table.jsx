import React from "react";
import Icon from "./Icon";
import Pagination from "./Pagination";
import TrTable from "./TrTable";
import Tooltip from "./Tooltip";
import Spiner from "./Spiner";

import { operFunction } from "@/utilities";

const Table = ({
  data,
  pagination,
  loading = false,
  options = {
    none: [],
    idTable: "",
    th: [],
    classConditions: [],
    actions: [],
  },
  selectedFunction = () => {},
  checkSelect = { activate: false, initialState: false },
}) => {
  const actionClick = (e, func) => {
    let trSelected = e.target.closest("tr");
    handledSelect(trSelected);
    if (func) func(trSelected.id);
  };

  // const handleCheck = (id) => onCheck(id);

  const handledSelect = (selectedTable) => {
    //Registro que se selecciona
    let className = selectedTable?.className;

    //Registro anterior seleccionado
    let trSelected = selectedTable.parentNode.querySelector(".trSelected");

    if (!className.includes("trSelected")) {
      selectedTable.className = className.concat("trSelected", "");
      if (trSelected)
        trSelected.className = trSelected.className.replace("trSelected", "");
    }

    selectedFunction(selectedTable.id);
  };

  // Headers para la tabla.
  let thData = Object.entries(options.th).map((th, j) => {
    return (
      <th key={j} className={`text-white`}>
        {th[1]}
      </th>
    );
  });

  let trData = null;
  if (data.length > 0) {
    // Registro de la tabla
    trData = data.map((tr, i) => {
      // Cada uno de las celdas de arman primero.
      let trClass = "";
      const tdData = Object.entries(tr).map((td, j) => {
        let tdClass = "",
          dataCell = td[1], // Dato del campo
          nameCell = td[0]; // Campo de la base de datos
        for (let i = 0; i < options.classConditions?.length; i++) {
          if (nameCell === options.classConditions[i]?.field) {
            if (options?.classConditions[i]?.oper !== undefined) {
              const render = operFunction(
                options?.classConditions[i]?.oper,
                options?.classConditions[i]?.value,
                options?.classConditions[i]?.field,
                tr
              );

              if (render) {
                tdClass = options.classConditions[i]?.class; // colorea solo el dato.
                // trClass = options.classConditions[i]?.class; // colorea toda la linea.
              }
            } else {
           
              if (options.classConditions[i]?.value === dataCell) {
                tdClass = options.classConditions[i]?.class; // colorea solo el dato.
                // trClass = options.classConditions[i]?.class; // colorea toda la linea.
              }
            }
          }
        }
        if (options?.none) {
          return !options.none.includes(nameCell) ? (
            <td
              className={`${tdClass}`}
              key={j}
              name={nameCell}
              style={{ fontSize: 14 }}
            >
              {/* Si se cumple la condición de acciones en la celda se renderiza el icono */}
              {options.actions?.some((action) => action?.cols)
                ? (() => {
                    const actionFiltered = options.actions.find((action) =>
                      action?.cols?.includes(nameCell)
                    );

                    if (actionFiltered) {
                      // Si hay una condición definida en la acción
                      if (actionFiltered.condition) {
                        const { oper, value, field } = actionFiltered.condition;
                        const render = operFunction(
                          oper,
                          value,
                          field,
                          data[i]
                        );

                        if (render) {
                          // Renderiza el ícono si se cumple la condición
                          return (
                            <Tooltip
                              title={actionFiltered.title}
                              key={i + Math.random()}
                            >
                              <span
                                className="flex justify-left"
                                onClick={(e) =>
                                  actionClick(e, actionFiltered.func)
                                }
                                style={{ cursor: "pointer", color: "#003550" }}
                              >
                                {actionFiltered.icon && (
                                  <Icon
                                    iconName={actionFiltered.icon}
                                    className="m-0 action-icon"
                                  />
                                )}
                              </span>
                            </Tooltip>
                          );
                        }
                      } else {
                        // Si no hay condición, renderiza el ícono normalmente
                        return (
                          <Tooltip title={actionFiltered.title} key={i}>
                            <span
                              className="action-button"
                              onClick={(e) =>
                                actionClick(e, actionFiltered.func)
                              }
                              style={{ cursor: "pointer", color: "#003550" }}
                            >
                              {actionFiltered.icon && (
                                <Icon
                                  iconName={actionFiltered.icon}
                                  className="m-0 action-icon"
                                />
                              )}
                            </span>
                          </Tooltip>
                        );
                      }
                    }
                    return null;
                  })()
                : null}
              {/* Si no se cumple la condición, renderiza la columna vacia */}
              {options.actions?.some((action) =>
                action?.cols?.includes(nameCell)
              )
                ? (() => {
                    const actionFiltered = options.actions[i]?.rows?.includes(
                      nameCell
                    )
                      ? options.actions[i]
                      : null;
                    if (actionFiltered?.condition) {
                      const { oper, value, field } = actionFiltered.condition;

                      // Evalúo la condición definida en el action para mostrar o no el component
                      const render = operFunction(oper, value, field, data[0]);

                      if (render) {
                        // Si cumple con la condición definida renderiza el ícono
                        return (
                          <Tooltip title={actionFiltered?.title} key={i}>
                            <span
                              className="action-button"
                              onClick={(e) => {
                                actionClick(e, actionFiltered?.func);
                              }}
                              style={{ cursor: "pointer", color: "#003550" }}
                            >
                              {actionFiltered?.icon ? (
                                <Icon iconName={actionFiltered.icon}></Icon>
                              ) : null}
                            </span>
                          </Tooltip>
                        );
                      }
                    } else {
                      // Si el action no tiene definida ninguna condición de la tabla, el ícono se renderiza de forma normal.
                      return (
                        <Tooltip title={actionFiltered?.title} key={i}>
                          <span
                            className="action-button"
                            onClick={(e) => {
                              actionClick(e, actionFiltered?.func);
                            }}
                            style={{ cursor: "pointer", color: "#003550" }}
                          >
                            {actionFiltered?.icon ? (
                              <Icon iconName={actionFiltered.icon}></Icon>
                            ) : null}
                          </span>
                        </Tooltip>
                      );
                    }
                  })()
                : dataCell}
            </td>
          ) : (
            <td style={{ display: "none" }} key={j} name={nameCell}>
              {dataCell}
            </td>
          );
        } else {
          return (
            <td
              className={`${tdClass}`}
              key={j}
              name={nameCell}
              style={{ fontSize: 14 }}
            >
              {dataCell}
            </td>
          );
        }
      });

      // Luego se retorna la celda.
      return (
        <TrTable
          key={tr[options.idTable]}
          idTable={tr[options.idTable]}
          trClass={trClass}
          trData={tr}
          tdData={tdData}
          actions={options.actions}
          actionClick={actionClick}
          checkSelect={checkSelect}
          handledSelect={(e) => handledSelect(e)}
          // handleDblClick={(e) => handleDblClick(e)}
          // checkedList={(check) => handleCheck(tr[options.idTable])}
        ></TrTable>
      );
    });
  }

  return (
    <>
      {/* Table */}
      <div className="table-card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                {checkSelect?.activate ? (
                  <th
                    className={`text-white text-center`}
                    style={{ backgroundColor: "#014E74", fontWeight: 400 }}
                  >
                    Selec.
                  </th>
                ) : null}
                {options.actions.length > 0 &&
                options.actions?.some((action) => !action?.cols) ? (
                  <th className="actions-column">Acciones</th>
                ) : null}
                {thData}
              </tr>
            </thead>
            <tbody>
              {!loading ? (
                trData
              ) : (
                <tr>
                  <td
                    colSpan={options.th.length + 1}
                    className="text-center"
                    style={{ fontSize: 14 }}
                  >
                   <span className="flex justify-center items-center gap-2" >  <Spiner/>  Cargando</span>
                  </td>
                </tr>
              )}
              {!loading && data.length < 1 ? (
                <tr>
                  <td
                    colSpan={options.th.length + 1}
                    className="text-center"
                    style={{ fontSize: 14 }}
                  >
                    <span>No se encontraron registros</span>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>

          {/* Pagination */}
          <Pagination paginationHook={pagination} />
        </div>
      </div>
    </>
  );
};

export default Table;
