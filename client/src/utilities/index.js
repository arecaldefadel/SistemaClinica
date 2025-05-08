import axios from "axios";
import { useEffect } from "react";
import { ENDPOINTS } from "./contanstes";

/**
 * Función para generar un color aleatorio en hexadecimal
 * @returns {String} color
 */
const getRandomColor = () => {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

/**
 * Evalúa un valor si es  undefined, string vacio o null
 * @param {*} valor
 * @param {*} defaultValue
 * @returns {*} Valor que se define en el parametro defaultValue, o en su defecto 0 (cero)
 */
export const nvl = (valor, defaultValue = 0) =>
  valor === undefined || valor === "" || valor === null ? defaultValue : valor;

/**
 * Verifica si el parametro es un número
 * @param {String} number
 * @returns {Boolean}
 * */
const isNumber = (number) => {
  const regex = /^[0-9]*$/;
  return regex.test(`${number}`); // true
};

const upperFirstLetter = (word) => {
  const firstName = word.split(", ")[1].split(" ")[0];
  return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
};

const b64ToBlob = async (b64, name = "archivo", type = "pdf") => {
  const blob = await fetch(`data:${type};base64,${b64}`);
  downloadBlob(blob.url, `${name}.${type}`);
};

const downloadBlob = (blob, name) => {
  // Convertir el blob en Blob URL (una URL especial que apunta a un objeto almacenado en la memoria del navegador)
  const blobUrl = blob;
  // Crear link de descarga y apuntar al Blob URL
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = name;
  document.body.appendChild(link);
  // Ejecutar el evento click del enlace creado anteriormente
  // Es necesario hacerlo de esta manera porque en Firefox link.click() no funciona
  link.dispatchEvent(
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    })
  );
  // Eliminar el link del DOM
  document.body.removeChild(link);
};

/** Función para encontrar todos los objetos que coincidan con un criterio y valor
 * @param {array} array
 * @param {any} value
 * @param {string} criterio
 * @return {array}
 */
export const findAllInObject = (array, valor, criterio) =>
  array.filter((item) => item[criterio] === valor);

/** Función para obtener valores únicos de una propiedad específica
 * @param {array} array
 * @param {string} criterio
 * @return {array}
 */
export const UniqueValuePropeties = (array, criterio) => [
  ...new Set(array.map((item) => item[criterio])),
];

const findInObject = (array, valor, criterio) => {
  let item = array.find((a) => a[`${criterio}`] === valor);
  return item;
};

// btnToBlob.addEventListener('click', async (e) => {
//   b64ToBlob(myB64)
// });

/** Función para consultar al backend.
 * @param {object} options Opciones de Axios - Ej. method, url, params, etc.
 * @returns {Promise} Promesa con los datos del backend
 */
const axiosRequest = (options) => {
  return new Promise((resolve) => {
    axios
      .request(options)
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (error) {
        console.error(error.response?.data?.msg);
        resolve(error.response);
      });
  });
};

/**
 * Función para consultar si un registro cumple con una condicion simple.
 * @param {String} oper Operador con el que se va a hacer la comparación. Estos pueden ser ( >, >=, <, <=, =, < )
 * @param {String} value Valor que se toma de referecia para la comparación
 * @param {String} field Campo del registro que se va a comparar
 * @param {Array} data Registro de la base de datos a comparar
 * @returns {Boolean}
 */

export const operFunction = (oper, value, field, data) => {
  const operadores = {
    ">": data[field] > value,
    ">=": data[field] >= value,
    "<": data[field] < value,
    "<=": data[field] <= value,
    "=": data[field] == value,
    "<>": data[field] != value,
  };
  return operadores[oper];
};
export const getRandomInt = (min, max) => {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
};

export const randomPassword = () => {
  let letras = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "ñ",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];
  let pass = "";
  for (let i = 0; i <= 4; i++) {
    if (i === 0) {
      pass += letras[getRandomInt(1, 27)].toUpperCase();
    } else {
      pass += letras[getRandomInt(1, 27)];
    }
  }
  for (let i = 0; i <= 4; i++) {
    pass += getRandomInt(0, 9);
  }
  return pass;
};

export const menorADiez = (number) => {
  return number < 10 ? `0${number}` : number;
};

export const formatDateArg = (dateParam, orderReverse = false) => {
  const date = new Date(dateParam);

  const dia = menorADiez(
    typeof dateParam === "string" ? date.getUTCDate() : date.getDate()
  );
  const mes = menorADiez(
    typeof dateParam === "string" ? date.getUTCMonth() + 1 : date.getMonth() + 1
  );
  const anio =
    typeof dateParam === "string" ? date.getUTCFullYear() : date.getFullYear();
  if (orderReverse) {
    return `${anio}-${mes}-${dia}`;
  } else {
    return `${dia}-${mes}-${anio}`;
  }
};

/** Función para transformar el nombre de ícono en el formato admisible por FontAwesome **/
export const transformarIcono = (iconName) => {
  // Elimina el prefijo "Fa"
  let sinFa = iconName.replace(/^Fa/, "");
  // Separa las palabras en mayúsculas y las convierte a minúsculas
  let resultado = sinFa.replace(/([A-Z])/g, "-$1").toLowerCase();
  if (resultado.startsWith("-")) {
    resultado = resultado.slice(1);
  }

  return resultado;
};

export const useKeyPress = (keys = [], specialKeys = [], callback) => {
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (specialKeys?.length > 0) {
        for (const specialKey of specialKeys) {
          if (event[specialKey] === true && keys.includes(event.key)) {
            return callback ? callback(event) : true;
          }
        }
        return false;
      } else {
        if (keys.includes(event.key)) {
          return callback ? callback(event) : true;
        }
        return false;
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [keys, specialKeys, callback]);
};

export const handleKeyDown = (event, specialKeys = [], keys = [], callback) => {
  const specialKeysDb = ["shiftKey", "ctrlKey", "altKey", "metaKey"];
  if (specialKeys?.length > 0) {
    for (const specialKey of specialKeys) {
      if (event[specialKey] === true && keys.includes(event.key)) {
        return callback ? callback(event) : true;
      }
    }
    return false;
  } else {
    if (keys.includes(event.key)) {
      const validKey = specialKeysDb.every((key) => {
        return event[key] !== true;
      });

      if (validKey) {
        return callback ? callback(event) : true;
      }
    }
    return false;
  }
};

/**
 * Formats a number to a string with two decimal places and thousand separators.
 *
 * @function formatNumber
 * @param {number} num - The number to be formatted.
 * @returns {string} The formatted number as a string.
 *
 * @example
 * // Example usage:
 * const num = 123456.789;
 * const formattedNum = formatNumber(num);
 * console.log(formattedNum); // Output: "123,456.79"
 */
function formatNumber(num) {
  return num.toLocaleString("en-US", { minimumFractionDigits: 2 });
}

export {
  ENDPOINTS,
  getRandomColor,
  isNumber,
  upperFirstLetter,
  b64ToBlob,
  axiosRequest,
  findInObject,
  formatNumber,
};
