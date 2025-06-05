// scripts/createMicroservice.js
import fs from "fs";

export function createMicroservice(name) {
  if (!name)
    throw new Error("Debe especificar un nombre para el módulo nuevo.");
  name = name.toLowerCase();

  if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
    throw new Error(
      "Nombre inválido. Solo letras, números, guiones y guiones bajos permitidos."
    );
  }

  const basePath = `./src/${name}`;

  const getRouteFile = (n) => `import express from 'express';
import { getController } from '../controllers/${n}.controller.js';

const router = express.Router();

router.get('/ping', (req, res) => res.status(200).send('Conexión exitosa'));
router.get('/', getController);

export default router;
`;

  const getControllerFile = (
    n
  ) => `import { getData } from '../services/${n}.service.js';

export const getController = async (req, res) => {
  const { id } = req.body;
  const request = await getData(id);

  if (request?.error) {
    return res.status(401).json({ error: true, msg: request.msg });
  }
  return res.status(200).json({ error: false, msg: request.msg });
};
`;

  const getServiceFile =
    () => `import { getConnection, sql } from '../../db/connection.js';
const pool = await getConnection();

export const getData = async (id) => {
  const query = 'SELECT * FROM TABLE_NAME WHERE TABLA_CODIGO = @TABLA_CODIGO';

  try {
    const recordset = await pool
      .request()
      .input('TABLA_CODIGO', sql.NVarChar, id)
      .query(query);

    return recordset.recordset;
  } catch (e) {
    return { status: '500', datos: {}, message: e.message };
  }
};
`;

  const getMiddlewareFile =
    () => `export const validation = async (req, res, next) => {
  try {
    // Validación personalizada
    return next();
  } catch (error) {
    return res.status(401).send('Error: ' + error.message);
  }
};
`;

  const createFile = (file, content) => {
    fs.writeFileSync(file, content, "utf8");
  };

  if (fs.existsSync(basePath)) {
    throw new Error("Ya existe un módulo con ese nombre.");
  }

  // Crear estructura de carpetas
  fs.mkdirSync(basePath);
  fs.mkdirSync(`${basePath}/controllers`);
  fs.mkdirSync(`${basePath}/routes`);
  fs.mkdirSync(`${basePath}/services`);
  fs.mkdirSync(`${basePath}/middlewares`);

  // Crear archivos base
  createFile(`${basePath}/routes/${name}.routes.js`, getRouteFile(name));
  createFile(
    `${basePath}/controllers/${name}.controller.js`,
    getControllerFile(name)
  );
  createFile(`${basePath}/services/${name}.service.js`, getServiceFile());
  createFile(
    `${basePath}/middlewares/${name}.middleware.js`,
    getMiddlewareFile()
  );

  // Post-create: actualizar ApiGateway
  const apiPath = "./src/apiGateway.js";
  const routeName = name.toLowerCase();
  const importLine = `import ${routeName}_router from "./${routeName}/routes/${routeName}.routes.js";`;
  const useLine = `  router.use("/${routeName}", ${routeName}_router);`;

  let apiCode = fs.readFileSync(apiPath, "utf8");

  if (!apiCode.includes(importLine)) {
    const importMarker = 'import express from "express";';
    apiCode = apiCode.replace(importMarker, importMarker + "\n" + importLine);
  }

  if (!apiCode.includes(useLine)) {
    const useMarker = "  // Rutas de cada servicio";
    apiCode = apiCode.replace(useMarker, useMarker + "\n" + useLine);
  }

  fs.writeFileSync(apiPath, apiCode, "utf8");

  console.log(
    `=========================================
  ¡Servicio '${name}' creado correctamente!
  =========================================`
  );
}
