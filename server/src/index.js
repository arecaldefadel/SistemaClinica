import routerGetway from "./apiGateway.js";
import app from "./app.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { setupWhatsAppSocket } from "./agent/services/ws.service.js";

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // URL del cliente Vite
    // methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Configurar Socket.IO para WhatsApp
setupWhatsAppSocket(io);

server.listen(
  app.get("port"),
  console.log("Inicio el servidor de development", app.get("port"))
);
routerGetway(app);
