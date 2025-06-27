import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "./", // Important for Electron - use relative paths
  build: {
    outDir: "dist",
    assetsDir: "assets",
    // Ensure assets use relative paths
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
