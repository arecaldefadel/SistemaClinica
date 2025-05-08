import express from "express";
import agent_router from "./agent/routes/agent.routes.js";
import users_router from "./users/routes/users.routes.js";
/*
  funcion router madre para el manejo
  de las rutas internas de cada servicio
*/

const routerGetway = (app) => {
  const router = express.Router();
  // version de la api
  app.use("/api/v1", router);
  app.use("/api/v1/agent", agent_router);
  app.use("/api/v1/users", users_router);
  // Rutas de cada servicio
  // router.use('/', route);
};

export default routerGetway;
