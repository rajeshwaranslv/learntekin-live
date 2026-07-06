import { defineConfig, loadEnv, transformWithEsbuild } from "vite";
import react from "@vitejs/plugin-react";

const DEFAULT_API_BASE_URL = "https://lte-node.onrender.com";

const normalizeApiBase = (value, fallback = DEFAULT_API_BASE_URL) => {
  const raw = String(value || "").trim() || fallback;

  const withProtocol = /^https?:\/\//i.test(raw)
    ? raw
    : `https://${raw}`;

  return withProtocol.replace(/\/+$/, "");
};

const jsAsJsxPlugin = () => ({
  name: "learntekin-js-as-jsx",
  enforce: "pre",
  async transform(code, id) {
    if (!/\/src\/.*\.js$/i.test(id.replace(/\\/g, "/"))) {
      return null;
    }

    return transformWithEsbuild(code, id, {
      loader: "jsx",
    });
  },
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const apiBase = normalizeApiBase(
    env.VITE_API_BASE_URL,
    DEFAULT_API_BASE_URL
  );

  const proxyTarget = normalizeApiBase(
    env.VITE_API_PROXY_TARGET || apiBase,
    DEFAULT_API_BASE_URL
  );

  console.log("==================================");
  console.log("MODE:", mode);
  console.log("API BASE:", apiBase);
  console.log("PROXY TARGET:", proxyTarget);
  console.log("==================================");

  return {
    plugins: [jsAsJsxPlugin(), react()],

    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
          secure: true,
        },
        "/uploads": {
          target: proxyTarget,
          changeOrigin: true,
          secure: true,
        },
      },
    },

    define: {
      __API_BASE__: JSON.stringify(apiBase),
    },

    esbuild: {
      loader: "jsx",
      include: /\.(js|jsx|ts|tsx)$/,
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
      chunkSizeWarningLimit: 900,

      rollupOptions: {
        output: {
          manualChunks(id) {
            const normalizedId = id.replace(/\\/g, "/");

            if (!normalizedId.includes("/node_modules/")) return;

            if (
              normalizedId.includes("/@firebase/auth") ||
              normalizedId.includes("/firebase/compat/auth")
            )
              return "vendor-firebase-auth";

            if (
              normalizedId.includes("/@firebase/firestore") ||
              normalizedId.includes("/firebase/compat/firestore")
            )
              return "vendor-firebase-firestore";

            if (
              normalizedId.includes("/@firebase/database") ||
              normalizedId.includes("/firebase/compat/database")
            )
              return "vendor-firebase-database";

            if (
              normalizedId.includes("/@firebase/storage") ||
              normalizedId.includes("/firebase/compat/storage")
            )
              return "vendor-firebase-storage";

            if (
              normalizedId.includes("/@firebase/") ||
              normalizedId.includes("/firebase/")
            )
              return "vendor-firebase-firestore";

            if (
              normalizedId.includes("/antd/") ||
              normalizedId.includes("/@ant-design/") ||
              normalizedId.includes("/rc-")
            )
              return "vendor-antd";

            if (
              normalizedId.includes("/@material-ui/core") ||
              normalizedId.includes("/@material-ui/icons")
            )
              return "vendor-mui";

            if (
              normalizedId.includes("/framer-motion/") ||
              normalizedId.includes("/@react-spring/")
            )
              return "vendor-animation";

            if (
              normalizedId.includes("/draft-js/") ||
              normalizedId.includes("/react-draft-wysiwyg/") ||
              normalizedId.includes("/draftjs-to-html/") ||
              normalizedId.includes("/html-to-draftjs/") ||
              normalizedId.includes("/immutable/")
            )
              return "vendor-editor";

            if (normalizedId.includes("/swiper/"))
              return "vendor-swiper";

            if (
              normalizedId.includes("/react/") ||
              normalizedId.includes("/react-dom/") ||
              normalizedId.includes("/react-router") ||
              normalizedId.includes("/react-redux/") ||
              normalizedId.includes("/redux/") ||
              normalizedId.includes("/redux-thunk/") ||
              normalizedId.includes("/scheduler/")
            )
              return "vendor-react";
          },
        },
      },
    },
  };
});
