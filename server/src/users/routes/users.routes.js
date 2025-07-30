import express from "express";
import * as userController from "../controllers/users.controller.js";
import {
  verifyToken,
  validarNewPassword,
  loginLimiter,
} from "../middlewares/users.middleware.js";

// requiero el ruteador
const router = express.Router();

// Endpoints
router.get("/ping", (req, res) => {
  res.status(200).send("Conexión exitosa");
});
router.post("/inicio", loginLimiter, userController.loginController);
router.get("/me", verifyToken, (req, res) => {
  res.status(200).send("Conexión exitosa");
});

router.put(
  "/reset-password",
  verifyToken,
  validarNewPassword,
  userController.changePassController
);

/*

("/register", verifyToken, () => {})
("/get-user", verifyToken, () => {})
("/get-users", verifyToken, () => {})
("/update-user", verifyToken, () => {})
("/delete-user", verifyToken, () => {})

*/

export default router;
