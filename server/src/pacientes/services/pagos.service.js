import { nvl } from "../../utils.js";
import { dbExecuteNamed, generateParams } from "../../utils/db.js";
import { buildResponse } from "../../utils/index.js";
import { pool } from "../../db/connection.js";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import isoWeek from "dayjs/plugin/isoWeek.js";

dayjs.extend(isoWeek);
dayjs.extend(customParseFormat);

export const getPagosService = async ({ page, pageSize, paramsFilter }) => {
  const pageOffset = (page - 1) * pageSize;

  const fields = {
    paciente: "CONCAT(NOMBRE, ' ', APELLIDO)",
    estado: "ESTADO",
    periodo: "PERIODO_PAGO",
    documento: "DOCUMENTO",
  };
  let params = generateParams({ paramsFilter, fields });

  const queryPagosPaciente = `
    select 
      ID, PACIENTE, NOMBRE, APELLIDO, DOCUMENTO, ESTADO, ESTADO_DESCRI, PERIODO_PAGO, IFNULL(PAGO_PLUS, '-') PAGO_PLUS, OBRA_SOCIAL, 
      DATE_FORMAT(FECHA_PAGO, "%d-%m-%Y %H:%i") FECHA_PAGO,
      CASE PERIODO_PAGO 
        WHEN 1 THEN 'Diario'
        WHEN 2 THEN 'Semanal'
        WHEN 3 THEN 'Mensual'
      END
      PERIODO_PAGO_DESCRI,
      OBSERVACION
    from pago_por_clientes
    WHERE 1=1
    ${params.queryFilterString}
    ORDER BY  apellido  limit :pageSize offset :pageOffset
`;

  const queryCountPagosPaciente = `
    select count(*) COUNT FROM pago_por_clientes WHERE 1=1 
    ${params.queryFilterString}
    `;

  try {
    const rows = await dbExecuteNamed(queryPagosPaciente, {
      pageSize,
      pageOffset,
      ...params.queryFiltersObject,
    });
    const { data: rowsCount } = await dbExecuteNamed(queryCountPagosPaciente, {
      ...params.queryFiltersObject,
    });
    const [{ COUNT: total }] = rowsCount;
    if (!rows.error) return buildResponse(rows.data, total, page, pageSize);
  } catch (e) {
    console.log(e);
    return { status: "500", datos: {}, message: e.message };
  }
};

export const getHistorialPagosService = async ({
  id,
  page,
  pageSize,
  paramsFilter,
}) => {
  const pageOffset = (page - 1) * pageSize;

  const fields = {
    cliente: "CLIENTE",
    estado: "ESTADO",
    periodo: "PERIODO",
  };

  if (nvl(id) > 0) paramsFilter = { ...paramsFilter, cliente: id };

  let params = generateParams({ paramsFilter, fields });

  const queryPagosPaciente = `
      SELECT ID, ESTADO, PERIODO PERIODO_PAGO, ESTADO_DESCRI, IFNULL(PLUS, '-') PAGO_PLUS, CLIENTE, DATE_FORMAT(FECHA_PAGO, "%d-%m-%Y %H:%i") FECHA_PAGO, OBSERVACION, USUARIO, 
      CASE PERIODO 
        WHEN 1 THEN 'Diario'
        WHEN 2 THEN 'Semanal'
        WHEN 3 THEN 'Mensual'
      END 
      PERIODO_DESCRI from historial_pagos hp
    WHERE 1=1 
    ${params.queryFilterString}
    ORDER BY  ID DESC limit :pageSize offset :pageOffset
`;

  const queryCountPagosPaciente = `
    select count(*) COUNT FROM historial_pagos hp WHERE 1=1 
    ${params.queryFilterString}
    `;

  try {
    const rows = await dbExecuteNamed(queryPagosPaciente, {
      pageSize,
      pageOffset,
      ...params.queryFiltersObject,
    });
    const { data: rowsCount } = await dbExecuteNamed(queryCountPagosPaciente, {
      ...params.queryFiltersObject,
    });
    const [{ COUNT: total }] = rowsCount;
    if (!rows.error) return buildResponse(rows.data, total, page, pageSize);
  } catch (e) {
    console.log(e);
    return { status: "500", datos: {}, message: e.message };
  }
};

export const getEstadosPagoService = async () => {
  const queryEstados = `SELECT id_pe ID, pe_descripcion DESCRIPCION FROM pagos_estado`;

  try {
    const rows = await dbExecuteNamed(queryEstados, {});
    if (!rows.error) return rows.data;
  } catch {
    console.log(e);
    return { status: "500", datos: {}, message: e.message };
  }
};

export const addPagoService = async ({
  estado,
  plus,
  paciente,
  periodo,
  observacion,
  usuario,
}) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Insertar en personas
    /*id_pago, pg_estado, pg_plus, cliente_id, pg_fpago, pg_periodo, pg_observaciones, usuario_id*/
    const [res1] = await connection.execute(
      `INSERT INTO pagos_clientes (pg_estado, pg_plus, cliente_id, pg_periodo, pg_observaciones, usuario_id) VALUES (?,?,?,?,?,?);`,
      [
        estado,
        nvl(plus, null),
        paciente,
        periodo,
        nvl(observacion, ""),
        usuario,
      ]
    );
    console.log(res1);
    const turnoId = res1.insertId; // ✅ este es el id generado

    await connection.commit();
    return { status: "ok", turno: turnoId };
  } catch (e) {
    await connection.rollback();
    console.error("❌ Error al insertar pago:", e.message);
    return { status: "error", message: e.message };
  } finally {
    connection.release();
  }
};

export const updatePagoService = async ({
  estado,
  plus,
  periodo,
  observacion,
  usuario,
  id,
}) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [res1] = await connection.execute(
      `UPDATE pagos_clientes SET
        pg_estado = ?, pg_plus = ?,pg_fpago = CURRENT_TIMESTAMP() , pg_periodo = ?, pg_observaciones = ?, usuario_id = ?
      WHERE id_pago = ?;`,
      [estado, nvl(plus, null), periodo, nvl(observacion, ""), usuario, id]
    );

    const turnoId = res1.insertId; // ✅ este es el id generado

    await connection.commit();
    return { status: "ok", turno: turnoId };
  } catch (e) {
    await connection.rollback();
    console.error("❌ Error al actualizar pago:", e.message);
    return { status: "error", message: e.message };
  } finally {
    connection.release();
  }
};

export const deletePagoService = async ({ id }) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [res1] = await connection.execute(
      `DELETE FROM pagos_clientes WHERE id_pago = ?;`,
      [id]
    );
    console.log(res1);
    const turnoId = res1.insertId; // ✅ este es el id generado

    await connection.commit();
    return { status: "ok", turno: turnoId };
  } catch (e) {
    await connection.rollback();
    console.error("❌ Error al actualizar pago:", e.message);
    return { status: "error", message: e.message };
  } finally {
    connection.release();
  }
};
