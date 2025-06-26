import {
  addPacienteService,
  deletePacienteService,
  getObrasSocialesServices,
  getPacientesService,
  reactivePacienteService,
  updatePacienteService,
} from "../services/pacientes.service.js";
import { apiResponse, validateFields } from "../../utils/index.js";

export const getPacientesController = async (req, res) => {
  const { page, pageSize, paramsFilter } = req.query;

  const request = await getPacientesService({ page, pageSize, paramsFilter });

  if (request?.status === "500") {
    return apiResponse(res, 500, request.message);
  }

  if (request.meta.total < 1)
    return apiResponse(res, 200, "No se han encontrado registros.", request);

  return apiResponse(res, 200, "Paciente encontrado", request);
};

export const addPacienteController = async (req, res) => {
  const { obraSocial, nombre, apellido, documento, telefono } = req.body;
  const validadDatos = validateFields(req.body, [
    "nombre",
    "apellido",
    "telefono",
    "documento",
  ]);

  if (!validadDatos.valid)
    return apiResponse(
      res,
      400,
      `El campo ${validadDatos.missing} es obligatorio.`
    );

  const requestAddPacientes = await addPacienteService({
    nombre,
    apellido,
    telefono,
    documento,
    obraSocial,
  });

  return apiResponse(res, 204, `Paciente dado de alta correctamente.`);
};

export const updatePacienteController = async (req, res) => {
  const idPaciente = req.params.id;
  const data = req.body;

  if (!idPaciente) {
    return apiResponse(res, 400, "Paciente requerido");
  }
  try {
    const result = await updatePacienteService(data);
    if (result.error) {
      return apiResponse(res, 500, "Error al eliminar.", result.message);
    }
  } catch (error) {
    return apiResponse(res, 500, "Error al eliminar.", error);
  }

  return apiResponse(res, 204, "Usuario Actualizado.");
};

export const deletePacienteController = async (req, res) => {
  const idPaciente = req.params.id;

  if (!idPaciente) {
    return apiResponse(res, 400, "Paciente requerido");
  }
  try {
    const result = await deletePacienteService({ id: idPaciente });
    if (result.error) {
      return apiResponse(res, 500, "Error al eliminar.", result.message);
    }
  } catch (error) {
    return apiResponse(res, 500, "Error al eliminar.", error);
  }
  return apiResponse(res, 204, "Usuario Actualizado.");
};

export const reactivePacienteController = async (req, res) => {
  const idPaciente = req.params.id;

  if (!idPaciente) {
    return apiResponse(res, 400, "Paciente requerido");
  }
  try {
    const result = await reactivePacienteService({ id: idPaciente });
    if (result.error) {
      return apiResponse(res, 500, "Error al eliminar.", result.message);
    }
  } catch (error) {
    return apiResponse(res, 500, "Error al eliminar.", error);
  }
  return apiResponse(res, 204, "Usuario Actualizado.");
};

export const getObrasSocialesController = async (req, res) => {
  const { paramsFilter, page, pageSize } = req.query;

  const request = await getObrasSocialesServices({
    paramsFilter,
    page,
    pageSize,
  });

  return apiResponse(res, 200, "Ok", request);
};
