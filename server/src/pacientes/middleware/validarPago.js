import { apiResponse, validateFields, nvl } from "../../utils/index.js";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek.js";
import isBetween from "dayjs/plugin/isBetween.js";
import { dbExecute } from "../../utils/db.js";

dayjs.extend(isoWeek);
dayjs.extend(isBetween);

export const verificarPagoExistente = async (idPaciente, periodo_form) => {
  const { data } = await dbExecute(
    `
    SELECT DATE_FORMAT(pg_fpago, "%Y-%m-%d") FECHA_PAGO, pg_periodo PERIODO FROM pagos_clientes 
    WHERE cliente_id = ?
    LIMIT 1
  `,
    [idPaciente]
  );

  const fecha =
    data.length > 0 ? dayjs(data[0]?.FECHA_PAGO) : dayjs("0000-00-00");
  const periodo = data[0]?.PERIODO || periodo_form;

  const fechaActual = dayjs().format("YYYY-MM-DD");
  let rangoInicio, rangoFin;
  const periodos = ["dia", "semana", "mes"];
  const rangoFecha = {
    dia: () => {
      console.log(fechaActual, fecha.format("YYYY-MM-DD"));
      return fechaActual === fecha.format("YYYY-MM-DD");
    },
    semana: () => {
      rangoInicio = fecha.startOf("isoWeek").format("YYYY-MM-DD");
      rangoFin = fecha.endOf("isoWeek").format("YYYY-MM-DD");
      return dayjs(fechaActual).isBetween(rangoInicio, rangoFin, null, "[]");
    },
    mes: () => {
      rangoInicio = fecha.startOf("month").format("YYYY-MM-DD");
      rangoFin = fecha.endOf("month").format("YYYY-MM-DD");
      return dayjs(fechaActual).isBetween(rangoInicio, rangoFin, null, "[]");
    },
  };

  const existePago = rangoFecha[periodos[periodo - 1]]();

  return { estado: existePago, fecha: data[0]?.FECHA_PAGO || "" };
};

export const validarPago = async (req, res, next) => {
  const { paciente, periodo } = req.body;
  const idPago = req?.params?.id;

  const validadDatos = validateFields(req.body, [
    "estado",
    "paciente",
    "periodo",
  ]);

  if (!validadDatos.valid) {
    return apiResponse(
      res,
      400,
      `El campo ${validadDatos.missing} es obligatorio.`
    );
  }

  if (isNaN(Number(paciente))) {
    return apiResponse(res, 400, "El ID del paciente no es válido.");
  }

  if (nvl(idPago) === 0) {
    const yaPago = await verificarPagoExistente(paciente, periodo);
    const periodos = ["este dia", "esta semana", "este mes"];
    if (yaPago.estado) {
      return res.status(400).json({
        success: false,
        code: "ERR_PAGO_DUPLICADO",
        message: `El paciente ya tiene un pago registrado para ${
          periodos[periodo - 1]
        }. Últ. Actualización: ${yaPago.fecha}`,
      });
    }
  } else {
    const { data } = await dbExecute(
      `
    SELECT usuario_id FROM pagos_clientes
    WHERE id_pago = ?
    LIMIT 1
  `,
      [idPago]
    );

    if (data[0].usuario_id !== req.userId) {
      return res.status(400).json({
        success: false,
        code: "ERR_PAGO",
        message: `No puede modificar un pago que no le pertenece`,
      });
    }
  }
  next();
};
