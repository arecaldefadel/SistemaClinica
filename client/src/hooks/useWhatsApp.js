import { useEffect, useState, useCallback, useRef } from "react";
import { io } from "socket.io-client";
import { getSocketServerUrl, SOCKET_CONFIG } from "@/utilities/socketConfig";
import api from "@/utilities/apiClient";

// Singleton para el socket - se comparte entre todas las instancias del hook
let globalSocket = null;
let globalSocketListeners = new Set();
let isGlobalSocketInitialized = false;

// Función para emitir eventos a todos los listeners
const emitToAllListeners = (event, data) => {
  globalSocketListeners.forEach((listener) => {
    if (listener && typeof listener === "function") {
      listener(event, data);
    }
  });
};

// Función para inicializar el socket global
const initializeGlobalSocket = () => {
  if (isGlobalSocketInitialized || globalSocket) {
    return;
  }

  try {
    const serverUrl = getSocketServerUrl();
    // console\.log("Inicializando Socket.IO global en:", serverUrl);

    globalSocket = io(serverUrl, {
      reconnection: SOCKET_CONFIG.RECONNECTION.ENABLED,
      reconnectionDelay: SOCKET_CONFIG.RECONNECTION.DELAY,
      maxReconnectionAttempts: SOCKET_CONFIG.RECONNECTION.MAX_ATTEMPTS,
      timeout: 5000,
    });

    // Configurar eventos del socket global
    globalSocket.on("connect", () => {
      // console\.log("Socket.IO global conectado");
      emitToAllListeners("connect", {});
    });

    globalSocket.on("disconnect", () => {
      // console\.log("Socket.IO global desconectado");
      emitToAllListeners("disconnect", {});
    });

    globalSocket.on("reconnect", (attemptNumber) => {
      emitToAllListeners("reconnect", { attemptNumber });
    });

    globalSocket.on("reconnect_failed", () => {
      // console\.log("Socket.IO global falló la reconexión");
      emitToAllListeners("reconnect_failed", {});
    });
    globalSocket.on("whatsapp:connected", (data) => {
      // console\.log("WhatsApp conectado globalmente:", data);
      emitToAllListeners("whatsapp:ready", data);
    });

    globalSocket.on(SOCKET_CONFIG.EVENTS.WHATSAPP_QR, (data) => {
      // console\.log("Nuevo QR recibido globalmente:", data);
      emitToAllListeners("whatsapp:qr", data);
    });

    globalSocket.on(SOCKET_CONFIG.EVENTS.WHATSAPP_READY, (data) => {
      // console\.log("WhatsApp conectado globalmente:", data);
      emitToAllListeners("whatsapp:ready", data);
    });

    globalSocket.on(SOCKET_CONFIG.EVENTS.WHATSAPP_AUTH_FAILURE, (data) => {
      // console\.log("Fallo de autenticación global:", data);
      emitToAllListeners("whatsapp:auth_failure", data);
    });

    globalSocket.on(SOCKET_CONFIG.EVENTS.WHATSAPP_DISCONNECTED, (data) => {
      // console\.log("WhatsApp desconectado globalmente:", data);
      emitToAllListeners("whatsapp:disconnected", data);
    });

    globalSocket.on(SOCKET_CONFIG.EVENTS.WHATSAPP_LOADING, (data) => {
      // console\.log("Cargando WhatsApp globalmente:", data);
      emitToAllListeners("whatsapp:loading", data);
    });

    // Nuevo evento para logout
    globalSocket.on("whatsapp:logout", (data) => {
      // console\.log("WhatsApp logout global:", data);
      emitToAllListeners("whatsapp:logout", data);
    });

    globalSocket.on("connect_error", (error) => {
      console.error("Error de conexión global:", error);
      emitToAllListeners("connect_error", { error: error.message });
    });

    isGlobalSocketInitialized = true;
  } catch (err) {
    console.error("Error al inicializar socket global:", err);
    emitToAllListeners("error", { error: "Error al crear la conexión" });
  }
};

