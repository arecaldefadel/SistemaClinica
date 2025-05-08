import { pool } from "../../db/connection.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config.js";

export const loginService = async ({ username, password }) => {
  let compare = false;
  try {
    const [rows] = await pool.query(
      `SELECT 
        username, id_user, nombre_personas, apellido_personas, password_users 
       FROM users 
       INNER JOIN personas ON users.persona_id = personas.id_personas
       WHERE username = ?`,
      [username]
    );

    if (rows.length > 0) {
      compare = bcrypt.compareSync(password, rows[0].password_users);
    }

    if (!compare) {
      return {
        error: true,
        msg: "Usuario o contraseña incorrectos",
      };
    }

    const datos = {
      id: rows[0].id_user,
      username: rows[0].username,
    };

    // Se genera el toque a partir de la info de la bd y el TOKEN_KEY
    const token = jwt.sign(datos, config.TOKEN_KEY, {
      expiresIn: "12h", // Con expiración en segundos horas
    });
    // console.log(JSON.parse(token));
    return {
      error: false,
      msg: "",
      data: {
        id: rows[0].id_user,
        nombre: rows[0].nombre_personas,
        apellido: rows[0].apellido_personas,
        token,
      },
    };
  } catch (error) {
    console.error("Error en la consulta:", error);
    return { error: true, msg: "Error en la consulta" };
  }
};
