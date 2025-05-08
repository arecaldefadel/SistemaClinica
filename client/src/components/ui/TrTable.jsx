import { useState, useEffect } from "react";
import Icon from "./Icon";
import Tooltip from "./Tooltip";
import { operFunction } from "@/utilities";
const TrTable = ({
  idTable,
  trClass,
  trData,
  handledSelect,
  handleDblClick,
  checkSelect,
  actions,
  actionClick,
  tdData,
  checkedList = () => {},
}) => {
  const [check, setCheck] = useState(checkSelect?.initialState || false);

  const [shouldRenderContent, setShouldRenderContent] = useState(true);

  useEffect(() => {
    // Evaluamos si alguna acción tiene cols y actualizamos el estado
    const hasCols = actions.some((action) => action?.cols);
    setShouldRenderContent(!hasCols);
  }, [actions]);
  const onChecked = () => {
    setCheck(!check);
    checkedList(!check);
  };
  let cantActions = 0;

  for (let action of actions) {
    if (action?.condition) {
      const { oper, value, field } = action.condition;
      const render = operFunction(oper, value, field, trData);
      if (render) cantActions++;
    }
  }
  // Luego se retorna la celda.
  return (
    <tr
      id={idTable}
      className={`${trClass}`}
      key={idTable}
      // onClick={(e) => handledSelect(e.target.closest("tr"))}>
      onClick={(e) => handledSelect(e.target.closest("tr"))}
      onDoubleClick={(e) => handleDblClick(e.target.closest("tr"))}>
      {checkSelect?.activate ? (
        <td
          onClick={() => {
            onChecked();
          }}>
          <span className="flex justify-center action-button">
            {check ? (
              <Icon iconName="square-check" className="m-0 action-icon"></Icon>
            ) : (
              <Icon iconName={'square'} className="m-0 action-icon"></Icon>
            )}
          </span>
        </td>
      ) : null}
      {actions.length > 0 && actions.some((action) => !action?.cols) ? (
        <td
          className={`${
            shouldRenderContent ? "flex justify-center" : ""
          }`}
          style={{ cursor: "default" }}>
          {actions.map((action, i) => {
            if (!action?.cols) {
              if (action?.condition) {
                const { oper, value, field } = action.condition;
                // Evalúo la condición definida en el action para mostrar o no el component
                const render = operFunction(oper, value, field, trData);
                if (render) {
                  // Si cumple con la condición definida renderiza el ícono
                  return (
                    <Tooltip text={action?.title} key={i}>
                      <span
                        className="flex justify-center action-button"
                        onClick={(e) => {
                          actionClick(e, action?.func);
                        }}
                        >
                        {action?.icon ? (
                          <Icon
                            iconName={action.icon}
                            className="m-0 action-icon"></Icon>
                        ) : null}
                      </span>
                    </Tooltip>
                  );
                } else {
                  // Si no cumple con la condición definida renderiza el ícono transparente para evitar un bug en la tabla
                  if (cantActions < 1) {
                    return (
                      <span style={{ cursor: "pointer", color: "transparent" }}>
                        <Icon iconName={"circle"}></Icon>{" "}
                      </span>
                    );
                  } else {
                    return null;
                  }
                }
              } else {
                // Si el action no tiene definida ninguna condición de la tabla, el ícono se renderiza de forma normal.
                return (
                  <Tooltip text={action?.title} key={i}>
                    <span
                      className="flex justify-center action-button"
                      onClick={(e) => {
                        actionClick(e, action?.func);
                      }}
                      >
                      {action?.icon ? (
                        <Icon
                          iconName={action.icon}
                          className="m-0 action-icon"></Icon>
                      ) : null}
                    </span>
                  </Tooltip>
                );
              }
            }
          })}
        </td>
      ) : null}
      {tdData}
    </tr>
  );
};

export default TrTable;
