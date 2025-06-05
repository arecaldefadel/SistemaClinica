import express from "express";
import configuracion_router from "./configuracion/routes/configuracion.routes.js";
import users_router from "./users/routes/users.routes.js";
import pacientes_router from "./pacientes/routes/pacientes.routes.js";
import turnos_router from "./pacientes/routes/turnos.routes.js";
/*
  funcion router madre para el manejo
  de las rutas internas de cada servicio
*/

const routerGetway = (app) => {
  const router = express.Router();
  // version de la api
  app.use("/api/v1", router);

  // Rutas de cada servicio
  router.use("/configuracion", configuracion_router);
  router.use("/users", users_router);
  router.use("/pacientes", pacientes_router);
  router.use("/turnos", pacientes_router);
};

export default routerGetway;
