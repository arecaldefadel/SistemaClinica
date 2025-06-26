import routerGetway from "./apiGateway.js";
import app from "./app.js";

app.listen(
  app.get("port"),
  console.log("Inicio el servidor de development", app.get("port"))
);
routerGetway(app);
