import express from "express";
import { enviarMensajeController } from "../controllers/agent.controller.js";

// requiero el ruteador
const router = express.Router();

// Endpoints
router.get("/ping", (req, res) => {
  res.status(200).send("Conexión exitosa");
});

router.post("/send", enviarMensajeController);

export default router;
