import express from "express";
import {
  enviarMensajeController,
  enviarNotificacionController,
  logoutWhatsAppController,
  restartWhatsAppController,
  getStatusWhatsapp,
} from "../controllers/agent.controller.js";
import { verifyToken } from "../../users/middlewares/users.middleware.js";
// requiero el ruteador
const router = express.Router();

// Endpoints
router.post("/ping", (req, res) => {
  res.status(200).send(`${req.body.id}: ${req.body.message}`);
});

router.post("/send", enviarMensajeController);
router.get("/notifications", verifyToken, enviarNotificacionController);

// Nuevas rutas para gestión de WhatsApp
router.post("/logout", verifyToken, logoutWhatsAppController);
router.post("/restart", verifyToken, restartWhatsAppController);
router.get("/status", verifyToken, getStatusWhatsapp);

export default router;
