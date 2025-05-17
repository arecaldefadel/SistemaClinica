import { nvl } from "../../utils.js";
import { dbExecuteNamed, generateParams } from "../../utils/db.js";
import { buildResponse } from "../../utils/index.js";

export const getPacientesService = async ({ page, pageSize, paramsFilter }) => {
  const pageOffset = (page - 1) * pageSize;
  // Se consulta el usuario y la contraseña
  const fields = {
    NOMBRE: "nombre_personas",
    APELLIDO: "apellido_personas",
    TELEFONO: "telefono_cliente",
  };

  const params = generateParams({ paramsFilter, fields });

  const queryPacientes = `
    select id_cliente ID, nombre_personas NOMBRE, apellido_personas APELLIDO, telefono_cliente TELEFONO 
    from clientes c 
    inner join personas p on c.persona_id = p.id_personas
    ${params.queryFilterString}
    ORDER BY  apellido_personas  limit :pageSize offset :pageOffset`;

  const queryCountPacientes = `
        select count(*) COUNT
    from clientes c 
    inner join personas p on c.persona_id = p.id_personas
    ${params.queryFilterString}
    `;
  try {
    const rows = await dbExecuteNamed(queryPacientes, {
      pageSize,
      pageOffset,
      ...params.queryFiltersObject,
    });
    const { data: rowsCount } = await dbExecuteNamed(queryCountPacientes, {});

    const [{ COUNT: total }] = rowsCount;
    if (!rows.error) return buildResponse(rows.data, total, page, pageSize);
  } catch (e) {
    console.log(e);
    return { status: "500", datos: {}, message: e.message };
  }
};

export const addPacienteService = async ({ nombre, apellido, telefono }) => {
  console.log({ nombre, apellido, telefono });

  return { status: 204, message: "Creado correctamente" };
};

export const getObrasSociales = async ({ page, pageSize }) => {
  const pageOffset = (page - 1) * pageSize;
  // Se consulta el usuario y la contraseña
  const queryPacientes = `
    SELECT id_os ID, os_descripcion DESCRIPCION, os_abreviatura ABREV, os_tipo TIPO 
    FROM  obras_sociales
    ORDER BY  apellido_personas  limit :pageSize offset :pageOffset`;

  const queryCountPacientes = `
        select count(*) COUNT
    FROM  obras_sociales os
    `;
  try {
    const rows = await dbExecuteNamed(queryPacientes, {
      pageSize,
      pageOffset,
    });
    const { data: rowsCount } = await dbExecuteNamed(queryCountPacientes, {});

    const [{ COUNT: total }] = rowsCount;
    if (!rows.error) return buildResponse(rows.data, total, page, pageSize);
  } catch (e) {
    console.log(e);
    return { status: "500", datos: {}, message: e.message };
  }
};
