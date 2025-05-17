import config from "../../config.js";
import jwt from "jsonwebtoken";
import { nvl } from "../../utils.js";

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
