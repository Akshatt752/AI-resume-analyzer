import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // In development, /api calls go to the Express server so we don't need CORS locally
    proxy: {
      "/api": "http://localhost:8000",
    },
  },
});