export const useWhatsApp = () => {
  const [qrCode, setQrCode] = useState(null);
  const [status, setStatus] = useState(SOCKET_CONFIG.STATUS.LOADING);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reconnectionAttempts, setReconnectionAttempts] = useState(0);

  // Referencia para el listener de este hook
  const listenerRef = useRef(null);

  // Función para manejar eventos del socket
  const handleSocketEvent = useCallback((event, data) => {
    switch (event) {
      case "connect":
        setError(null);
        setReconnectionAttempts(0);
        break;
      case "disconnect":
        setStatus(SOCKET_CONFIG.STATUS.DISCONNECTED);
        break;
      case "reconnect":
        setReconnectionAttempts(data.attemptNumber || 0);
        break;
      case "reconnect_failed":
        setError(
          "No se pudo reconectar al servidor después de múltiples intentos"
        );
        setStatus(SOCKET_CONFIG.STATUS.ERROR);
        break;
      case "whatsapp:qr":
        setQrCode(data.qr);
        setStatus(SOCKET_CONFIG.STATUS.QR_READY);
        setLoading(false);
        setError(null);
        break;
      case "whatsapp:ready":
        setStatus(SOCKET_CONFIG.STATUS.CONNECTED);
        setQrCode(null);
        setLoading(false);
        setError(null);
        break;
      case "whatsapp:connected":
        setStatus(SOCKET_CONFIG.STATUS.CONNECTED);
        setQrCode(null);
        setLoading(false);
        setError(null);
        break;
      case "whatsapp:auth_failure":
        setStatus(SOCKET_CONFIG.STATUS.AUTH_FAILED);
        setLoading(false);
        setError("Fallo en la autenticación de WhatsApp");
        break;
      case "whatsapp:disconnected":
        setStatus(SOCKET_CONFIG.STATUS.DISCONNECTED);
        setQrCode(null);
        setError(null);
        break;
      case "whatsapp:loading":
        setLoading(true);
        setError(null);
        break;
      case "whatsapp:logout":
        setStatus(SOCKET_CONFIG.STATUS.DISCONNECTED);
        setQrCode(null);
        setLoading(false);
        setError(null);
        break;
      case "connect_error":
        setError("Error al conectar con el servidor");
        setStatus(SOCKET_CONFIG.STATUS.ERROR);
        break;
      case "error":
        setError(data.error);
        setStatus(SOCKET_CONFIG.STATUS.ERROR);
        break;
      default:
        break;
    }
  }, []);

  // Función para cerrar sesión de WhatsApp
  const logout = useCallback(async () => {
    try {
      const response = await api.post("/ws/logout");

      if (!response.error) {
        // console\.log("Logout exitoso");
        setStatus(SOCKET_CONFIG.STATUS.DISCONNECTED);
        setQrCode(null);
        setLoading(false);
        setError(null);
        return { success: true };
      } else {
        throw new Error("Error en la respuesta del servidor");
      }
    } catch (error) {
      console.error("Error al hacer logout:", error);
      setError("Error al cerrar sesión de WhatsApp");
      return { success: false, error: error.message };
    }
  }, []);

  // Función para reiniciar WhatsApp
  const restart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/agent/restart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        // console\.log("Reinicio exitoso");
        setStatus(SOCKET_CONFIG.STATUS.DISCONNECTED);
        setQrCode(null);
        return { success: true };
      } else {
        throw new Error("Error en la respuesta del servidor");
      }
    } catch (error) {
      console.error("Error al reiniciar:", error);
      setError("Error al reiniciar WhatsApp");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Función de reconexión
  const reconnect = useCallback(() => {
    if (reconnectionAttempts >= SOCKET_CONFIG.RECONNECTION.MAX_ATTEMPTS) {
      setError("Se alcanzó el límite de intentos de reconexión");
      return;
    }

    if (globalSocket) {
      globalSocket.disconnect();
      globalSocket = null;
      isGlobalSocketInitialized = false;

      setTimeout(() => {
        initializeGlobalSocket();
      }, SOCKET_CONFIG.RECONNECTION.DELAY);
    }
  }, [reconnectionAttempts]);

  // Inicializar el hook
  useEffect(() => {
    // Crear el listener para este hook
    listenerRef.current = handleSocketEvent;

    // Agregar el listener a la lista global
    globalSocketListeners.add(listenerRef.current);

    // Inicializar el socket global si no está inicializado
    if (!isGlobalSocketInitialized) {
      initializeGlobalSocket();
    }

    // Cleanup al desmontar
    return () => {
      if (listenerRef.current) {
        globalSocketListeners.delete(listenerRef.current);
        listenerRef.current = null;
      }
    };
  }, [handleSocketEvent]);

  return {
    socket: globalSocket,
    qrCode,
    status,
    loading,
    error,
    reconnectionAttempts,
    reconnect,
    logout,
    restart,
    isConnected: status === SOCKET_CONFIG.STATUS.CONNECTED,
    isQrReady: status === SOCKET_CONFIG.STATUS.QR_READY,
    isDisconnected: status === SOCKET_CONFIG.STATUS.DISCONNECTED,
    hasError: status === SOCKET_CONFIG.STATUS.ERROR,
    isAuthFailed: status === SOCKET_CONFIG.STATUS.AUTH_FAILED,
  };
};
