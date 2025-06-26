import { nvl } from "../../utils.js";
import { dbExecuteNamed, generateParams } from "../../utils/db.js";
import { buildResponse } from "../../utils/index.js";
import { pool } from "../../db/connection.js";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
dayjs.extend(customParseFormat);

export const getTurnosPorMesService = async ({ paramsFilter }) => {
  // Se consulta el usuario y la contraseña
  const fields = {
    fecha: "fecha_turno",
  };

  let params = generateParams({ paramsFilter, fields });

  const queryTurnos = `
    select 
      DATE_FORMAT(fecha_turno, "%Y-%m-%d") FECHA, 
      DATE_FORMAT(hora_turno, "%H:%i") HORA
    from turnos
    WHERE 1=1
    ${params.queryFilterString}`;

  const queryCountTurnos = `
    select count(*) COUNT
    FROM turnos
    WHERE 1=1 
    ${params.queryFilterString}
    `;
  try {
    const rows = await dbExecuteNamed(queryTurnos, {
      ...params.queryFiltersObject,
    });
    const { data: rowsCount } = await dbExecuteNamed(queryCountTurnos, {
      ...params.queryFiltersObject,
    });

    const [{ COUNT: total }] = rowsCount;
    if (!rows.error) return buildResponse(rows.data, total, 1, 1);
  } catch (e) {
    console.log(e);
    return { status: "500", datos: {}, message: e.message };
  }
};

