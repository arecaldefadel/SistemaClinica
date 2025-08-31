# Funciones de Estado de WhatsApp - Documentación

Este documento describe las funciones implementadas en `ws.service.js` para monitorear y gestionar el estado del cliente de WhatsApp.

## 📋 Funciones Principales

### 1. `getWhatsAppStatus()`

Obtiene el estado completo del cliente de forma asíncrona.

**Retorna:**

```javascript
{
  status: "connected" | "disconnected" | "not_authenticated" | "no_puppeteer_page" | "not_initialized" | "error",
  message: "Descripción del estado",
  timestamp: 1234567890,
  connected: true | false,
  authenticated: true | false,
  hasPupPage: true | false,
  clientInfo: {
    wid: "ID del cliente",
    platform: "Plataforma",
    pushname: "Nombre del usuario"
  }
}
```

**Uso:**

```javascript
import { getWhatsAppStatus } from "./ws.service.js";

const estado = await getWhatsAppStatus();
console.log("Estado:", estado.status);
```

### 2. `getWhatsAppStatusSync()`

Obtiene el estado básico de forma síncrona (útil para verificaciones rápidas).

**Retorna:**

```javascript
{
  status: "connected" | "disconnected" | "authenticated_no_page" | "page_no_auth" | "not_initialized" | "error",
  message: "Descripción del estado",
  timestamp: 1234567890,
  connected: true | false,
  authenticated: true | false,
  hasPupPage: true | false
}
```

**Uso:**

```javascript
import { getWhatsAppStatusSync } from "./ws.service.js";

const estado = getWhatsAppStatusSync();
console.log("Estado síncrono:", estado.status);
```

### 3. `getWhatsAppClientInfo()`

Obtiene información detallada del cliente.

**Retorna:**

```javascript
{
  timestamp: 1234567890,
  authStrategy: {
    type: "LocalAuth",
    isAuthenticated: true
  },
  puppeteer: {
    hasPage: true,
    pageClosed: false
  },
  webVersion: "2.3000.1025915895",
  connectionState: true,
  clientInfo: {
    wid: "ID del cliente",
    platform: "Plataforma",
    pushname: "Nombre del usuario",
    businessHours: "Horarios de negocio",
    status: "Estado del usuario"
  }
}
```

**Uso:**

```javascript
import { getWhatsAppClientInfo } from "./ws.service.js";

const info = await getWhatsAppClientInfo();
console.log("Versión de WhatsApp Web:", info.webVersion);
```

### 4. `checkWhatsAppHealth()`

Verifica la salud general de la conexión.

**Retorna:**

```javascript
{
  timestamp: 1234567890,
  overall: "healthy" | "degraded" | "poor" | "critical" | "error",
  status: { /* Estado completo */ },
  clientInfo: { /* Información del cliente */ },
  checks: {
    clientInitialized: true,
    authentication: true,
    puppeteerPage: true,
    connection: true
  }
}
```

**Estados de salud:**

- **healthy**: Cliente funcionando perfectamente
- **degraded**: Cliente autenticado pero con problemas menores
- **poor**: Cliente inicializado pero con problemas importantes
- **critical**: Cliente no inicializado o con errores críticos
- **error**: Error al verificar la salud

**Uso:**

```javascript
import { checkWhatsAppHealth } from "./ws.service.js";

const salud = await checkWhatsAppHealth();
console.log("Salud general:", salud.overall);
```

### 5. `getWhatsAppStats()`

Obtiene estadísticas de uso del cliente.

**Retorna:**

```javascript
{
  timestamp: 1234567890,
  uptime: 3600000, // Tiempo activo en milisegundos
  messageCount: 150, // Número de mensajes procesados
  lastActivity: "2024-01-01T12:00:00Z" // Última actividad
}
```

**Uso:**

```javascript
import { getWhatsAppStats } from "./ws.service.js";

const stats = await getWhatsAppStats();
console.log("Tiempo activo:", stats.uptime / 1000 / 60, "minutos");
```

## 🔄 Funciones de Comunicación

### 6. `emitWhatsAppStatus()`

Emite el estado actual a través de Socket.IO.

**Eventos emitidos:**

- `whatsapp:status_update`: Estado completo
- `whatsapp:connected`: Cliente conectado
- `whatsapp:disconnected`: Cliente desconectado
- `whatsapp:error`: Error en el cliente

**Retorna:**

```javascript
{
  success: true,
  emitted: true
}
```

**Uso:**

