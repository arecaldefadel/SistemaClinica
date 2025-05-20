import { pool } from "../db/connection.js";
import { nvl } from "../utils.js";

/**
 * Ejecuta una consulta SQL de forma segura
 * - Convierte todos los parámetros a string (para compatibilidad con mysql2)
 * - Maneja errores automáticamente
 *
 * @param {string} query - Consulta SQL con placeholders (?)
 * @param {Array} params - Parámetros posicionales
 * @returns {Promise<{ data: any, error: string | null }>}
 */
export const dbExecute = async (query, params = []) => {
  try {
    const stringParams = params.map((p) =>
      typeof p === "number" ? String(p) : p
    );
    const [rows] = await pool.execute(query, stringParams);
    return { data: rows, error: null };
  } catch (e) {
    console.error("❌ Error en dbExecute:", e.message);
    return { data: null, error: e.message };
  }
};

/**
 * Ejecuta una consulta con parámetros nombrados
 * @param {string} query
 * @param {object} params
 * @returns {Promise<{ data: any, error: string | null }>}
 */
export const dbExecuteNamed = async (query, params = {}) => {
  try {
    // Convertimos los valores numéricos a string (opcional según tu caso)
    const parsedParams = Object.fromEntries(
      Object.entries(params).map(([key, value]) => [
        key,
        typeof value === "number" ? String(value) : value,
      ])
    );

    const [rows] = await pool.execute(query, parsedParams);
    return { data: rows, error: null };
  } catch (e) {
    console.error("❌ Error en dbExecuteNamed:", e.message);
    return { data: null, error: e.message };
  }
};

/**
 * Genera un objeto para poder hacer búsquedas en una consulta.
 * @param {Array} paramasFilter Array de filtros que vienen del frontend
 * @param {Object} fields Campos por los que se quiere hacer el filtro
 * @returns {Object} Un objeto con queryFilterString y queryFiltersObject
 */
export const generateParams = ({ paramsFilter, fields = {} }) => {
  let queryFilterString = "";
  let queryFiltersObject = {};
  if (nvl(paramsFilter, []).length < 1)
    return { queryFilterString, queryFiltersObject };

  paramsFilter.forEach((param) => {
    queryFilterString += ` and UPPER(${
      fields[param.field]
    }) LIKE CONCAT('%', UPPER(:${fields[param.field]}), '%')`;
    queryFiltersObject[`${fields[param.field]}`] = param.value;
  });

  return { queryFilterString, queryFiltersObject };
};
