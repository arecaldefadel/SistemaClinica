import { Command } from "commander";
import path from "path";
import { fileURLToPath } from "url";
import { createMicroservice } from "./createMicroservice.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

program
  .name("sistema-cli")
  .description("CLI para automatizar microservicios")
  .version("1.0.0");

program
  .command("create")
  .argument("<nombre>", "Nombre del microservicio")
  .description("Crea un nuevo microservicio y lo registra en ApiGateway")
  .action((nombre) => {
    try {
      createMicroservice(nombre);
    } catch (error) {
      console.error("❌ Error:", error.message);
    }
  });

program.parse();
