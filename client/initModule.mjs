import process from "process";
import fs from "fs";

const name = process.argv[2];
let errorFile = true;
const jsx = `import { getServices } from "../services/services.js";
const Component = () => {
  return (
    <h1>Component</h1>
  )
}

export default Component`;

const services = `//servicios del módulo.
export const getServices = () => {
  const options = {}

  return new Promise((resolve, reject) => {
    axiosRequest(options).then(function (response) {
      resolve(response);
    });
  });
}
`;
const createFile = (file, content) => {
  fs.appendFile(file, content, function (err) {
    if (err) throw err;
    errorFile = false;
  });
};

try {
  if (!name)
    throw new Error("Error: Debe especificar un nombre para el módulo nuevo.");

  if (!fs.existsSync(`./src/pages/${name}`)) {
    fs.mkdirSync(`./src/pages/${name}`);
    fs.mkdirSync(`./src/pages/${name}/views`);
    fs.mkdirSync(`./src/pages/${name}/services`);

    createFile(`./src/pages/${name}/views/index.jsx`, jsx);
    createFile(`./src/pages/${name}/services/services.js`, services);

    const mensajeExito = `
    ===============================
    ¡Servicio creado correctamente!
    ===============================
    `;

    if (errorFile) console.log(mensajeExito);
  } else {
    throw new Error("Error: Ya existe módulo con ese nombre.");
  }
} catch (err) {
  console.error(err);
}
