/**
 * EJEMPLOS DE USO DE LAS FUNCIONES DE ESTADO DE WHATSAPP
 *
 * Este archivo contiene ejemplos prácticos de cómo usar las funciones
 * implementadas en ws.service.js para monitorear y gestionar el estado
 * del cliente de WhatsApp.
 */

import {
  getWhatsAppStatus,
  getWhatsAppStatusSync,
  getWhatsAppClientInfo,
  checkWhatsAppHealth,
  getWhatsAppStats,
  emitWhatsAppStatus,
  setupStatusHeartbeat,
  stopStatusHeartbeat,
  cleanupWhatsAppServices,
  restartStatusServices,
} from "./ws.service.js";

// ============================================================================
// EJEMPLO 1: MONITOREO BÁSICO DE ESTADO
// ============================================================================

export const ejemploMonitoreoBasico = async () => {
  try {
    console.log("=== MONITOREO BÁSICO DE ESTADO ===");

    // Obtener estado asíncrono (recomendado para operaciones en tiempo real)
    const estadoAsync = await getWhatsAppStatus();
    console.log("Estado asíncrono:", estadoAsync);

    // Obtener estado síncrono (útil para verificaciones rápidas)
    const estadoSync = getWhatsAppStatusSync();
    console.log("Estado síncrono:", estadoSync);

    return { estadoAsync, estadoSync };
  } catch (error) {
    console.error("Error en monitoreo básico:", error);
    throw error;
  }
};

// ============================================================================
// EJEMPLO 2: VERIFICACIÓN DE SALUD COMPLETA
// ============================================================================

export const ejemploVerificacionSalud = async () => {
  try {
    console.log("=== VERIFICACIÓN DE SALUD COMPLETA ===");

    // Verificar salud general del sistema
    const salud = await checkWhatsAppHealth();
    console.log("Estado de salud:", salud.overall);
    console.log("Checks individuales:", salud.checks);

    // Obtener información detallada del cliente
    const infoCliente = await getWhatsAppClientInfo();
    console.log("Información del cliente:", infoCliente);

    // Obtener estadísticas de uso
    const estadisticas = await getWhatsAppStats();
    console.log("Estadísticas:", estadisticas);

    return { salud, infoCliente, estadisticas };
  } catch (error) {
    console.error("Error en verificación de salud:", error);
    throw error;
  }
};

// ============================================================================
// EJEMPLO 3: MONITOREO AUTOMÁTICO CON HEARTBEAT
// ============================================================================

export const ejemploMonitoreoAutomatico = () => {
  console.log("=== MONITOREO AUTOMÁTICO CON HEARTBEAT ===");

  // Configurar monitoreo automático cada 10 segundos
  setupStatusHeartbeat(10000);
  console.log("Heartbeat configurado cada 10 segundos");

  // Simular detención después de 1 minuto
  setTimeout(() => {
    console.log("Deteniendo heartbeat...");
    stopStatusHeartbeat();
    console.log("Heartbeat detenido");
  }, 60000);

  return { mensaje: "Monitoreo automático iniciado por 1 minuto" };
};

// ============================================================================
// EJEMPLO 4: GESTIÓN DE ESTADOS EN TIEMPO REAL
// ============================================================================

export const ejemploGestionEstadosTiempoReal = async () => {
  try {
    console.log("=== GESTIÓN DE ESTADOS EN TIEMPO REAL ===");

    // Emitir estado actual a todos los clientes conectados
    const resultadoEmision = await emitWhatsAppStatus();
    console.log("Resultado de emisión:", resultadoEmision);

    // Verificar estado múltiples veces para monitoreo
    const estados = [];
    for (let i = 0; i < 3; i++) {
      const estado = await getWhatsAppStatus();
      estados.push(estado);
      console.log(`Estado ${i + 1}:`, estado.status);

      // Esperar 2 segundos entre verificaciones
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    return { resultadoEmision, estados };
  } catch (error) {
    console.error("Error en gestión de estados:", error);
    throw error;
  }
};

// ============================================================================
// EJEMPLO 5: LIMPIEZA Y MANTENIMIENTO
// ============================================================================

export const ejemploLimpiezaMantenimiento = async () => {
  try {
    console.log("=== LIMPIEZA Y MANTENIMIENTO ===");

    // Limpiar todos los servicios
    const resultadoLimpieza = cleanupWhatsAppServices();
    console.log("Resultado de limpieza:", resultadoLimpieza);

    // Reiniciar solo los servicios de estado
    const resultadoReinicio = restartStatusServices();
    console.log("Resultado de reinicio:", resultadoReinicio);

    return { resultadoLimpieza, resultadoReinicio };
  } catch (error) {
    console.error("Error en limpieza y mantenimiento:", error);
    throw error;
  }
};

// ============================================================================
// EJEMPLO 6: FUNCIÓN DE MONITOREO COMPLETO
// ============================================================================

export const monitoreoCompleto = async (duracionMs = 60000) => {
  try {
    console.log(`=== MONITOREO COMPLETO POR ${duracionMs / 1000} SEGUNDOS ===`);

    // Configurar heartbeat cada 5 segundos
    setupStatusHeartbeat(5000);

    // Función para obtener métricas
    const obtenerMetricas = async () => {
      const estado = await getWhatsAppStatus();
      const salud = await checkWhatsAppHealth();
      const estadisticas = await getWhatsAppStats();

      return {
        timestamp: new Date().toISOString(),
        estado: estado.status,
        salud: salud.overall,
        conectado: estado.connected,
        autenticado: estado.authenticated,
        paginaActiva: estado.hasPupPage,
        uptime: estadisticas.uptime,
        mensajes: estadisticas.messageCount,
      };
    };

    // Obtener métricas iniciales
    const metricasIniciales = await obtenerMetricas();
    console.log("Métricas iniciales:", metricasIniciales);

    // Simular monitoreo continuo
    const intervalId = setInterval(async () => {
      const metricas = await obtenerMetricas();
      console.log("Métricas en tiempo real:", metricas);
    }, 10000); // Cada 10 segundos

    // Detener monitoreo después del tiempo especificado
    setTimeout(() => {
      clearInterval(intervalId);
      stopStatusHeartbeat();
      console.log("Monitoreo completado");
    }, duracionMs);

    return {
      mensaje: `Monitoreo iniciado por ${duracionMs / 1000} segundos`,
      metricasIniciales,
    };
  } catch (error) {
    console.error("Error en monitoreo completo:", error);
    throw error;
  }
};

// ============================================================================
// FUNCIÓN DE UTILIDAD PARA LOGGING
// ============================================================================

export const logEstadoWhatsApp = async (etiqueta = "Estado") => {
  try {
    const estado = await getWhatsAppStatus();
    const salud = await checkWhatsAppHealth();

    console.log(`[${etiqueta}] ${new Date().toISOString()}`);
    console.log(`  Estado: ${estado.status}`);
    console.log(`  Conectado: ${estado.connected}`);
    console.log(`  Salud: ${salud.overall}`);
    console.log(`  Mensaje: ${estado.message}`);

    return { estado, salud };
  } catch (error) {
    console.error(`[${etiqueta}] Error:`, error.message);
    throw error;
  }
};

// Exportar todas las funciones de ejemplo
export default {
  ejemploMonitoreoBasico,
  ejemploVerificacionSalud,
  ejemploMonitoreoAutomatico,
  ejemploGestionEstadosTiempoReal,
  ejemploLimpiezaMantenimiento,
  monitoreoCompleto,
  logEstadoWhatsApp,
};
