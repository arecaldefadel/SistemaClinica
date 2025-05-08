import fs from "fs";
import path from "path";

const componentsDir = "./src/components/ui";
const indexPath = path.join(componentsDir, "index.js");

const files = fs
  .readdirSync(componentsDir)
  .filter((file) => file.endsWith(".jsx") || file.endsWith(".tsx"));

const exports = files
  .filter((file) => file !== "index.js")
  .map((file) => {
    const name = path.basename(file, path.extname(file));
    return `export { default as ${name} } from './${name}';`;
  })
  .join("\n");

fs.writeFileSync(indexPath, exports + "\n");

console.log("✅ index.js generado con éxito en /ui");
