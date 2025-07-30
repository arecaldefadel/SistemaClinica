import { pool } from "../../db/connection.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config.js";
import { nvl } from "../../utils.js";

export const loginService = async ({ username, password }) => {
  let compare = false;
  try {
    // Se consulta el usuario y la contraseña
    const [rows] = await pool.execute(
      `SELECT 
        username, id_user, nombre_personas, apellido_personas, password_users 
        FROM users 
        INNER JOIN personas ON users.persona_id = personas.id_personas
        WHERE username = :username`,
      { username }
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
      expiresIn: "12h", // Con expiración en 12 horas
    });

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

export const changePassService = async ({ id, password }) => {
  // pwd = nvl(password, "").trim();
  const hashPwd = await bcrypt.hash(nvl(password, "").trim(), 10);

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    // 1. Obtener persona_id
    const [[cliente]] = await connection.execute(
      "SELECT id_user FROM users WHERE id_user = ?",
      [id]
    );

    if (!cliente) {
      throw new Error("Usuario no encontrado");
    }

    // 2. Actualizar usuario
    const resultUpdate = await connection.execute(
      "UPDATE users SET password_users = ? WHERE id_user = ?",
      [hashPwd, id]
    );

    await connection.commit();
    return { status: "ok", id: id, msg: "Actualizado correctamente" };
  } catch (err) {
    await connection.rollback();
    console.log(err);
    return { error: true, status: "error", msg: err.message };
  } finally {
    connection.release();
  }
};