```javascript
import { emitWhatsAppStatus } from "./ws.service.js";

const resultado = await emitWhatsAppStatus();
if (resultado.success) {
  console.log("Estado emitido exitosamente");
}
```

### 7. `setupStatusHeartbeat(intervalMs)`

Configura emisión automática de estado.

**Parámetros:**

- `intervalMs`: Intervalo en milisegundos (por defecto: 30000)

**Uso:**

```javascript
import { setupStatusHeartbeat } from "./ws.service.js";

// Emitir estado cada 10 segundos
setupStatusHeartbeat(10000);
```

### 8. `stopStatusHeartbeat()`

Detiene la emisión automática de estado.

**Uso:**

```javascript
import { stopStatusHeartbeat } from "./ws.service.js";

stopStatusHeartbeat();
```

## 🛠️ Funciones de Mantenimiento

### 9. `cleanupWhatsAppServices()`

Limpia recursos y detiene servicios.

**Retorna:**

```javascript
{
  success: true,
  message: "Servicios limpiados"
}
```

**Uso:**

```javascript
import { cleanupWhatsAppServices } from "./ws.service.js";

const resultado = cleanupWhatsAppServices();
if (resultado.success) {
  console.log("Servicios limpiados exitosamente");
}
```

### 10. `restartStatusServices()`

Reinicia solo los servicios de estado (sin reiniciar el cliente).

**Retorna:**

```javascript
{
  success: true,
  message: "Servicios de estado reiniciados"
}
```

**Uso:**

```javascript
import { restartStatusServices } from "./ws.service.js";

const resultado = restartStatusServices();
if (resultado.success) {
  console.log("Servicios de estado reiniciados");
}
```

## 📊 Ejemplos de Uso

### Monitoreo Básico

```javascript
import { getWhatsAppStatus, checkWhatsAppHealth } from "./ws.service.js";

// Verificar estado cada 30 segundos
setInterval(async () => {
  const estado = await getWhatsAppStatus();
  const salud = await checkWhatsAppHealth();

  console.log(
    `[${new Date().toISOString()}] Estado: ${estado.status}, Salud: ${
      salud.overall
    }`
  );
}, 30000);
```

### Dashboard en Tiempo Real

```javascript
import { setupStatusHeartbeat, emitWhatsAppStatus } from "./ws.service.js";

// Configurar emisión automática cada 5 segundos
setupStatusHeartbeat(5000);

// Emitir estado inmediatamente
emitWhatsAppStatus();
```

### Verificación de Salud

```javascript
import { checkWhatsAppHealth } from "./ws.service.js";

// Verificar salud cada minuto
setInterval(async () => {
  const salud = await checkWhatsAppHealth();

  if (salud.overall === "critical") {
    console.error("⚠️ Estado crítico detectado!");
    // Enviar alerta o reiniciar servicios
  } else if (salud.overall === "degraded") {
    console.warn("⚠️ Estado degradado detectado");
  } else {
    console.log("✅ Estado saludable");
  }
}, 60000);
```

## 🔧 Configuración Automática

El sistema configura automáticamente un heartbeat de estado cada 30 segundos después de la inicialización del cliente de WhatsApp. Esto se puede modificar en la función `setupWhatsAppSocket()`.

## 📝 Notas Importantes

1. **Manejo de Errores**: Todas las funciones incluyen manejo de errores robusto y retornan información útil en caso de fallo.

2. **Socket.IO**: Las funciones de comunicación requieren que Socket.IO esté configurado y disponible.

3. **Rendimiento**: Las funciones síncronas son más rápidas pero menos detalladas. Use las asíncronas para información completa.

4. **Monitoreo Continuo**: El heartbeat automático es útil para dashboards en tiempo real, pero puede generar tráfico de red.

5. **Limpieza de Recursos**: Siempre llame a `cleanupWhatsAppServices()` cuando cierre la aplicación para evitar memory leaks.

## 🚀 Casos de Uso Comunes

- **Dashboard de Estado**: Monitoreo en tiempo real del estado de WhatsApp
- **Alertas Automáticas**: Notificaciones cuando el cliente se desconecta
- **Métricas de Rendimiento**: Seguimiento del uptime y actividad del cliente
- **Diagnóstico de Problemas**: Verificación rápida del estado del sistema
- **Monitoreo de Salud**: Verificación continua de la funcionalidad del cliente

## 📚 Archivos Relacionados

- `ws.service.js`: Implementación principal de las funciones
- `ws-status-examples.js`: Ejemplos prácticos de uso
- `README-WhatsApp-Status.md`: Esta documentación
