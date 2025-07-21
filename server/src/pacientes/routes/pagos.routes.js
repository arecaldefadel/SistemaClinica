import express from "express";
import * as PagosControllers from "../controllers/pagos.controller.js";
import { verifyToken } from "../../users/middlewares/users.middleware.js";
import { validarPago } from "../middleware/validarPago.js";

// requiero el ruteador
const router = express.Router();

// Endpoints
router.get("/resumen", verifyToken, PagosControllers.getPagosController);
router.get(
  "/historial/:id",
  verifyToken,
  PagosControllers.getHistorialPagosController
);
router.get(
  "/estadosPago",
  verifyToken,
  PagosControllers.getEstadosPagoController
);

router.post("/", verifyToken, validarPago, PagosControllers.addPagoController);
router.put(
  "/:id",
  verifyToken,
  validarPago,
  PagosControllers.updatePagoController
);
router.delete("/:id", verifyToken, PagosControllers.deletePagoController);
export default router;
