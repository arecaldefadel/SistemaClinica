// Table.jsx
import React, { useState } from "react";
import Icon from "./Icon";
import Tooltip from "./Tooltip";
import Pagination from "./Pagination";
import Spiner from "./Spiner";
import "@/assets/css/Dashboard.css"; // Asegúrate de que esta ruta sea correcta

// Función para evaluar condiciones
import { operFunction } from '@/utilities';

const Table = ({
  data = [],
  pagination,
  loading = false,
  options = {
    idTable: '',
    th: {}, // { fieldName: { label: 'Nombre', width: '150px' } }
    hidden: [],
    classConditions: [],
    actions: [],
  },
  selectedFunction = () => {},
  checkSelect = { activate: false, initialState: false },
}) => {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortField) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortField, sortDirection]);

  const handleRowSelect = (rowId, selectedTable) => {
        //Registro que se selecciona
        let className = selectedTable?.className;

        //Registro anterior seleccionado
        let trSelected = selectedTable.parentNode.querySelector(".trSelected");
        if (!className.includes("trSelected")) {
          selectedTable.classList.add("trSelected") //= className.concat("", "");
          if (trSelected)
           trSelected.classList.remove("trSelected");
        }
    selectedFunction(rowId);
  };

  const renderActionIcon = (action, rowData, nameCell, key) => {
    if (!action) return null;
    const shouldRender = action.condition
      ? operFunction(
          action.condition.oper,
          action.condition.value,
          action.condition.field,
          rowData
        )
      : true;

    if (!shouldRender) return null;

    return (
      <Tooltip title={action.title} key={key}>
        <span
          className="w-[32px] h-[32px] bg-transparent rounded-md cursor-pointer text-gray-600"
          onClick={(e) => {
            e.stopPropagation();
            action.func(rowData[options.idTable]);
          }}
        >
          <Icon iconName={action.icon} />
        </span>
      </Tooltip>
    );
  };

  const headers = () => {
    const thArray = Object.entries(options.th);
    const thClass = "bg-gray-50 text-gray-700 font-semibold border-b-2 border-gray-200 px-2 py-2";
    return (
      <tr>
        {checkSelect.activate && (
          <th className={"bg-gray-50 text-gray-700 font-semibold border-b-2 border-gray-200 px-2"} style={{ width: '0.5rem' }} >Selec.</th>
        )}

        {options.actions.some((a) => !a.cols) && (
          <th className={"bg-gray-50 text-gray-700 font-semibold border-b-2  border-gray-200 pl-2" } style={{ width: '0.5rem' }}>Acciones</th>
        )}

        {thArray.map(([key, config], index) => (
          <th
            key={index}
            style={{ width: config.width || 'auto', cursor: 'pointer', display: options.hidden?.includes(key) ? 'none' : 'table-cell' }}
            className={thClass}
            onClick={() => handleSort(key)}
          >
            <span className="flex items-center gap-1">
              {config.label || key}
              {sortField === key && (
                <Icon iconName={sortDirection === 'asc' ? 'caret-up' : 'caret-down'} />
              )}
            </span>
          </th>
        ))}
      </tr>
    );
  };

  const rows = () => {
    if (sortedData.length === 0 && !loading) {
      return (
        <tr>
          <td colSpan={Object.keys(options.th).length + 2} className="text-center py-4">
            No se encontraron registros.
          </td>
        </tr>
      );
    }

    if (loading) {
      return (
        <tr>
          <td colSpan={Object.keys(options.th).length + 2} className="text-center py-4">
            <span className="flex justify-center items-center gap-2">
              <Spiner /> Cargando...
            </span>
          </td>
        </tr>
      );
    }

    return sortedData.map((row, i) => {
      const rowId = row[options.idTable];

      return (
        <tr
          key={rowId}
          onClick={(e) => handleRowSelect(rowId,e.target.closest("tr"))}
          className="hover:bg-[var(--gray)] cursor-pointer"
        >
          {checkSelect.activate && (
            <td className="text-center">
              <input type="checkbox" defaultChecked={checkSelect.initialState} />
            </td>
          )}

          {options.actions.some((a) => !a.cols) && (
            <td className="flex gap-2 justify-center items-center ">
              {options.actions
                .filter((a) => !a.cols)
                .map((action, index) => renderActionIcon(action, row, '', `action-${i}-${index}`))}
            </td>
          )}

          {Object.entries(options.th).map(([key, config], j) => {
            if (options.hidden?.includes(key)) return null;

            let tdClass = '';
            for (let i = 0; i < options.classConditions?.length; i++) {
              const classCond = options.classConditions[i];
              if (classCond.field === key) {
                const valid = classCond.oper
                  ? operFunction(classCond.oper, classCond.value, classCond.field, row)
                  : row[key] === classCond.value;
                if (valid) tdClass = classCond.class;
              }
            }

            const actionForThisCell = options.actions.find((a) => a.cols?.includes(key));
            const content = actionForThisCell
              ? renderActionIcon(actionForThisCell, row, key, `action-col-${i}-${j}`)
              : row[key];

            return (
              <td
                key={j}
                style={{ width: config.width || 'auto' }}
                className={`px-2 py-1 text-sm ${tdClass}`}
              >
                {content}
              </td>
            );
          })}
        </tr>
      );
    });
  };

  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden">
      <div className="w-full overflow-x-auto">
        <div className="max-md:overflow-x-scroll">
        <table className="w-full border-collapse text-left">
          <thead>{headers()}</thead>
          <tbody>{rows()}</tbody>
        </table>
        </div>

        <Pagination paginationHook={pagination} />
      </div>
    </div>
  );
};

export default Table;
