import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // Esto permite que escuche conexiones externas
    allowedHosts: [
      "e87c-45-182-29-51.ngrok-free.app", // Agregá tu URL pública actual de ngrok
    ],
  },
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url), // Alias '@' apunta a 'src'
      "@pages": new URL("./src/pages", import.meta.url),
      "@components": new URL("./src/components", import.meta.url),
      "@hooks": new URL("./src/hooks", import.meta.url),
    },
  },
});
