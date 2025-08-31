// Configuración para Socket.IO
export const SOCKET_CONFIG = {
  // URL del servidor de Socket.IO
  SERVER_URL: import.meta.env.VITE_SOCKET_SERVER_URL || "http://localhost:3002",

  // Eventos de WhatsApp
  EVENTS: {
    WHATSAPP_QR: "whatsapp:qr",
    WHATSAPP_READY: "whatsapp:ready",
    WHATSAPP_AUTH_FAILURE: "whatsapp:auth_failure",
    WHATSAPP_DISCONNECTED: "whatsapp:disconnected",
    WHATSAPP_LOADING: "whatsapp:loading",
    WHATSAPP_LOGOUT: "whatsapp:logout",
  },

  // Estados de conexión
  STATUS: {
    CONNECTED: "connected",
    DISCONNECTED: "disconnected",
    QR_READY: "qr_ready",
    LOADING: "loading",
    ERROR: "error",
    AUTH_FAILED: "auth_failed",
    LOGGED_OUT: "logged_out",
  },

  // Configuración de reconexión
  RECONNECTION: {
    ENABLED: true,
    DELAY: 1000,
    MAX_ATTEMPTS: 5,
  },
};

// Función para obtener la URL del servidor según el entorno
export const getSocketServerUrl = () => {
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_SOCKET_SERVER_URL || window.location.origin;
  }
  return SOCKET_CONFIG.SERVER_URL;
};
