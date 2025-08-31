#!/usr/bin/env node

import fs from "fs";
import path from "path";

/**
 * Script para limpiar manualmente los archivos de sesión de WhatsApp Web.js
 * Útil cuando hay errores EBUSY o problemas de permisos
 */

const SESSION_PATH = "./.wwebjs_auth";
const CACHE_PATH = "./.wwebjs_cache";

console.log("🧹 Iniciando limpieza de archivos de sesión de WhatsApp...\n");

// Función para eliminar directorios de manera segura
const removeDirectory = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    console.log(`📁 Directorio no existe: ${dirPath}`);
    return;
  }

  try {
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
      const curPath = path.join(dirPath, file);

      if (fs.lstatSync(curPath).isDirectory()) {
        removeDirectory(curPath);
      } else {
        try {
          fs.unlinkSync(curPath);
          console.log(`🗑️  Archivo eliminado: ${curPath}`);
        } catch (err) {
          console.warn(
            `⚠️  No se pudo eliminar archivo: ${curPath} - ${err.message}`
          );
        }
      }
    }

    try {
      fs.rmdirSync(dirPath);
      console.log(`🗑️  Directorio eliminado: ${dirPath}`);
    } catch (err) {
      console.warn(
        `⚠️  No se pudo eliminar directorio: ${dirPath} - ${err.message}`
      );
    }
  } catch (error) {
    console.error(`❌ Error al procesar directorio ${dirPath}:`, error.message);
  }
};

// Función para esperar un tiempo
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Función principal de limpieza
const cleanup = async () => {
  try {
    console.log("⏳ Esperando 2 segundos antes de iniciar la limpieza...");
    await wait(2000);

    // Limpiar directorio de autenticación
    console.log("\n📂 Limpiando directorio de autenticación...");
    removeDirectory(SESSION_PATH);

    // Limpiar directorio de caché
    console.log("\n📂 Limpiando directorio de caché...");
    removeDirectory(CACHE_PATH);

    // Verificar si quedaron archivos
    console.log("\n🔍 Verificando limpieza...");

    if (!fs.existsSync(SESSION_PATH) && !fs.existsSync(CACHE_PATH)) {
      console.log("✅ Limpieza completada exitosamente");
      console.log("💡 Ahora puedes reiniciar el servidor de WhatsApp");
    } else {
      console.log("⚠️  Algunos archivos no pudieron ser eliminados");
      console.log("💡 Intenta ejecutar este script como administrador");
    }
  } catch (error) {
    console.error("❌ Error durante la limpieza:", error.message);
    console.log("💡 Intenta ejecutar este script como administrador");
  }
};

// Ejecutar limpieza
cleanup()
  .then(() => {
    console.log("\n🏁 Script de limpieza finalizado");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Error fatal:", error);
    process.exit(1);
  });
