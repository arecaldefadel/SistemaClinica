// import { getConnection, sql } from '../../db/connection.js'
// const pool = await getConnection()
import {
  sendMessage,
  sendMessageWithButtons,
  sendMessageWithImage,
} from "./ws.service.js";

export const enviarMensaje = async ({ id, message }) => {
  // sendMessageWithImage({ id, message })
  sendMessageWithButtons({ id, message })
    // sendMessage({ id, message })
    .then((response) => {
      console.log("Mensaje enviado:", message);
      console.log("ID:", id);
    })
    .catch((error) => {
      console.error("Error al enviar el mensaje:", error);
    });
};
