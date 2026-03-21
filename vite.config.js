import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react({ include: /\.(js|jsx|ts|tsx)$/ })],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
  esbuild: {
    loader: "jsx",
    include: /\.(js|jsx|ts|tsx)$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
  build: {
    outDir: "build",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replace(/\\/g, "/");
          if (!normalizedId.includes("/node_modules/")) {
            return;
          }

          if (
            normalizedId.includes("/react/") ||
            normalizedId.includes("/react-dom/") ||
            normalizedId.includes("/react-router") ||
            normalizedId.includes("/react-redux/")
          ) {
            return "vendor-react";
          }

          if (
            normalizedId.includes("/@firebase/auth") ||
            normalizedId.includes("/firebase/compat/auth")
          ) {
            return "vendor-firebase-auth";
          }

          if (
            normalizedId.includes("/@firebase/firestore") ||
            normalizedId.includes("/firebase/compat/firestore")
          ) {
            return "vendor-firebase-firestore";
          }

          if (
            normalizedId.includes("/@firebase/database") ||
            normalizedId.includes("/firebase/compat/database")
          ) {
            return "vendor-firebase-database";
          }

          if (
            normalizedId.includes("/@firebase/storage") ||
            normalizedId.includes("/firebase/compat/storage")
          ) {
            return "vendor-firebase-storage";
          }

          if (normalizedId.includes("/swiper/")) {
            return "vendor-swiper";
          }
        },
      },
    },
  },
});
