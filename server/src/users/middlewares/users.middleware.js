import config from "../../config.js";
import jwt from "jsonwebtoken";
import { nvl } from "../../utils.js";
import rateLimit from "express-rate-limit";

const TOKEN_EXCEPTION = {
  EXPIRED: "TokenExpiredError",
  WEB_TOKEN: {
    NAME: "JsonWebTokenError",
    MESSAGE: {
      "invalid token": "Token inválido",
      "jwt malformed": "Token mal formado",
      "jwt signature is required": "Firma del token requerido",
      "invalid signature": "Firma del token inválida",
    },
  },
};

/** Verifica si el usuario loggeado tiene un token válido */
export const verifyToken = (req, res, next) => {
  try {
    const auth = req.get("Authorization");

    if (!auth && nvl(auth, "").startsWith("Bearer")) {
      return res.status(401).send("No posee token o es invalido");
    }

    const token = nvl(auth, "").split(" ")[1];
    if (!token) return res.status(401).send("No posee token o es invalido");

    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.userId = decoded?.id;
    next();
  } catch (error) {
    if (error.name === TOKEN_EXCEPTION.EXPIRED) {
      return res.status(401).send({
        error: true,
        msg: "Su sesión ha expirado. Vuelva a iniciar sesión",
      });
    }

    if (error.name === TOKEN_EXCEPTION.WEB_TOKEN.NAME) {
      return res.status(401).send({
        error: true,
        msg: TOKEN_EXCEPTION.WEB_TOKEN.MESSAGE[error.message],
      });
    }
    return res.status(401).send({ error: true, msg: error.message });
  }
};

const validarPasswordPorPartes = (password) => {
  return {
    minuscula: /[a-z]/.test(password),
    mayuscula: /[A-Z]/.test(password),
    numero: /\d/.test(password),
    simbolo: /[!@#$%^&*()_+{}\[\]]/.test(password),
    longitud: password.length >= 8 && password.length <= 64,
    sinEspacios: !/\s/.test(password),
  };
};

export const validarNewPassword = (req, res, next) => {
  const { newPassword, repeatNewPassword } = req.body;
  if (newPassword.lenght < 8)
    return res.status(401).json({
      error: true,
      message: "La contraseña debería tener al menos 8 caracteres.",
    });

  if (newPassword !== repeatNewPassword)
    return res.status(401).json({
      error: true,
      message:
        "Las contraseñas no coinciden. Asegurate de escribir la misma en ambos campos.",
    });

  const resultado = validarPasswordPorPartes(newPassword);

  if (!resultado.minuscula)
    return res.status(400).json({
      error: true,
      message: "Debe incluir al menos una letra minúscula.",
    });
  if (!resultado.mayuscula)
    return res.status(400).json({
      error: true,
      message: "Debe incluir al menos una letra mayúscula.",
    });
  if (!resultado.numero)
    return res
      .status(400)
      .json({ error: true, message: "Debe incluir al menos un número." });
  if (!resultado.simbolo)
    return res.status(400).json({
      error: true,
      message:
        "Debe incluir al menos un carácter especial, por ejemplo: !@#$%^&*()_+{}[].",
    });
  if (!resultado.longitud)
    return res.status(400).json({
      error: true,
      message: "La contraseña debe tener al menos 8 caracteres.",
    });
  if (!resultado.sinEspacios)
    return res
      .status(400)
      .json({ error: true, message: "No se permite el uso de espacios." });
};

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 3, // máximo 5 intentos por IP
  message: "Demasiados intentos de inicio de sesión.",
  standardHeaders: true,
  legacyHeaders: false,
});
