import {
  addTurnoService,
  deleteTurnoService,
  diferenciaEntreTurnosService,
  getStatsService,
  getTurnosPorMesService,
  getTurnosService,
  setTurnoAtendidoService,
  updateTurnoService,
} from "../services/turnos.service.js";

import {
  apiResponse,
  esFechaAnterior,
  isDateValid,
  isTimeValid,
  validateFields,
} from "../../utils/index.js";

export const getTurnosPorMesController = async (req, res) => {
  const { paramsFilter } = req.query;

  const request = await getTurnosPorMesService({ paramsFilter });

  if (request?.status === "500") {
    return apiResponse(res, 500, request.message);
  }

  if (request.meta.total < 1)
    return apiResponse(res, 200, "No se han encontrado registros.", request);

  return apiResponse(res, 200, "Turno encontrado", request);
};

export const getTurnosController = async (req, res) => {
  const { page, pageSize, paramsFilter } = req.query;

  const request = await getTurnosService({ page, pageSize, paramsFilter });

  if (request?.status === "500") {
    return apiResponse(res, 500, request.message);
  }

  if (request.meta.total < 1)
    return apiResponse(res, 200, "No se han encontrado registros.", request);

  return apiResponse(res, 200, "Turno encontrado", request);
};

export const addTurnoController = async (req, res) => {
  const { paciente, fecha, hora } = req.body;
  const validadDatos = validateFields(req.body, ["paciente", "fecha", "hora"]);

  if (!validadDatos.valid) {
    return apiResponse(
      res,
      400,
      `El campo ${validadDatos.missing} es obligatorio.`
    );
  }

  if (!isDateValid(fecha)) {
    return apiResponse(
      res,
      400,
      `El campo ${validadDatos.missing} es obligatorio.`
    );
  }

  if (!isTimeValid) {
    return apiResponse(
      res,
      400,
      `El campo ${validadDatos.missing} es obligatorio.`
    );
  }

  const noSuperpone = await diferenciaEntreTurnosService({ fecha, hora });
  if (!noSuperpone)
    return apiResponse(res, 400, `El turno se superpone con otro.`);

  const requestAddTurnos = await addTurnoService({ paciente, fecha, hora });

  return apiResponse(res, 204, `Turno dado de alta correctamente.`);
};

export const updateTurnoController = async (req, res) => {
  const idTurno = req.params.id;
  const data = req.body;

  if (!idTurno) {
    return apiResponse(res, 400, "Turno requerido");
  }
  try {
    const result = await updateTurnoService(data);
    if (result.error) {
      return apiResponse(res, 500, "Error al eliminar.", result.message);
    }
  } catch (error) {
    return apiResponse(res, 500, "Error al eliminar.", error);
  }

  return apiResponse(res, 204, "Usuario Actualizado.");
};

export const deleteTurnoController = async (req, res) => {
  const idTurno = req.params.id;

  if (!idTurno) {
    return apiResponse(res, 400, "Turno requerido");
  }
  try {
    const result = await deleteTurnoService({ id: idTurno });
    if (result.error) {
      return apiResponse(res, 500, "Error al eliminar.", result.message);
    }
  } catch (error) {
    return apiResponse(res, 500, "Error al eliminar.", error);
  }
  return apiResponse(res, 204, "Turno Eliminado.");
};

export const setTurnoAtendidoController = async (req, res) => {
  const idTurno = req.params.id;
  const data = req.body;

  if (!idTurno) {
    return apiResponse(res, 400, "Turno requerido");
  }
  try {
    const result = await setTurnoAtendidoService(data);
    if (result.error) {
      return apiResponse(res, 500, "Error al eliminar.", result.message);
    }
  } catch (error) {
    return apiResponse(res, 500, "Error al eliminar.", error);
  }

  return apiResponse(res, 204, "Usuario Actualizado.");
};

export const diferenciaEntreTurnos = async (req, res) => {
  const { fecha, hora } = req.query;

  const request = await diferenciaEntreTurnosService({ fecha, hora });

  if (request?.status === "500") {
    return apiResponse(res, 500, request.message);
  }

  return apiResponse(res, 200, "Turno encontrado", request);
};

export const getStatsController = async (req, res) => {
  const request = await getStatsService();

  if (request?.status === "500") {
    return apiResponse(res, 500, request.message);
  }

  return apiResponse(res, 200, "", request);
};
