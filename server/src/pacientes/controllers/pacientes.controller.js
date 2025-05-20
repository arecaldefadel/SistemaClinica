import {
  addPacienteService,
  getObrasSocialesServices,
  getPacientesService,
  updatePacienteService,
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

  const requestAddPacientes = await addPacienteService({
    nombre,
    apellido,
    telefono,
    obraSocial,
  });

  return apiResponse(res, 204, `Paciente dado de alta correctamente.`);
};

export const updatePacienteController = async (req, res) => {
  const idPaciente = req.params.id;
  const data = req.body;

  console.log({ idPaciente, data });

  const result = await updatePacienteService(data);

  return apiResponse(res, 204, "Usuario Actualizado.");
  // if (!idPaciente) {
  //   return apiResponse(res, 400, "ID requerido");
  // }
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
