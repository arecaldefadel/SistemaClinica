import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url), // Alias '@' apunta a 'src'
      "@pages": new URL("./src/pages", import.meta.url),
      "@components": new URL("./src/components", import.meta.url),
      "@hooks": new URL("./src/hooks", import.meta.url),
    },
  },
});
