import {
  enviarMensaje,
  enviarNotificacionPacientes,
} from "../services/agent.service.js";

export const enviarMensajeController = async (req, res) => {
  const { id, message } = req.body;

  const request = await enviarMensaje({ id, message });
  return res.status(200).json({ error: false, msg: "Mensaje Enviado" });
};

export const enviarNotificacionController = async (req, res) => {
  const request = await enviarNotificacionPacientes();
  return res.status(200).json({ error: false, request: request.enviados });
};
