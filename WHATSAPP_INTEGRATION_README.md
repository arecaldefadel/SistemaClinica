# Integración de WhatsApp Web.js con Socket.IO

Esta implementación permite conectar tu aplicación con WhatsApp usando `whatsapp-web.js` y `Socket.IO` para mostrar el código QR en tiempo real y monitorear el estado de la conexión.

## 🚀 Características

- **Conexión en tiempo real** usando Socket.IO
- **Modal interactivo** para escanear el código QR
- **Monitoreo del estado** de la conexión de WhatsApp
- **Reconexión automática** con manejo de errores
- **Interfaz de usuario moderna** y responsive
- **Hook personalizado** para fácil integración

## 📋 Requisitos Previos

### Servidor

- Node.js 16+
- `whatsapp-web.js` ^1.27.0
- `socket.io` ^4.x.x

### Cliente

- React 18+
- `socket.io-client` ^4.x.x
- `qrcode` ^1.x.x

## 🛠️ Instalación

### 1. Instalar dependencias en el servidor

```bash
cd server
npm install socket.io
```

### 2. Instalar dependencias en el cliente

```bash
cd client
npm install socket.io-client qrcode
```

## 🔧 Configuración

### Servidor

El servidor ya está configurado para usar Socket.IO. Los cambios principales son:

1. **`server/src/index.js`** - Integración de Socket.IO con el servidor HTTP
2. **`server/src/agent/services/ws.service.js`** - Emisión de eventos de WhatsApp
3. **`server/src/agent/controllers/agent.controller.js`** - Controladores para logout y restart
4. **`server/src/agent/routes/agent.routes.js`** - Rutas de la API

### Cliente

1. **`client/src/utilities/socketConfig.js`** - Configuración centralizada
2. **`client/src/hooks/useWhatsApp.js`** - Hook personalizado para la conexión
3. **`client/src/components/ui/WhatsAppQRModal.jsx`** - Modal para el QR
4. **`client/src/components/ui/WhatsAppStatus.jsx`** - Indicador de estado

## 📱 Uso

### Hook básico

```jsx
import { useWhatsApp } from "@/hooks/useWhatsApp";

function MyComponent() {
  const { isConnected, isQrReady, loading, error, reconnect, logout, restart } =
    useWhatsApp();

  return (
    <div>
      {isConnected && <p>WhatsApp conectado ✅</p>}
      {isQrReady && <p>QR disponible 📱</p>}
      {loading && <p>Conectando...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}
```

### Modal de configuración

```jsx
import { WhatsAppQRModal } from "@/components/ui";

function ConfigPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>Configurar WhatsApp</button>

      <WhatsAppQRModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
```

### Indicador de estado

```jsx
import { WhatsAppStatus } from "@/components/ui";

function Header() {
  return (
    <header>
      <WhatsAppStatus showModal={true} />
    </header>
  );
}
```

## 🔌 Eventos de Socket.IO

### Eventos emitidos por el servidor

- `whatsapp:qr` - Nuevo código QR disponible
- `whatsapp:ready` - WhatsApp conectado exitosamente
- `whatsapp:auth_failure` - Fallo en la autenticación
- `whatsapp:disconnected` - WhatsApp desconectado
- `whatsapp:loading` - Progreso de carga
- `whatsapp:logout` - Sesión cerrada

### Estados del cliente

- `connected` - WhatsApp conectado
- `disconnected` - WhatsApp desconectado
- `qr_ready` - QR disponible para escanear
- `loading` - Conectando con WhatsApp
- `error` - Error de conexión
- `auth_failed` - Fallo de autenticación

## 🌐 Variables de Entorno

### Cliente

```env
VITE_SOCKET_SERVER_URL=http://localhost:3002
```

### Servidor

```env
PORT=3002
NODE_ENV=development
```

## 🔄 Flujo de Conexión

1. **Inicialización**: El servidor inicia `whatsapp-web.js`
2. **Generación de QR**: Se genera un código QR y se emite via Socket.IO
3. **Escaneo**: El usuario escanea el QR con su teléfono
4. **Autenticación**: WhatsApp valida la autenticación
5. **Conexión**: Se establece la conexión y se emite el evento `ready`
6. **Monitoreo**: El cliente recibe actualizaciones en tiempo real

## 🚨 Manejo de Errores

- **Reconexión automática** con límite de intentos
- **Manejo de timeouts** de conexión
- **Validación de estados** de WhatsApp
- **Mensajes de error** descriptivos para el usuario

## 📱 Compatibilidad

- **Navegadores**: Chrome, Firefox, Safari, Edge (modernos)
- **Dispositivos**: Desktop, Tablet, Mobile
- **WhatsApp**: Versiones móviles compatibles con WhatsApp Web

## 🔒 Seguridad

- **Autenticación local** usando `LocalAuth`
- **CORS configurado** para el entorno de desarrollo
- **Validación de tokens** en el cliente
- **Manejo seguro** de reconexiones

## 🧪 Testing

Para probar la integración:

1. **Iniciar el servidor**: `npm run dev` (desde `server/`)
2. **Iniciar el cliente**: `npm run dev` (desde `client/`)
3. **Navegar a Configuración** en la aplicación
4. **Verificar la conexión** de Socket.IO
5. **Escanear el QR** con tu WhatsApp

## 🐛 Solución de Problemas

### Error de conexión

- Verificar que el servidor esté ejecutándose
- Comprobar la URL del servidor en la configuración
- Revisar los logs del servidor

### QR no aparece

- Verificar que `whatsapp-web.js` esté inicializado
- Comprobar los logs del servidor
- Reiniciar el servicio de WhatsApp

### Reconexión fallida

- Verificar la conectividad de red
- Comprobar la configuración de reconexión
- Revisar los logs de errores

## 📚 Recursos Adicionales

- [WhatsApp Web.js Documentation](https://github.com/pedroslopez/whatsapp-web.js)
- [Socket.IO Documentation](https://socket.io/docs/)
- [QR Code Generation](https://github.com/soldair/node-qrcode)

## 🤝 Contribución

Para contribuir a esta integración:

1. Fork el repositorio
2. Crear una rama para tu feature
3. Implementar los cambios
4. Agregar tests si es necesario
5. Crear un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia ISC.
