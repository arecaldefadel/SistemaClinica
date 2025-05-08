import pkg from "whatsapp-web.js";
const { Client, LocalAuth, MessageMedia, Poll, Location } = pkg;
import { image as imageQr } from "qr-image";
import qrcode from "qrcode-terminal";
import fs from "fs";

const COMMANDS = {
  ping: "!ping",
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

client.on("qr", (qr) => {
  // Generate and scan this code with your phone
  generateImage(qr);
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", (msg) => {
  if (msg.body == "!ping") {
    msg.reply("pong");
  }
  if (msg.body == COMMANDS.help) {
    msg.reply(
      `Hola, soy un bot de WhatsApp. Aquí tienes una lista de comandos disponibles:\n${Object.values(
        COMMANDS
      ).join("\n")}`
    );
  }
});

client.on("auth_failure", () => {
  console.log("LOGIN_FAIL");
});

client.on("disconnected", (reason) => {
  console.log("Client was logged out", reason);
});

client.on("vote_update", (vote) => {
  /** The vote that was affected: */
  console.log(vote);
  client.reply(vote.chatId, "Vote updated!");
});

export const sendMessage = async ({ id, message }) => {
  const chatId = id + "@c.us";
  await client.sendMessage(chatId, message);
};

export const sendMessageWithButtons = async ({ id, message }) => {
  const chatId = id + "@c.us";

  await client.sendMessage(
    chatId,
    new Poll("Winter or Summer?", ["Winter", "Summer"])
  );
};
export const sendMessageWithImage = async ({ id, message }) => {
  const chatId = id + "@c.us";
  const media = MessageMedia.fromFilePath("./tmp/qr.svg");
  await client.sendMessage(chatId, media, { caption: message });
};

client.initialize();
