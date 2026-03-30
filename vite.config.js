import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const normalizeApiBase = (value, fallback) => {
  const rawValue = String(value || "").trim() || fallback;
  const withProtocol = /^https?:\/\//i.test(rawValue)
    ? rawValue
    : `https://${rawValue}`;
  return withProtocol.replace(/\/$/, "");
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const proxyTarget = normalizeApiBase(
    env.VITE_API_PROXY_TARGET || env.VITE_API_BASE_URL,
    "http://localhost:5000"
  );

  return {
    plugins: [react({ include: /\.(js|jsx|ts|tsx)$/ })],
    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
        },
        "/uploads": {
          target: proxyTarget,
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
            if (!normalizedId.includes("/node_modules/")) return;

            // Firebase â€” split by service (auth loads first, db/storage deferred)
            if (
              normalizedId.includes("/@firebase/auth") ||
              normalizedId.includes("/firebase/compat/auth")
            ) return "vendor-firebase-auth";

            if (
              normalizedId.includes("/@firebase/firestore") ||
              normalizedId.includes("/firebase/compat/firestore")
            ) return "vendor-firebase-firestore";

            if (
              normalizedId.includes("/@firebase/database") ||
              normalizedId.includes("/firebase/compat/database")
            ) return "vendor-firebase-database";

            if (
              normalizedId.includes("/@firebase/storage") ||
              normalizedId.includes("/firebase/compat/storage")
            ) return "vendor-firebase-storage";

            // Remaining firebase internals (app, util, logger, etc.)
            if (normalizedId.includes("/@firebase/") || normalizedId.includes("/firebase/")) {
              return "vendor-firebase-firestore";
            }

            // Antd + icons + rc-* must stay together (internal circular deps)
            if (
              normalizedId.includes("/antd/") ||
              normalizedId.includes("/@ant-design/") ||
              normalizedId.includes("/rc-")
            ) return "vendor-antd";

            // Material UI
            if (
              normalizedId.includes("/@material-ui/core") ||
              normalizedId.includes("/@material-ui/icons")
            ) return "vendor-mui";

            // Animation libraries
            if (
              normalizedId.includes("/framer-motion/") ||
              normalizedId.includes("/@react-spring/")
            ) return "vendor-animation";

            // Rich text editor
            if (
              normalizedId.includes("/draft-js/") ||
              normalizedId.includes("/react-draft-wysiwyg/") ||
              normalizedId.includes("/draftjs-to-html/") ||
              normalizedId.includes("/html-to-draftjs/") ||
              normalizedId.includes("/immutable/")
            ) return "vendor-editor";

            // Swiper
            if (normalizedId.includes("/swiper/")) return "vendor-swiper";

            // Core React stack
            if (
              normalizedId.includes("/react/") ||
              normalizedId.includes("/react-dom/") ||
              normalizedId.includes("/react-router") ||
              normalizedId.includes("/react-redux/") ||
              normalizedId.includes("/redux/") ||
              normalizedId.includes("/redux-thunk/") ||
              normalizedId.includes("/scheduler/")
            ) return "vendor-react";
          },
        },
      },
      chunkSizeWarningLimit: 900,
    },
  };
});
