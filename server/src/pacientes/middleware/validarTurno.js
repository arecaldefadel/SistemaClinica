import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import { apiResponse } from "../../utils/index.js";
dayjs.extend(customParseFormat);

// Rango horario aceptado
const HORA_INICIO = "08:00";
const HORA_FIN = "20:00";

export const validarTurno = async (req, res, next) => {
  const { paciente, fecha, hora } = req.body;
  const errores = [];

  // idPaciente
  if (!paciente) {
    errores.push({
      code: "ERR_PATIENT_REQUIRED",
      message: "El paciente es obligatorio.",
    });
  } else if (isNaN(Number(paciente))) {
    errores.push({
      code: "ERR_PATIENT_INVALID",
      message: "El ID del paciente no es válido.",
    });
  }

  // fecha
  if (!fecha) {
    errores.push({
      code: "ERR_DATE_REQUIRED",
      message: "La fecha es obligatoria.",
    });
  } else if (!dayjs(fecha, "YYYY-MM-DD", true).isValid()) {
    errores.push({
      code: "ERR_DATE_FORMAT",
      message: "La fecha debe tener formato YYYY-MM-DD.",
    });
  } else {
    const hoy = dayjs().startOf("day");
    const fechaTurno = dayjs(fecha);
    if (fechaTurno.isBefore(hoy)) {
      errores.push({
        code: "ERR_DATE_PAST",
        message:
          "No se pueden asignar turnos en fechas anteriores a la de hoy.",
      });
    } else if (fechaTurno.diff(hoy, "year") > 1) {
      errores.push({
        code: "ERR_DATE_TOO_FUTURE",
        message: "La fecha es demasiado lejana.",
      });
    }
  }

  // hora
  if (!hora) {
    errores.push({
      code: "ERR_TIME_REQUIRED",
      message: "La hora es obligatoria.",
    });
  } else if (!/^\d{2}:\d{2}$/.test(hora)) {
    errores.push({
      code: "ERR_TIME_FORMAT",
      message: "La hora debe tener formato HH:mm.",
    });
  } else if (
    dayjs(hora, "HH:mm").isBefore(dayjs(HORA_INICIO, "HH:mm")) ||
    dayjs(hora, "HH:mm").isAfter(dayjs(HORA_FIN, "HH:mm"))
  ) {
    errores.push({
      code: "ERR_TIME_OUT_OF_RANGE",
      message: `Los turnos deben estar entre ${HORA_INICIO} y ${HORA_FIN}.`,
    });
  }

  if (errores.length > 0) {
    return apiResponse(res, 400, errores[0].message);
    //return res.status(400).json({ success: false, errores });
  }

  next();
};