export const getTurnosService = async ({ page, pageSize, paramsFilter }) => {
  const pageOffset = (page - 1) * pageSize;
  // Se consulta el usuario y la contraseña
  const fields = {
    paciente: "CONCAT(nombre_personas, ' ', apellido_personas)",
    idPaciente: "cliente_id",
    atendido: "atendido_turno",
    fecha: "fecha_turno",
    telefono: "telefono_cliente",
  };

  let params = generateParams({ paramsFilter, fields });

  const queryTurnos = `
    SELECT 
      id_turno ID, 
      cliente_id PACIENTE,
      CASE 
        WHEN atendido_turno = 1 THEN 'Si'
        WHEN atendido_turno = 0 THEN 'No'
      END ATENDIDO, 
      nombre_personas NOMBRE, 
      apellido_personas APELLIDO,
      DATE_FORMAT(fecha_turno, "%d-%m-%Y") FECHA, 
      DATE_FORMAT(hora_turno, "%H:%i") HORA, 
      telefono_cliente TELEFONO, 
      os_abreviatura OBRA_SOCIAL
    FROM turnos
    INNER JOIN clientes ON id_cliente = turnos.cliente_id
    INNER JOIN personas ON id_personas = clientes.persona_id
    INNER JOIN obras_sociales ON id_os = clientes.os_id
    WHERE 1=1
    ${params.queryFilterString}
    ORDER BY  apellido_personas  limit :pageSize offset :pageOffset`;

  const queryCountTurnos = `
    select count(*) COUNT
    FROM turnos
      INNER JOIN clientes ON id_cliente = turnos.cliente_id
      INNER JOIN personas ON id_personas = clientes.persona_id
      INNER JOIN obras_sociales ON id_os = clientes.os_id
    WHERE 1=1 
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

export const addTurnoService = async ({ paciente, fecha, hora }) => {
  /*
cliente_id, fecha_turno, hora_turno, atendido_turno
*/
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Insertar en personas
    const [res1] = await connection.execute(
      `INSERT INTO turnos (cliente_id, fecha_turno, hora_turno, atendido_turno) VALUES (?, ?, ? , ?)`,
      [paciente, fecha, hora, 0]
    );

    const turnoId = res1.insertId; // ✅ este es el id generado

    await connection.commit();
    return { status: "ok", turno: turnoId };
  } catch (e) {
    await connection.rollback();
    console.error("❌ Error al insertar paciente:", e.message);
    return { status: "error", message: e.message };
  } finally {
    connection.release();
  }
};

export const updateTurnoService = async ({ id, paciente, fecha, hora }) => {
  const connection = await pool.getConnection();
  //console.log({ id, paciente, fecha, hora });

  try {
    await connection.beginTransaction();

    // 1. Obtener persona_id
    const [[turno]] = await connection.execute(
      "SELECT id_turno FROM turnos WHERE id_turno = ?",
      [id]
    );

    if (!turno) {
      throw new Error("Turno no encontrado");
    }

    // 2. Actualizar turno
    await connection.execute(
      "UPDATE turnos SET cliente_id = ?, fecha_turno = ?, hora_turno = ? WHERE id_turno = ?",
      [paciente, fecha, hora, id]
    );

    await connection.commit();
    return { status: "ok", id: id };
  } catch (err) {
    await connection.rollback();
    console.log(err);
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
    const [[turno]] = await connection.execute(
      "SELECT id_turno FROM turnos WHERE id_turno = ?",
      [id]
    );

    if (!turno) {
      throw new Error("Turno no encontrado");
    }

    // 3. Eliminar cliente
    await connection.execute("DELETE FROM turnos WHERE id_turno = ?", [id]);

    await connection.commit();
    return { error: false, id: id };
  } catch (err) {
    await connection.rollback();
    return { error: true, message: err.message };
  } finally {
    connection.release();
  }
};

export const setTurnoAtendidoService = async ({ id, atendido }) => {
  const connection = await pool.getConnection();
  // console.log({ id, atendido });

  // return { status: "ok", id: id };
  try {
    await connection.beginTransaction();

    // 1. Obtener persona_id
    const [[turno]] = await connection.execute(
      "SELECT id_turno FROM turnos WHERE id_turno = ?",
      [id]
    );

    if (!turno) {
      throw new Error("Turno no encontrado");
    }

    // 2. Actualizar turno
    await connection.execute(
      "UPDATE turnos SET  atendido_turno = ? WHERE id_turno = ?",
      [atendido, id]
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

export const diferenciaEntreTurnosService = async ({ fecha, hora }) => {
  const queryTurnos = `
    select TIMESTAMPDIFF(MINUTE, CONCAT(fecha_turno, ' ', hora_turno), CONCAT(:fecha, ' ', :hora)) difeHorario 
    from turnos where fecha_turno = :fecha`;

  try {
    const { data } = await dbExecuteNamed(queryTurnos, { fecha, hora });
    return data.length > 0 ? (data[0].difeHorario ?? 0) >= 60 : true;
  } catch (e) {
    console.log(e);
    return { status: "500", datos: {}, message: e.message };
  }
};

export const getStatsService = async () => {
  // Se consulta el usuario y la contraseña
  const mes = dayjs().format("YYYY-MM");
  const hoy = dayjs().format("YYYY-MM-DD");

  const queryCantPacientes = `select count(*) cant_pacientes from clientes where fbaja_cliente is null;`;
  const queryCantidadNuevos = `select count(*) cant_nuevos from clientes where fingreso_cliente like CONCAT('%', ? , '%')`;
  const queryCantidadTurnos = `select count(*) cant_turnos from turnos where fecha_turno like CONCAT('%', ? , '%')`;
  const queryCantidadTurnosPend = `select count(*) cant_pendientes from  turnos where fecha_turno like CONCAT('%', ? , '%') and atendido_turno = 0`;

  const connection = await pool.getConnection();
  //console.log({ id, paciente, fecha, hora });

  try {
    await connection.beginTransaction();

    const [[{ cant_pacientes }]] = await connection.execute(queryCantPacientes);
    const [[{ cant_nuevos }]] = await connection.execute(queryCantidadNuevos, [
      mes,
    ]);
    const [[{ cant_turnos }]] = await connection.execute(queryCantidadTurnos, [
      hoy,
    ]);
    const [[{ cant_pendientes }]] = await connection.execute(
      queryCantidadTurnosPend,
      [hoy]
    );

    return {
      cantPacientes: cant_pacientes,
      cantidadNuevos: cant_nuevos,
      cantidadTurnos: cant_turnos,
      cantidadTurnosPend: cant_pendientes,
    };
  } catch (err) {
    console.log(err);
    return { status: "error", message: err.message };
  } finally {
    connection.release();
  }
};
