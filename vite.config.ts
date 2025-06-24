import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import type { Connect } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    supported: {
        "top-level-await": true //browsers can handle top-level-await features
    },
    treeShaking: true,
    minifySyntax: true,
    minifyIdentifiers: true,
    minifyWhitespace: true,
  },
  base: "./", // Ensures assets are correctly referenced
  build: {
    emptyOutDir: true,
    copyPublicDir: true,
    minify: "esbuild",
    target: "esnext",
    sourcemap: false,
    rollupOptions: {
      output: {
        entryFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
        inlineDynamicImports: true,
      }
    }
  },
  server: {
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
    fs: {
      allow: [".."]
    },
    middlewareMode: false,
    open: true, // Automatically open the browser
    port: 3001, // Default port for the development server
  },
  optimizeDeps: {
    exclude: ["@babylonjs/havok"],
    include: [
      "@babylonjs/core",
      "@babylonjs/gui",
      "@babylonjs/materials",
      "@babylonjs/inspector",
      "@babylonjs-toolkit/next",
    ],
    esbuildOptions: {
      treeShaking: true,
    }
  },
  plugins: [
    react(),
    {
      name: "configure-response-headers",
      configureServer: (server) => {
        server.middlewares.use((_req, res, next) => {
          res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
          next();
        });
      },
      configurePreviewServer: (server) => {
        server.middlewares.use((_req, res, next) => {
          res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
          next();
        });
      }
    },
    {
      name: "wasm-content-type-plugin",
      configureServer(server) {
        server.middlewares.use((req: Connect.IncomingMessage, res, next) => {
          if (req.originalUrl && req.originalUrl.endsWith(".wasm")) {
            res.setHeader("Content-Type", "application/wasm");
          }
          next();
        });
      },
      configurePreviewServer(server) {
        server.middlewares.use((req: Connect.IncomingMessage, res, next) => {
          if (req.originalUrl && req.originalUrl.endsWith(".wasm")) {
            res.setHeader("Content-Type", "application/wasm");
          }
          next();
        });
      }
    },
    {
      name: "gzip-response-headers",
      configureServer(server) {
        server.middlewares.use((req: Connect.IncomingMessage, res, next) => {
          if (req.originalUrl && req.originalUrl.includes(".gz.")) {
            res.setHeader("Content-Encoding", "gzip");
          }
          next();
        });
      },
      configurePreviewServer(server) {
        server.middlewares.use((req: Connect.IncomingMessage, res, next) => {
          if (req.originalUrl && req.originalUrl.includes(".gz.")) {
            res.setHeader("Content-Encoding", "gzip");
          }
          next();
        });
      }
    },
    {
      name: "gltf-content-type-plugin",
      configureServer(server) {
        server.middlewares.use((req: Connect.IncomingMessage, res, next) => {
          if (req.originalUrl) {
            if (req.originalUrl.endsWith(".gltf")) {
              res.setHeader("Content-Type", "model/gltf+json");
              res.setHeader("Access-Control-Allow-Origin", "*");
              res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
              res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
            } else if (req.originalUrl.endsWith(".glb")) {
              res.setHeader("Content-Type", "model/gltf-binary");
              res.setHeader("Access-Control-Allow-Origin", "*");
              res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
              res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
            } else if (req.originalUrl.endsWith(".bin")) {
              res.setHeader("Content-Type", "application/octet-stream");
              res.setHeader("Access-Control-Allow-Origin", "*");
            }
          }
          next();
        });
      },
      configurePreviewServer(server) {
        server.middlewares.use((req: Connect.IncomingMessage, res, next) => {
          if (req.originalUrl) {
            if (req.originalUrl.endsWith(".gltf")) {
              res.setHeader("Content-Type", "model/gltf+json");
              res.setHeader("Access-Control-Allow-Origin", "*");
              res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
              res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
            } else if (req.originalUrl.endsWith(".glb")) {
              res.setHeader("Content-Type", "model/gltf-binary");
              res.setHeader("Access-Control-Allow-Origin", "*");
              res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
              res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
            } else if (req.originalUrl.endsWith(".bin")) {
              res.setHeader("Content-Type", "application/octet-stream");
              res.setHeader("Access-Control-Allow-Origin", "*");
            }
          }
          next();
        });
      }
    }
  ]
})
