import express from "express";
import { loginController } from "../controllers/users.controller.js";
import { verifyToken } from "../middlewares/users.middleware.js";

// requiero el ruteador
const router = express.Router();

// Endpoints
router.get("/ping", (req, res) => {
  res.status(200).send("Conexión exitosa");
});
router.post("/login", loginController);
router.get("/me", verifyToken, (req, res) => {
  res.status(200).send("Conexión exitosa");
});
/*

("/register", verifyToken, () => {})
("/reset-password", verifyToken, () => {})
("/get-user", verifyToken, () => {})
("/get-users", verifyToken, () => {})
("/update-user", verifyToken, () => {})
("/delete-user", verifyToken, () => {})

*/

export default router;
