import { apiResponse, validateFields, nvl } from "../../utils/index.js";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek.js";
import { dbExecute } from "../../utils/db.js";

dayjs.extend(isoWeek);

export const verificarPagoExistente = async (idPaciente, periodo) => {
  const fecha = dayjs();

  let rangoInicio, rangoFin;
  const periodos = ["dia", "semana", "mes"];
  const rangoFecha = {
    dia: () => {
      rangoInicio = rangoFin = fecha.format("YYYY-MM-DD");
    },
    semana: () => {
      rangoInicio = fecha.startOf("isoWeek").format("YYYY-MM-DD");
      rangoFin = fecha.endOf("isoWeek").format("YYYY-MM-DD");
    },
    mes: () => {
      rangoInicio = fecha.startOf("month").format("YYYY-MM-DD");
      rangoFin = fecha.endOf("month").format("YYYY-MM-DD");
    },
  };

  rangoFecha[periodos[periodo - 1]]();
  console.log(periodo, periodos[periodo - 1]);

  const { data } = await dbExecute(
    `
    SELECT DATE_FORMAT(pg_fpago, "%d-%m-%Y %H:%i") FECHA_PAGO FROM pagos_clientes
    WHERE cliente_id = ?
      AND pg_periodo = ?
      AND pg_fpago BETWEEN ? AND ?
    LIMIT 1
  `,
    [idPaciente, periodo, rangoInicio, rangoFin]
  );
  console.log(data);
  return { estado: data.length > 0, fecha: data[0]?.FECHA_PAGO || "" };
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
  if (!nvl(idPago) === 0) {
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
  }
  next();
};
