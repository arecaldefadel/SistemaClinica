// import { getConnection, sql } from '../../db/connection.js'
// const pool = await getConnection()
import dayjs from "dayjs";
import { sendMessage } from "./ws.service.js";
import { turnosDeHoy } from "../../pacientes/services/turnos.service.js";
import "dayjs/locale/es.js";
dayjs.locale("es");

export const enviarMensaje = async ({ id, message }) => {
  // sendMessageWithImage({ id, message })
  sendMessage({ id, message })
    // sendMessage({ id, message })
    .then((response) => {})
    .catch((error) => {
      console.error("Error al enviar el mensaje:", error);
    });
};

let errorLot = [];

export const enviarNotificacionPacientes = async () => {
  try {
    const { data } = await turnosDeHoy();

    const promesas = data.map((persona) => {
      return new Promise((resolve, reject) => {
        const diaTurno = dayjs(persona.fecha).format(
          "dddd DD [de] MMMM [de] YYYY"
        );
        const horaTurno = persona.hora.split(":");
        /*


 */
        sendMessage({
          id: persona.telefono,
          message: `Recordatorio de turno:
${persona.nombre} ${persona.apellido} posee un turno programado el día *${diaTurno}* a las *${horaTurno[0]}:${horaTurno[1]}* hs 
Por favor confirmar asistencia.
`,
        })
          .then((res) => {
            const time = new Date().toLocaleString();
            console.log("Mensaje enviado: %s", [time, persona.telefono]);
            resolve({
              telefono: persona.telefono,
              name: `${persona.nombre} ${persona.apellido}`,
            });
          })
          .catch((err) => {
            errorLot.push({ telefono: persona.telefono, err });
            reject(err); // si querés frenar todo el lote
          });
      });
    });

    const promesasRes = await Promise.allSettled(promesas);

    if (errorLot.length > 0) {
      return { error: true, errorLot };
    }

    return { error: false, enviados: promesasRes };
  } catch (err) {
    return { error: true, errorLot: [err] };
  }
};
