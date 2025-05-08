import { enviarMensaje } from "../services/agent.service.js";

export const enviarMensajeController = async (req, res) => {
  const { id, message } = req.body;

  const request = await enviarMensaje({ id, message });
  return res.status(200).json({ error: false, msg: "Mensaje Enviado" });
};
