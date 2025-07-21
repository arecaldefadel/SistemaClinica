import express from "express";
import * as TurnosController from "../controllers/turnos.controller.js";
import { verifyToken } from "../../users/middlewares/users.middleware.js";
import { validarTurno } from "../middleware/validarTurno.js";

// requiero el ruteador
const router = express.Router();

// Endpoints
router.get("/stats", verifyToken, TurnosController.getStatsController);
router.get("/diferencia", verifyToken, TurnosController.diferenciaEntreTurnos);
router.get("/porMes", verifyToken, TurnosController.getTurnosPorMesController);
router.get("/", verifyToken, TurnosController.getTurnosController);
router.post(
  "/",
  verifyToken,
  validarTurno,
  TurnosController.addTurnoController
);
router.put("/:id", verifyToken, TurnosController.updateTurnoController);
router.delete("/:id", verifyToken, TurnosController.deleteTurnoController);
router.put(
  "/:id/atendido",
  verifyToken,
  TurnosController.setTurnoAtendidoController
);

export default router;
