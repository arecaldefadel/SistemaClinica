import express from "express";
import * as TurnosController from "../controllers/turnos.controller.js";
import { verifyToken } from "../../users/middlewares/users.middleware.js";

// requiero el ruteador
const router = express.Router();

// Endpoints
router.get("/", verifyToken, TurnosController.getTurnosController);
router.post("/", verifyToken, TurnosController.addTurnoController);
router.put("/:id", verifyToken, TurnosController.updateTurnoController);
router.delete("/:id", verifyToken, TurnosController.deleteTurnoController);

export default router;
