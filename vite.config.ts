import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import type { Connect } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    supported: {
        'top-level-await': true //browsers can handle top-level-await features
    },
    treeShaking: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
  },
  base: "./", // Ensures assets are correctly referenced
  build: {
    emptyOutDir: true,
    copyPublicDir: true,
    minify: 'esbuild',
    target: 'esnext',
    sourcemap: false,
    rollupOptions: {
      output: {
        entryFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
        inlineDynamicImports: false,
      },
      plugins: [
        {
          name: 'exclude-babylonjs-loaders',
          resolveId(id) {
            // Exclude specific heavy loader modules but keep the core GLTF loader
            if (id.includes('@babylonjs/loaders') && 
                !id.includes('glTFLoader') &&
                !id.includes('index.js')) {
              return { id: 'virtual:empty', external: false };
            }
            return null;
          },
          load(id) {
            if (id === 'virtual:empty') {
              return 'export {};';
            }
            return null;
          }
        }
      ]
    }
  },
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
    fs: {
      allow: ['..']
    }
  },
  optimizeDeps: {
    exclude: ['@babylonjs/havok'],
    include: [
      '@babylonjs/core',
      '@babylonjs/materials',
      '@babylonjs/gui',
      '@babylonjs/inspector',
      'babylon-toolkit-next',
    ],
    esbuildOptions: {
      treeShaking: true,
    }
  },
  define: {
    // Babylon.js build optimizations
    'process.env.NODE_ENV': '"production"',
  },
  plugins: [
    react(),
    {
      name: 'configure-response-headers',
      configureServer: (server) => {
        server.middlewares.use((_req, res, next) => {
          res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
          res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
          next();
        });
      },
    },
    {
      name: 'wasm-content-type-plugin',
      configureServer(server) {
        server.middlewares.use((req: Connect.IncomingMessage, res, next) => {
          if (req.originalUrl && req.originalUrl.endsWith('.wasm')) {
            res.setHeader('Content-Type', 'application/wasm');
          }
          next();
        });
      },
    },
  ],
})