import {
  addPacienteService,
  getPacientesService,
} from "../services/pacientes.service.js";
import { apiResponse, validateFields } from "../../utils/index.js";

export const getPacientesController = async (req, res) => {
  const { page, pageSize } = req.query;

  const request = await getPacientesService({ page, pageSize });

  if (request?.status === "500") {
    return apiResponse(res, 500, request.message);
  }

  if (request.meta.total < 1)
    return apiResponse(res, 200, "No se han encontrado registros.", request);

  return apiResponse(res, 200, "Paciente encontrado", request);
};

export const addPacienteController = async (req, res) => {
  const { nombre, apellido, telefono } = req.body;
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

  const requestAddPacientes = await addPacienteService({
    nombre,
    apellido,
    telefono,
  });

  return apiResponse(res, 204, `Paciente dado de alta correctamente.`);
};
