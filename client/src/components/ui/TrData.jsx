import React from 'react'

const TrData = ({ data }) => {
  return data.map((tr, i) => {
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
            style={{ fontSize: 14 }}>
            {/* Si se cumple la condición de acciones en la celda se renderiza el icono */}
            {actions?.some((action) => action?.cols)
              ? (() => {
                  const actionFiltered = actions.find((action) =>
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
                            key={i + Math.random()}>
                            <span
                              className="d-flex justify-content-left"
                              onClick={(e) =>
                                actionClick(e, actionFiltered.func)
                              }
                              style={{ cursor: "pointer", color: "#003550" }}>
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
                            className="d-flex justify-content-center"
                            onClick={(e) =>
                              actionClick(e, actionFiltered.func)
                            }
                            style={{ cursor: "pointer", color: "#003550" }}>
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
            {actions?.some((action) => action?.cols?.includes(nameCell)) ? (
              (() => {
                const actionFiltered = actions[i]?.rows?.includes(nameCell)
                  ? actions[i]
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
                          className="d-flex justify-content-center"
                          onClick={(e) => {
                            actionClick(e, actionFiltered?.func);
                          }}
                          style={{ cursor: "pointer", color: "#003550" }}>
                          {actionFiltered?.icon ? (
                            <Icon
                              iconName={actionFiltered.icon}
                              className="m-0 action-icon"></Icon>
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
                        className="d-flex justify-content-center"
                        onClick={(e) => {
                          actionClick(e, actionFiltered?.func);
                        }}
                        style={{ cursor: "pointer", color: "#003550" }}>
                        {actionFiltered?.icon ? (
                          <Icon
                            iconName={actionFiltered.icon}
                            className="m-0 action-icon"></Icon>
                        ) : null}
                      </span>
                    </Tooltip>
                  );
                }
              })()
            ) : (
              dataCell
            )}
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
            style={{ fontSize: 14 }}>
            {dataCell}
          </td>
        );
      }
    });

    // Luego se retorna la celda.
    return (
      <TrTable
        key={tr[options.idTable]}
        trClass={trClass}
        trData={tr}
        tdData={tdData}
        actions={actions}
        actionClick={actionClick}
        checkSelect={checkSelect}
        handledSelect={(e) => handledSelect(e)}
        handleDblClick={(e) => handleDblClick(e)}
        idTable={tr[options.idTable]}
        checkedList={(check) => handleCheck(tr[options.idTable])}></TrTable>
    );
  });
  
}

export default TrData