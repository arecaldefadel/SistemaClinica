import {
  enviarMensaje,
  enviarNotificacionPacientes,
} from "../services/agent.service.js";
import {
  emitWhatsAppStatus,
  getWhatsAppStatus,
  logoutWhatsApp,
  restartWhatsApp,
} from "../services/ws.service.js";

export const enviarMensajeController = async (req, res) => {
  const { id, message } = req.body;

  const request = await enviarMensaje({ id, message });
  return res.status(200).json({ error: false, msg: "Mensaje Enviado" });
};

export const enviarNotificacionController = async (req, res) => {
  const request = await enviarNotificacionPacientes();
  return res.status(200).json({ error: false, request: request.enviados });
};

export const logoutWhatsAppController = async (req, res) => {
  try {
    const result = await logoutWhatsApp();
    return res.status(200).json({
      error: false,
      message: "WhatsApp desconectado exitosamente",
      data: result,
    });
  } catch (error) {
    console.error("Error en logout controller:", error);
    return res.status(500).json({
      error: true,
      message: "Error al desconectar WhatsApp",
      details: error.message,
    });
  }
};

export const restartWhatsAppController = async (req, res) => {
  try {
    const result = await restartWhatsApp();
    return res.status(200).json({
      error: false,
      message: "WhatsApp reiniciado exitosamente",
      data: result,
    });
  } catch (error) {
    console.error("Error en restart controller:", error);
    return res.status(500).json({
      error: true,
      message: "Error al reiniciar WhatsApp",
      details: error.message,
    });
  }
};

export const getStatusWhatsapp = async (req, res) => {
  const result = await emitWhatsAppStatus();
  return res.status(200).json({ error: false, result });
};
