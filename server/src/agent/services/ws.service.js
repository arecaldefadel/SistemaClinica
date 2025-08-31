import pkg from "whatsapp-web.js";
const { Client, LocalAuth, MessageMedia, Poll, Location } = pkg;
import { image as imageQr } from "qr-image";
import qrcode from "qrcode-terminal";
import fs from "fs";
import cron from "node-cron";
import { turnosDeHoy } from "../../pacientes/services/turnos.service.js";
import { formatDateArg } from "../../utils.js";
import dayjs from "dayjs";

const COMMANDS = {
  help: "!ping",
  confirmacion: "!confirmo",
  noasiste: "!noasisto",
};

let io = null;
let client = null;

export const setupWhatsAppSocket = (socketIO) => {
  io = socketIO;

  client = new Client({
    authStrategy: new LocalAuth({
      clientId: "clinic-system",
      dataPath: "./.wwebjs_auth",
    }),
    puppeteer: {
      headless: true,
      args: [
        "--disable-setuid-sandbox",
        "--unhandled-rejections=strict",
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor",
      ],
    },
    webVersion: "2.3000.1025915895",
    webVersionCache: {
      type: "local",
      path: "./.wwebjs_cache",
    },
  });

  // Generate and scan this code with your phone
  client.on("qr", (qr) => {
    generateImage(qr);
    qrcode.generate(qr, { small: true });

    // Emitir el QR a todos los clientes conectados
    if (io) {
      io.emit("whatsapp:qr", { qr, timestamp: Date.now() });
    }
  });

  client.on("ready", () => {
    client.getWWebVersion().then((version) => {
      console.log("Bot Activo. WhatsApp Web version:", version);

      // Emitir estado de conexión
      if (io) {
        io.emit("whatsapp:ready", {
          status: "connected",
          version,
          timestamp: Date.now(),
        });
      }
    });
  });

  client.on("auth_failure", () => {
    console.log("LOGIN_FAIL");

    // Emitir fallo de autenticación
    if (io) {
      io.emit("whatsapp:auth_failure", {
        status: "auth_failed",
        timestamp: Date.now(),
      });
    }
  });

  client.on("disconnected", (reason) => {
    console.log("Se há cerrado sesión.", reason);

    // Emitir desconexión
    if (io) {
      io.emit("whatsapp:disconnected", {
        status: "disconnected",
        reason,
        timestamp: Date.now(),
      });
    }
  });

  client.on("loading_screen", (percent, message) => {
    // Emitir progreso de carga
    if (io) {
      io.emit("whatsapp:loading", {
        percent,
        message,
        timestamp: Date.now(),
      });
    }
  });

  // Manejar el evento de logout de manera más segura
  client.on("logout", async (reason) => {
    console.log("Logout iniciado:", reason);

    try {
      // Esperar un poco antes de intentar limpiar
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Limpiar archivos de sesión de manera segura
      await cleanupSessionFiles();

      console.log("Sesión limpiada exitosamente");
    } catch (error) {
      console.warn("Advertencia al limpiar sesión:", error.message);
    }
    // Emitir evento de logout
    if (io) {
      io.emit("whatsapp:logout", {
        status: "logged_out",
        reason,
        timestamp: Date.now(),
      });
    }
  });

  // Inicializar el cliente
  client.initialize();

  // Configurar heartbeat de estado después de la inicialización
  setTimeout(() => {
    setupStatusHeartbeat(30000); // Emitir estado cada 30 segundos
  }, 5000); // Esperar 5 segundos después de la inicialización
};

// Función para limpiar archivos de sesión de manera segura
const cleanupSessionFiles = async () => {
  const sessionPath = "./.wwebjs_auth";

  try {
    if (fs.existsSync(sessionPath)) {
      // Función recursiva para eliminar directorios
      const removeDirectory = (path) => {
        if (fs.existsSync(path)) {
          fs.readdirSync(path).forEach((file) => {
            const curPath = `${path}/${file}`;
            if (fs.lstatSync(curPath).isDirectory()) {
              removeDirectory(curPath);
            } else {
              try {
                fs.unlinkSync(curPath);
              } catch (err) {
                // Si no se puede eliminar, solo loguear la advertencia
                console.warn(`No se pudo eliminar: ${curPath}`, err.message);
              }
            }
          });
          try {
            fs.rmdirSync(path);
          } catch (err) {
            console.warn(
              `No se pudo eliminar directorio: ${path}`,
              err.message
            );
          }
        }
      };

      removeDirectory(sessionPath);
    }
  } catch (error) {
    console.warn("Error al limpiar archivos de sesión:", error.message);
  }
};

