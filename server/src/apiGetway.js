import express from "express";
// import agent_router from "./agent/routes/agent.routes.js";
import users_router from "./users/routes/users.routes.js";
import pacientes_router from "./pacientes/routes/pacientes.routes.js";
/*
  funcion router madre para el manejo
  de las rutas internas de cada servicio
*/

const routerGetway = (app) => {
  const router = express.Router();
  // version de la api
  app.use("/api/v1", router);

  // Rutas de cada servicio
  // router.use('/', route);
  // router.use("/agent", agent_router);
  router.use("/users", users_router);
  router.use("/pacientes", pacientes_router);
};

export default routerGetway;
