import express from "express";
import { loginController } from "../controllers/users.controller.js";

// requiero el ruteador
const router = express.Router();

// Endpoints
router.get("/ping", (req, res) => {
  res.status(200).send("Conexión exitosa");
});
router.post("/login", loginController);

export default router;