// Función para cerrar sesión de manera segura
export const logoutWhatsApp = async () => {
  if (!client) {
    throw new Error("Cliente de WhatsApp no inicializado");
  }

  try {
    console.log("Iniciando logout de WhatsApp...");

    // Cerrar sesión de manera segura
    await client.logout();

    // Esperar un poco antes de limpiar
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Limpiar archivos de sesión
    await cleanupSessionFiles();

    console.log("Logout completado exitosamente");
    return { success: true, message: "Logout completado" };
  } catch (error) {
    console.error("Error durante logout:", error);

    // Intentar limpiar archivos de sesión incluso si hay error
    try {
      await cleanupSessionFiles();
    } catch (cleanupError) {
      console.warn("Error al limpiar archivos:", cleanupError.message);
    }

    throw error;
  }
};

// Función para reiniciar el cliente
export const restartWhatsApp = async () => {
  try {
    console.log("Reiniciando cliente de WhatsApp...");

    if (client) {
      // Cerrar el cliente actual
      await client.destroy();
      client = null;
    }

    // Limpiar archivos de sesión
    await cleanupSessionFiles();

    // Reinicializar
    setupWhatsAppSocket(io);

    console.log("Cliente de WhatsApp reiniciado");
    return { success: true, message: "Cliente reiniciado" };
  } catch (error) {
    console.error("Error al reiniciar:", error);
    throw error;
  }
};

const generateImage = (base64) => {
  const path = `${process.cwd()}/tmp`;
  let qr_svg = imageQr(base64, { type: "svg", margin: 4 });
  qr_svg.pipe(fs.createWriteStream(`${path}/qr.svg`));
  console.log(`⚡ Recuerda que el QR se actualiza cada minuto ⚡'`);
};

export const sendMessage = async ({ id, message }) => {
  if (!client) {
    throw new Error("Cliente de WhatsApp no inicializado");
  }

  const chatId = `${id}@c.us`;
  try {
    await client.sendMessage(chatId, message);
  } catch (err) {
    if (
      err.message.includes("serialize") ||
      err.message.includes("getMessageModel")
    ) {
      // console.warn("⚠️ Mensaje enviado pero error al serializar respuesta.");
    } else {
      throw err; // solo relanzás errores importantes
    }
  }
};

// Función para obtener el estado actual del cliente
export const getWhatsAppStatus = async () => {
  try {
    if (!client) {
      return {
        status: "not_initialized",
        message: "Cliente de WhatsApp no ha sido inicializado",
        timestamp: Date.now(),
        connected: false,
      };
    }

    // Verificar si el cliente está autenticado
    const isAuthenticated = client.authStrategy;

    // Verificar si la página de Puppeteer está disponible
    const hasPupPage = client.pupPage;

    // Verificar si el cliente está listo
    const isReady = hasPupPage && isAuthenticated;

    // Obtener información adicional del cliente
    let clientInfo = {};
    const estadoReal = await client.getState();

    if (estadoReal === "CONNECTED") {
      try {
        // Obtener información del cliente si está disponible
        if (client.info) {
          clientInfo = {
            wid: client.info.wid,
            platform: client.info.platform,
            pushname: client.info.pushname,
          };

          return {
            status: "connected",
            message: "Cliente de WhatsApp conectado y funcionando",
            timestamp: Date.now(),
            connected: true,
            isConnected: true,
            clientInfo: clientInfo,
          };
        }
      } catch (error) {
        return {
          status: "error",
          message: "Error al verificar estado del cliente",
          timestamp: Date.now(),
          connected: false,
          error: error.message,
        };
      }
    } else {
      // Determinar el estado específico
      let specificStatus = "disconnected";
      let specificMessage = "Cliente de WhatsApp desconectado";

      if (!isAuthenticated) {
        specificStatus = "not_authenticated";
        specificMessage = "Cliente no autenticado";
      } else if (!hasPupPage) {
        specificStatus = "no_puppeteer_page";
        specificMessage = "Página de Puppeteer no disponible";
      }

      return {
        status: specificStatus,
        message: specificMessage,
        timestamp: Date.now(),
        connected: false,
        authenticated: isAuthenticated,
        hasPupPage: hasPupPage,
      };
    }
  } catch (error) {
    return {
      status: "error",
      message: "Error al obtener estado del cliente",
      timestamp: Date.now(),
      connected: false,
      error: error.message,
    };
  }
};

