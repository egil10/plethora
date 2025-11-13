import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Hash routing is used so the app can be deployed to GitHub Pages without additional server configuration.
export default defineConfig({
  plugins: [react()],
  base: "./"
});

