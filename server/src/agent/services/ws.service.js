import pkg from "whatsapp-web.js";
const { Client, LocalAuth, MessageMedia, Poll, Location } = pkg;
import { image as imageQr } from "qr-image";
import qrcode from "qrcode-terminal";
import fs from "fs";
import cron from "node-cron";
import { turnosDeHoy } from "../../pacientes/services/turnos.service.js";
import { formatDateArg } from "../../utils.js";
import dayjs from "dayjs";

const COMMANDS = {
  help: "!ping",
  confirmacion: "!confirmo",
  noasiste: "!noasisto",
};

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ["--disable-setuid-sandbox", "--unhandled-rejections=strict"],
  },
});

const generateImage = (base64) => {
  const path = `${process.cwd()}/tmp`;
  let qr_svg = imageQr(base64, { type: "svg", margin: 4 });
  qr_svg.pipe(fs.createWriteStream(`${path}/qr.svg`));
  console.log(`⚡ Recuerda que el QR se actualiza cada minuto ⚡'`);
  console.log(`⚡ Actualiza F5 el navegador para mantener el mejor QR⚡`);
};

// Generate and scan this code with your phone
client.on("qr", (qr) => {
  generateImage(qr);
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  client.getWWebVersion().then((version) => {
    console.log("Bot Activo. WhatsApp Web version:", version);
  });
});

// // Este cron job se ejecutará a las 6:30 PM todos los días.
// // cron.schedule("30 9 * * *", async () => {
// cron.schedule("*/10 * * * *", async () => {
//   const { data } = await turnosDeHoy();
//   console.log("Turnos disponibles", data);
//   const promesas = data.map((persona) => {
//     return new Promise((resolve) => {
//       const diaTurno = dayjs(persona.fecha_turno).format("DD/MM/YYYY");
//       const horaTurno = persona.hora_turno;
//       sendMessage({
//         id: persona.telefono_cliente,
//         message: `Hola ${persona.nombre_personas} recuerda que tienes un turno el día *${diaTurno}* a las *${horaTurno}*. Confirma asistencia por favor`,
//       })
//         .then((res) => {
//           const time = new Date().toLocaleString();
//           console.log("Mensaje enviado: %s", [time, persona.telefono_cliente]);
//         })
//         .catch((e) => {
//           console.log(e);
//         });
//     });
//   });
//   Promise.all(promesas).then((respuesta) => {});
//   // await sendMessage({ id: 543718526576, message: JSON.stringify(resTurnos) });
//   // await sendMessage({ id: 543718526576, message: "Tiene turno el día" });
// });

client.on("message", async (msg) => {
  // if (msg.body == COMMANDS.confirmacion) {
  //   msg.reply("Buenisimo! Nos vemos pronto");
  // }
  // if (msg.body == COMMANDS.noasiste) {
  //   msg.reply("Qué mal! Necesitas que reprograme el turno?");
  // }
  // if (msg.body == COMMANDS.help) {
  //   msg.reply(
  //     `Hola, soy un bot de WhatsApp. Aquí tienes una lista de comandos disponibles:\n${Object.values(
  //       COMMANDS
  //     ).join("\n")}`
  //   );
  // }
});

client.on("auth_failure", () => {
  console.log("LOGIN_FAIL");
});

client.on("disconnected", (reason) => {
  console.log("Se há cerrado sesión.", reason);
});

export const sendMessage = async ({ id, message }) => {
  const chatId = `${id}@c.us`;
  try {
    await client.sendMessage(chatId, message);
  } catch (err) {
    if (
      err.message.includes("serialize") ||
      err.message.includes("getMessageModel")
    ) {
      // console.warn("⚠️ Mensaje enviado pero error al serializar respuesta.");
    } else {
      throw err; // solo relanzás errores importantes
    }
  }
};

client.initialize();