// Función para obtener información detallada del cliente
export const getWhatsAppClientInfo = async () => {
  try {
    if (!client) {
      return {
        error: "Cliente de WhatsApp no inicializado",
        timestamp: Date.now(),
      };
    }

    const info = {
      timestamp: Date.now(),
      authStrategy: client.authStrategy
        ? {
            type: client.authStrategy.constructor.name,
            isAuthenticated: client.authStrategy.isAuthenticated,
          }
        : null,
      puppeteer: {
        hasPage: !!client.pupPage,
        pageClosed: client.pupPage ? client.pupPage._closed : true,
      },
      webVersion: null,
      connectionState: null,
    };

    // Obtener versión de WhatsApp Web si está disponible
    try {
      if (client.getWWebVersion) {
        info.webVersion = await client.getWWebVersion();
      }
    } catch (error) {
      info.webVersion = "No disponible";
    }

    // Obtener información del cliente si está disponible
    if (client.info) {
      info.clientInfo = {
        // wid: client.info.wid,
        // platform: client.info.platform,
        // pushname: client.info.pushname,
        // businessHours: client.info.businessHours,
        status: client.info.status,
      };
    }

    // Verificar estado de conexión
    try {
      if (client.isConnected) {
        info.connectionState = await client.isConnected();
      }
    } catch (error) {
      info.connectionState = "Error al verificar";
    }

    return info;
  } catch (error) {
    return {
      error: error.message,
      timestamp: Date.now(),
    };
  }
};

// // Función para verificar la salud de la conexión
// export const checkWhatsAppHealth = async () => {
//   try {
//     const status = await getWhatsAppStatus();
//     const clientInfo = await getWhatsAppClientInfo();

//     const health = {
//       timestamp: Date.now(),
//       overall: "unknown",
//       status: status,
//       clientInfo: clientInfo,
//       checks: {
//         clientInitialized: !!client,
//         authentication: status.authenticated || false,
//         puppeteerPage: status.hasPupPage || false,
//         connection: status.connected || false,
//       },
//     };

//     // Determinar salud general
//     if (
//       health.checks.clientInitialized &&
//       health.checks.authentication &&
//       health.checks.puppeteerPage &&
//       health.checks.connection
//     ) {
//       health.overall = "healthy";
//     } else if (
//       health.checks.clientInitialized &&
//       health.checks.authentication
//     ) {
//       health.overall = "degraded";
//     } else if (health.checks.clientInitialized) {
//       health.overall = "poor";
//     } else {
//       health.overall = "critical";
//     }

//     return health;
//   } catch (error) {
//     return {
//       timestamp: Date.now(),
//       overall: "error",
//       error: error.message,
//     };
//   }
// };

// Función para emitir el estado actual del cliente a través de Socket.IO
export const emitWhatsAppStatus = async () => {
  try {
    if (!io) {
      console.warn("Socket.IO no está disponible para emitir estado");
      return;
    }

    const status = await getWhatsAppStatus();
    // Emitir estado específico según el estado actual
    if (status?.connected) {
      io.emit("whatsapp:connected", {
        status: "connected",
        timestamp: Date.now(),
        // clientInfo: status.clientInfo,
      });
    } else {
      io.emit("whatsapp:disconnected", {
        status: status.status,
        message: status.message,
        timestamp: Date.now(),
      });
    }

    return { success: true, emitted: true };
  } catch (error) {
    console.error("Error al emitir estado de WhatsApp:", error);

    if (io) {
      io.emit("whatsapp:error", {
        error: "Error al obtener estado del cliente",
        message: error.message,
        timestamp: Date.now(),
      });
    }

    return { success: false, error: error.message };
  }
};

