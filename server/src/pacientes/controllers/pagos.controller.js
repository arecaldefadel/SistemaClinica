import { apiResponse, validateFields } from "../../utils/index.js";
import {
  addPagoService,
  deletePagoService,
  getEstadosPagoService,
  getHistorialPagosService,
  getPagosService,
  updatePagoService,
} from "../services/pagos.service.js";

export const getPagosController = async (req, res) => {
  const { paramsFilter, page, pageSize } = req.query;

  const request = await getPagosService({
    paramsFilter,
    page,
    pageSize,
  });

  return apiResponse(res, 200, "Ok", request);
};

export const getHistorialPagosController = async (req, res) => {
  const { paramsFilter, page, pageSize } = req.query;
  const { id } = req.params;
  if (!id) return apiResponse(res, 400, "El paciente es obligatorio");
  const request = await getHistorialPagosService({
    id,
    paramsFilter,
    page,
    pageSize,
  });

  return apiResponse(res, 200, "Ok", request);
};

export const getEstadosPagoController = async (req, res) => {
  const request = await getEstadosPagoService();

  return apiResponse(res, 200, "Ok", request);
};

export const addPagoController = async (req, res) => {
  const { estado, plus, paciente, periodo, observacion } = req.body;
  //console.log({ estado, plus, paciente, periodo, observacion, usuario });
  const requestAddTurnos = await addPagoService({
    estado,
    plus,
    paciente,
    periodo,
    observacion,
    usuario: req.userId || null,
  });

  return apiResponse(res, 204, `Turno dado de alta correctamente.`);
};

export const updatePagoController = async (req, res) => {
  const { estado, plus, periodo, observacion } = req.body;
  const { id } = req.params;
  const requestUpdate = await updatePagoService({
    estado,
    plus,
    periodo,
    observacion,
    usuario: req.userId || null,
    id,
  });

  if (requestUpdate.status == "error") {
    return apiResponse(res, 400, requestUpdate.message);
  }
  return apiResponse(res, 204, `Turno dado de alta correctamente.`);
};

export const deletePagoController = async (req, res) => {
  const idPago = req.params.id;

  if (!idPago) {
    return apiResponse(res, 400, "Pago requerido");
  }
  try {
    const result = await deletePagoService({ id: idPago });
    if (result.error) {
      return apiResponse(res, 500, "Error al eliminar.", result.message);
    }
  } catch (error) {
    return apiResponse(res, 500, "Error al eliminar.", error);
  }
  return apiResponse(res, 204, "Pago Eliminado.");
};
