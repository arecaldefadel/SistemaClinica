# 🏥 SistemaClinica

Sistema de gestión integral para clínicas médicas con funcionalidades avanzadas de administración de pacientes, turnos, pagos e integración con WhatsApp.

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [API](#-api)
- [Integración WhatsApp](#-integración-whatsapp)
- [Desarrollo](#-desarrollo)
- [Despliegue](#-despliegue)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

## 🎯 Descripción

SistemaClinica es una aplicación web completa diseñada para la gestión integral de clínicas médicas. Permite administrar pacientes, programar turnos, gestionar pagos y mantener comunicación directa con los pacientes a través de WhatsApp.

### Funcionalidades Principales

- **Gestión de Pacientes**: Registro, búsqueda y administración completa de historiales médicos
- **Sistema de Turnos**: Programación, cancelación y seguimiento de citas médicas
- **Administración de Pagos**: Control de facturación y estados de cuenta
- **Integración WhatsApp**: Comunicación directa y notificaciones automáticas
- **Panel de Administración**: Interfaz intuitiva para personal médico y administrativo
- **Sistema de Usuarios**: Control de acceso y roles de usuario

## ✨ Características

### 🔐 Seguridad

- Autenticación JWT
- Encriptación de contraseñas con bcrypt
- Control de acceso basado en roles
- Middleware de validación

### 📱 Interfaz de Usuario

- Diseño responsive con Tailwind CSS
- Componentes reutilizables
- Navegación intuitiva
- Modales interactivos
- Sistema de notificaciones toast

### 🔄 Tiempo Real

- Actualizaciones en vivo con Socket.IO
- Estado de conexión WhatsApp en tiempo real
- Notificaciones instantáneas

### 📊 Gestión de Datos

- Base de datos MySQL
- API RESTful
- Validación de datos
- Manejo de errores robusto

## 🛠️ Tecnologías

### Frontend (Cliente)

- **React 19** - Biblioteca de interfaz de usuario
- **Vite** - Herramienta de construcción
- **Tailwind CSS** - Framework de CSS utilitario
- **React Router** - Enrutamiento de la aplicación
- **Axios** - Cliente HTTP
- **Socket.IO Client** - Comunicación en tiempo real
- **Day.js** - Manipulación de fechas
- **FontAwesome** - Iconografía

### Backend (Servidor)

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MySQL2** - Cliente de base de datos
- **Socket.IO** - Comunicación en tiempo real
- **JWT** - Autenticación
- **bcryptjs** - Encriptación
- **WhatsApp Web.js** - Integración con WhatsApp
- **Helmet** - Seguridad HTTP
- **Morgan** - Logging de requests

### Base de Datos

- **MySQL** - Sistema de gestión de base de datos relacional

## 📁 Estructura del Proyecto

```
SistemaClinica/
├── client/                 # Aplicación frontend
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── pages/         # Páginas de la aplicación
│   │   ├── context/       # Contextos de React
│   │   ├── hooks/         # Hooks personalizados
│   │   ├── utilities/     # Utilidades y configuraciones
│   │   └── assets/        # Recursos estáticos
│   ├── public/            # Archivos públicos
│   └── package.json
├── server/                 # API backend
│   ├── src/
│   │   ├── agent/         # Servicios de WhatsApp
│   │   ├── pacientes/     # Módulo de pacientes
│   │   ├── users/         # Módulo de usuarios
│   │   ├── db/            # Configuración de base de datos
│   │   └── utils/         # Utilidades del servidor
│   └── package.json
└── package.json            # Configuración raíz
```

## 🚀 Instalación

### Prerrequisitos

- **Node.js** 16.0.0 o superior
- **MySQL** 8.0 o superior
- **Git** para clonar el repositorio

### 1. Clonar el Repositorio

```bash
git clone https://github.com/arecaldefadel/SistemaClinica.git
cd SistemaClinica
```

### 2. Instalar Dependencias

```bash
# Instalar dependencias raíz
npm install

# Instalar dependencias del cliente
cd client
npm install

# Instalar dependencias del servidor
cd ../server
npm install
```

### 3. Configurar Base de Datos

```sql
-- Crear base de datos
CREATE DATABASE sistemaclinica;

-- Usar la base de datos
USE sistemaclinica;

-- Ejecutar scripts de inicialización (si existen)
```

### 4. Configurar Variables de Entorno

Crear archivo `.env` en la carpeta `server/`:

```env
# Configuración del servidor
PORT=3002
NODE_ENV=development

# Base de datos
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=sistemaclinica
DB_PORT=3306

# JWT
JWT_SECRET=tu_secreto_jwt_super_seguro

# WhatsApp
WHATSAPP_SESSION_PATH=./.wwebjs_auth
```

## ⚙️ Configuración

### Configuración del Cliente

El cliente se configura automáticamente, pero puedes personalizar:

- **Puerto**: Modificar `vite.config.js`
- **URL del servidor**: Configurar en `utilities/apiClient.js`
- **Socket.IO**: Configurar en `utilities/socketConfig.js`

### Configuración del Servidor

- **Puerto**: Variable de entorno `PORT`
- **Base de datos**: Configurar en `src/db/connection.js`
- **WhatsApp**: Configurar en `src/agent/services/ws.service.js`

## 🎮 Uso

### Iniciar el Sistema

```bash
# Terminal 1 - Servidor
npm run server

# Terminal 2 - Cliente
npm run client
```

### Acceso a la Aplicación

- **Cliente**: http://localhost:5173
- **API**: http://localhost:3002

### Primeros Pasos

1. **Crear Usuario Administrador**

   - Acceder a la página de registro
   - Crear cuenta con rol de administrador

2. **Configurar WhatsApp**

   - Ir a Configuración
   - Escanear código QR con tu WhatsApp

3. **Gestionar Pacientes**

   - Agregar pacientes desde el módulo correspondiente
   - Completar información médica

4. **Programar Turnos**
   - Crear turnos para pacientes
   - Gestionar calendario de citas

## 🔌 API

### Endpoints Principales

#### Autenticación

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/logout` - Cerrar sesión

#### Pacientes

- `GET /api/pacientes` - Listar pacientes
- `POST /api/pacientes` - Crear paciente
- `PUT /api/pacientes/:id` - Actualizar paciente
- `DELETE /api/pacientes/:id` - Eliminar paciente

#### Turnos

- `GET /api/turnos` - Listar turnos
- `POST /api/turnos` - Crear turno
- `PUT /api/turnos/:id` - Actualizar turno
- `DELETE /api/turnos/:id` - Cancelar turno

#### Pagos

- `GET /api/pagos` - Listar pagos
- `POST /api/pagos` - Registrar pago
- `PUT /api/pagos/:id` - Actualizar pago

### Autenticación

La API utiliza JWT para autenticación. Incluye el token en el header:

```bash
Authorization: Bearer <tu_token_jwt>
```

## 📱 Integración WhatsApp

El sistema incluye integración completa con WhatsApp para:

- **Notificaciones automáticas** de turnos
- **Recordatorios** de citas
- **Confirmaciones** de pagos
- **Comunicación directa** con pacientes

### Configuración WhatsApp

1. **Escanear QR**: Usar el modal de configuración
2. **Estado de conexión**: Monitorear en tiempo real
3. **Mensajes automáticos**: Configurar plantillas
4. **Historial**: Ver conversaciones y estados

Para más detalles, consulta [WHATSAPP_INTEGRATION_README.md](WHATSAPP_INTEGRATION_README.md)

## 🛠️ Desarrollo

### Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Iniciar cliente y servidor
npm run server       # Solo servidor
npm run client       # Solo cliente

# Construcción
npm run build        # Construir cliente para producción

# Utilidades
npm run new          # Crear nuevo módulo
npm run gen:ui       # Generar exports de componentes
npm run cleanup      # Limpiar sesiones WhatsApp
```

### Estructura de Componentes

Los componentes siguen un patrón consistente:

- **Componentes UI**: Reutilizables y configurables
- **Páginas**: Vistas principales de la aplicación
- **Hooks**: Lógica reutilizable
- **Contextos**: Estado global de la aplicación

### Agregar Nuevos Módulos

```bash
# Crear nuevo módulo
npm run new

# Seguir la estructura existente:
# - controllers/
# - services/
# - routes/
# - middlewares/
```

## 🚀 Despliegue

### Preparación para Producción

```bash
# Construir cliente
cd client
npm run build

# Configurar variables de entorno de producción
# Configurar base de datos de producción
# Configurar SSL/HTTPS
```

### Servidor de Producción

- **PM2** para gestión de procesos
- **Nginx** como proxy reverso
- **SSL** para conexiones seguras
- **Backup** automático de base de datos

### Variables de Entorno de Producción

```env
NODE_ENV=production
PORT=3002
DB_HOST=tu_host_produccion
DB_USER=usuario_produccion
DB_PASSWORD=password_seguro
JWT_SECRET=secreto_super_seguro_produccion
```

## 🤝 Contribución

### Cómo Contribuir

1. **Fork** el repositorio
2. **Crear** una rama para tu feature
3. **Implementar** los cambios
4. **Agregar** tests si es necesario
5. **Crear** un Pull Request

### Estándares de Código

- **ESLint** para linting
- **Prettier** para formateo
- **Convenciones** de nomenclatura consistentes
- **Documentación** de funciones complejas

### Reportar Bugs

- Usar el sistema de issues de GitHub
- Incluir pasos para reproducir
- Adjuntar logs y capturas de pantalla
- Especificar versión y entorno

## 📄 Licencia

Este proyecto está bajo la licencia **ISC**.

## 📞 Soporte

- **Issues**: [GitHub Issues](https://github.com/arecaldefadel/SistemaClinica/issues)
- **Documentación**: [Wiki del proyecto](https://github.com/arecaldefadel/SistemaClinica/wiki)
- **Contacto**: [Tu email de contacto]

## 🙏 Agradecimientos

- **WhatsApp Web.js** por la integración de WhatsApp
- **Socket.IO** por la comunicación en tiempo real
- **Tailwind CSS** por el sistema de diseño
- **React** por el framework de interfaz

---

**SistemaClinica** - Transformando la gestión de clínicas médicas 🏥✨
