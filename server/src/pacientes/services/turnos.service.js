import { nvl } from "../../utils.js";
import { dbExecuteNamed, generateParams } from "../../utils/db.js";
import { buildResponse } from "../../utils/index.js";
import { pool } from "../../db/connection.js";

export const getTurnosService = async ({ page, pageSize, paramsFilter }) => {
  const pageOffset = (page - 1) * pageSize;
  // Se consulta el usuario y la contraseña
  const fields = {
    paciente: "nombre_personas",
    obraSocial: "id_os",
  };

  const paramEstadoValues = {
    0: "AND clientes.fbaja_cliente IS NOT NULL",
    1: "AND clientes.fbaja_cliente IS NULL",
  };

  let params = generateParams({ paramsFilter, fields });
  let paramEstado = paramEstadoValues[paramsFilter?.estado] || "";

  const queryTurnos = `
    select 
      id_cliente ID, 
        nombre_personas NOMBRE, 
        apellido_personas APELLIDO, 
        telefono_cliente TELEFONO, 
        os_abreviatura OBRA_SOCIAL,
        CASE 
          WHEN fbaja_cliente is NULL then 'Activo'
          WHEN fbaja_cliente is not NULL then 'Inactivo'
        END ESTADO,
        id_os OS
    from clientes
    inner join personas on id_personas = clientes.persona_id
    inner join obras_sociales on id_os = clientes.os_id
    WHERE 
    1=1 
    ${paramEstado}
    ${params.queryFilterString}
    ORDER BY  apellido_personas  limit :pageSize offset :pageOffset`;

  const queryCountTurnos = `
        select count(*) COUNT
    from clientes
    inner join personas on id_personas = clientes.persona_id
    inner join obras_sociales on id_os = clientes.os_id
    WHERE 1=1 
    ${paramEstado}
    ${params.queryFilterString}
    `;
  try {
    const rows = await dbExecuteNamed(queryTurnos, {
      pageSize,
      pageOffset,
      ...params.queryFiltersObject,
    });
    const { data: rowsCount } = await dbExecuteNamed(queryCountTurnos, {
      ...params.queryFiltersObject,
    });

    const [{ COUNT: total }] = rowsCount;
    if (!rows.error) return buildResponse(rows.data, total, page, pageSize);
  } catch (e) {
    console.log(e);
    return { status: "500", datos: {}, message: e.message };
  }
};

export const addTurnoService = async ({
  nombre,
  apellido,
  telefono,
  obraSocial,
}) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Insertar en personas
    const [res1] = await connection.execute(
      `INSERT INTO personas (nombre_personas, apellido_personas) VALUES (?, ?)`,
      [nombre, apellido]
    );

    const personaId = res1.insertId; // ✅ este es el id generado

    // 2. Insertar en clientes/pacientes
    const [res2] = await connection.execute(
      `INSERT INTO clientes (persona_id, telefono_cliente, os_id) VALUES (?, ?, ?)`,
      [personaId, telefono, parseInt(obraSocial)]
    );

    await connection.commit();
    return { status: "ok", personaId, pacienteId: res2.insertId };
  } catch (e) {
    await connection.rollback();
    console.error("❌ Error al insertar paciente:", e.message);
    return { status: "error", message: e.message };
  } finally {
    connection.release();
  }
};

export const updateTurnoService = async ({
  id,
  nombre,
  apellido,
  telefono,
  obraSocial,
}) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Obtener persona_id
    const [[cliente]] = await connection.execute(
      "SELECT persona_id FROM clientes WHERE id_cliente = ?",
      [id]
    );

    if (!cliente) {
      throw new Error("Turno no encontrado");
    }

    const personaId = cliente.persona_id;

    // 2. Actualizar persona
    await connection.execute(
      "UPDATE personas SET nombre_personas = ?, apellido_personas = ? WHERE id_personas = ?",
      [nombre, apellido, personaId]
    );

    // 3. Actualizar cliente
    await connection.execute(
      "UPDATE clientes SET telefono_cliente = ?, os_id = ? WHERE id_cliente = ?",
      [telefono, obraSocial, id]
    );

    await connection.commit();
    return { status: "ok", id: id };
  } catch (err) {
    await connection.rollback();
    return { status: "error", message: err.message };
  } finally {
    connection.release();
  }
};

export const deleteTurnoService = async ({ id }) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Obtener persona_id
    const [[cliente]] = await connection.execute(
      "SELECT persona_id FROM clientes WHERE id_cliente = ?",
      [id]
    );

    if (!cliente) {
      throw new Error("Turno no encontrado");
    }

    // 3. Eliminar cliente
    await connection.execute(
      "UPDATE clientes SET fbaja_cliente = NOW() WHERE id_cliente = ?",
      [id]
    );

    await connection.commit();
    return { error: false, id: id };
  } catch (err) {
    await connection.rollback();
    return { error: true, message: err.message };
  } finally {
    connection.release();
  }
};

export const reactiveTurnoService = async ({ id }) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Obtener persona_id
    const [[cliente]] = await connection.execute(
      "SELECT persona_id FROM clientes WHERE id_cliente = ?",
      [id]
    );

    if (!cliente) {
      throw new Error("Turno no encontrado");
    }

    // 3. Eliminar cliente
    await connection.execute(
      "UPDATE clientes SET fbaja_cliente = NULL WHERE id_cliente = ?",
      [id]
    );

    await connection.commit();
    return { error: false, id: id };
  } catch (err) {
    await connection.rollback();
    return { error: true, message: err.message };
  } finally {
    connection.release();
  }
};

export const getObrasSocialesServices = async ({
  page,
  pageSize,
  paramsFilter,
}) => {
  const pageOffset = (page - 1) * pageSize;
  // Se consulta el usuario y la contraseña
  const fields = {
    ID: "id_os",
    DESCRIPCION: "os_descripcion",
    ABREV: "os_abreviatura",
    TIPO: "os_tipo",
  };

  let params = {
    queryFilterString: "",
    queryFiltersObject: {},
  };
  if (nvl(paramsFilter?.ID) > 0) {
    params.queryFilterString = ` AND id_os = ${paramsFilter?.ID}`;
    params.queryFiltersObject = { id_os: paramsFilter?.ID };
  } else {
    params = generateParams({ paramsFilter, fields });
  }

  const queryTurnos = `
    SELECT id_os ID, os_descripcion DESCRIPCION, os_abreviatura ABREV, os_tipo TIPO 
    FROM  obras_sociales
    where 1=1
    ${params.queryFilterString}
    ORDER BY  os_abreviatura  limit :pageSize offset :pageOffset`;

  const queryCountTurnos = `
    select count(*) COUNT
    FROM  obras_sociales os
    where 1=1
    ${params.queryFilterString}
    `;
  try {
    const rows = await dbExecuteNamed(queryTurnos, {
      pageSize,
      pageOffset,
      ...params.queryFiltersObject,
    });
    const { data: rowsCount } = await dbExecuteNamed(queryCountTurnos, {
      ...params.queryFiltersObject,
    });

    const [{ COUNT: total }] = rowsCount;
    if (!rows.error) return buildResponse(rows.data, total, page, pageSize);
  } catch (e) {
    console.log(e);
    return { status: "500", datos: {}, message: e.message };
  }
};
