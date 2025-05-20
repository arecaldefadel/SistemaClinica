/**
 * Evalúa un valor si es  undefined, string vacio o null
 * @param {*} valor
 * @param {*} defaultValue
 * @returns {*} Valor que se define en el parametro defaultValue, o en su defecto 0 (cero)
 */
export const nvl = (valor, defaultValue = 0) =>
  valor === undefined || valor === "" || valor === null ? defaultValue : valor;

/** Encuentra un elemento dentro de un array
 * @param {Array} array Lista de elementos.
 * @param {any} valor Valor por el que se desea buscar.
 * @param {String} criterio Campo por el que se desea buscar.
 */
export const findInObject = (array, valor, criterio) => {
  const item = array.find((a) => a[`${criterio}`] === valor);
  return item;
};

/**
 * Suma o resta días a una fecha especificada.
 * @param {String} fecha Fecha en formato YYYY-MM-DD
 * @param {Integer} dias Número de días a sumar o restar
 * @param {Boolean} restar Si es true, resta los días; si es false, suma los días. Default es false.
 * @returns {String} Nueva fecha en formato YYYY-MM-DD
 */
export const sumarRestarDias = ({ fecha, dias, restar = false }) => {
  // Clonar la fecha para no modificar la original
  const nuevaFecha = new Date(fecha);
  if (!restar) {
    nuevaFecha.setDate(nuevaFecha.getDate() + nvl(dias));
    return nuevaFecha.toISOString().split("T")[0];
  }
  nuevaFecha.setDate(nuevaFecha.getDate() - nvl(dias));
  return nuevaFecha.toISOString().split("T")[0];
};

/**
 * Estructura estandarizada para devolver datos paginados en la API.
 *
 * @param {Array} data - Lista de registros obtenidos
 * @param {number} total - Cantidad total de registros
 * @param {number} page - Página actual solicitada (desde 1)
 * @param {number} pageSize - Tamaño de página (registros por página)
 * @returns {Object} Objeto de respuesta con metadatos
 */
export const buildResponse = (
  data = [],
  total = 0,
  page = 1,
  pageSize = 10
) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    datos: data,
    meta: {
      page,
      pageSize,
      total,
      totalPages,
    },
  };
};

/**
 * Devuelve una respuesta estandarizada para tu API.
 *
 * @param {object} res - El objeto response de Express
 * @param {number} status - Código HTTP a devolver (ej. 200, 400, 500)
 * @param {string} message - Mensaje principal
 * @param {object|array|null} [data=null] - Información adicional (datos, errores, etc.)
 */
export const apiResponse = (res, status, message, data = null) => {
  return res.status(status).json({
    status,
    message,
    ...(data !== null && { request: data }),
  });
};

/** Valida que los campos obligatorios estén presentes
 * @param body Body del req. que contiene los datos
 * @param {Array} requiredFields Campos que son obligatorios en el form
 */
export const validateFields = (body, requiredFields = []) => {
  const missing = requiredFields.find((f) => nvl(body[f]) === 0);
  console.log(missing);
  return {
    valid: nvl(missing) === 0,
    missing,
  };
};
