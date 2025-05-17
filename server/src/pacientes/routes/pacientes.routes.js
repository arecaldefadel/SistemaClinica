import express from "express";
import * as PacientesController from "../controllers/pacientes.controller.js";
import { verifyToken } from "../../users/middlewares/users.middleware.js";

// requiero el ruteador
const router = express.Router();

// Endpoints
router.get("/ping", (req, res) => {
  res.status(200).send("Conexión exitosa");
});
router.get("/", verifyToken, PacientesController.getPacientesController);
router.post("/", verifyToken, PacientesController.addPacienteController);
// router.get("/:id", PacientesController);
// router.put("/:id", PacientesController);
// router.delete("/:id", PacientesController);

export default router;