// Función para configurar un heartbeat que emita el estado periódicamente
export const setupStatusHeartbeat = (intervalMs = 30000) => {
  if (!io) {
    console.warn("Socket.IO no disponible para heartbeat de estado");
    return;
  }

  // Limpiar intervalos existentes si los hay
  if (global.whatsappStatusInterval) {
    clearInterval(global.whatsappStatusInterval);
  }

  // Configurar nuevo intervalo
  global.whatsappStatusInterval = setInterval(async () => {
    try {
      await emitWhatsAppStatus();
    } catch (error) {
      console.warn("Error en heartbeat de estado:", error.message);
    }
  }, intervalMs);

  console.log(
    `Heartbeat de estado de WhatsApp configurado cada ${intervalMs}ms`
  );
};

// Función para detener el heartbeat de estado
export const stopStatusHeartbeat = () => {
  if (global.whatsappStatusInterval) {
    clearInterval(global.whatsappStatusInterval);
    global.whatsappStatusInterval = null;
    console.log("Heartbeat de estado de WhatsApp detenido");
  }
};

// Función para limpiar recursos y detener servicios
export const cleanupWhatsAppServices = () => {
  try {
    // Detener heartbeat de estado
    stopStatusHeartbeat();

    // Limpiar intervalos globales
    if (global.whatsappStatusInterval) {
      clearInterval(global.whatsappStatusInterval);
      global.whatsappStatusInterval = null;
    }

    console.log("Servicios de WhatsApp limpiados exitosamente");
    return { success: true, message: "Servicios limpiados" };
  } catch (error) {
    console.error("Error al limpiar servicios:", error);
    return { success: false, error: error.message };
  }
};

// Función para reiniciar solo los servicios de estado (sin reiniciar el cliente)
export const restartStatusServices = () => {
  try {
    // Detener servicios actuales
    cleanupWhatsAppServices();

    // Reiniciar heartbeat
    if (io) {
      setupStatusHeartbeat(30000);
    }

    console.log("Servicios de estado de WhatsApp reiniciados");
    return { success: true, message: "Servicios de estado reiniciados" };
  } catch (error) {
    console.error("Error al reiniciar servicios de estado:", error);
    return { success: false, error: error.message };
  }
};

/*
 * DOCUMENTACIÓN DE USO DE LAS FUNCIONES DE ESTADO DE WHATSAPP
 *
 * FUNCIONES PRINCIPALES:
 *
 * 1. getWhatsAppStatus() - Obtiene el estado completo del cliente de forma asíncrona
 *    Retorna: { status, message, timestamp, connected, authenticated, hasPupPage, clientInfo }
 *
 *
 * 3. getWhatsAppClientInfo() - Obtiene información detallada del cliente
 *    Retorna: { timestamp, authStrategy, puppeteer, webVersion, connectionState, clientInfo }
 *
 * 4. checkWhatsAppHealth() - Verifica la salud general de la conexión
 *    Retorna: { timestamp, overall, status, clientInfo, checks }
 *    Estados de salud: "healthy", "degraded", "poor", "critical", "error"
 *
 *
 * FUNCIONES DE COMUNICACIÓN:
 *
 * 6. emitWhatsAppStatus() - Emite el estado actual a través de Socket.IO
 *    Eventos emitidos: "whatsapp:status_update", "whatsapp:connected", "whatsapp:disconnected"
 *
 * 7. setupStatusHeartbeat(intervalMs) - Configura emisión automática de estado
 *    Por defecto emite cada 30 segundos
 *
 * 8. stopStatusHeartbeat() - Detiene la emisión automática de estado
 *
 * FUNCIONES DE MANTENIMIENTO:
 *
 * 9. cleanupWhatsAppServices() - Limpia recursos y detiene servicios
 * 10. restartStatusServices() - Reinicia solo los servicios de estado
 *
 * EJEMPLO DE USO:
 *
 * // Obtener estado actual
 * const status = await getWhatsAppStatus();
 * console.log('Estado:', status.status);
 *
 * // Verificar salud
 * const health = await checkWhatsAppHealth();
 * console.log('Salud:', health.overall);
 *
 * // Emitir estado a clientes
 * await emitWhatsAppStatus();
 *
 * // Configurar monitoreo automático
 * setupStatusHeartbeat(60000); // Cada minuto
 */
