import {
  addTurnoService,
  deleteTurnoService,
  getTurnosService,
  reactiveTurnoService,
  updateTurnoService,
} from "../services/turnos.service.js";
import { apiResponse, validateFields } from "../../utils/index.js";

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
  const { obraSocial, nombre, apellido, telefono } = req.body;
  /*{
    "obraSociales": 5, 
    "nombre": "Augusto",
    "apellido": "Recalde",
    "telefono": "3718526576"
}
*/
  const validadDatos = validateFields(req.body, [
    "nombre",
    "apellido",
    "telefono",
  ]);

  if (!validadDatos.valid)
    return apiResponse(
      res,
      400,
      `El campo ${validadDatos.missing} es obligatorio.`
    );

  const requestAddTurnos = await addTurnoService({
    nombre,
    apellido,
    telefono,
    obraSocial,
  });

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
  return apiResponse(res, 204, "Usuario Actualizado.");
};
