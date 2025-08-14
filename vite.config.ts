import path from "path"

import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig(({ command }) => {
  // 개발 환경인지 확인
  const isDev = command === "serve"

  return {
    plugins: [react()],
    base: "/front_6th_chapter2-3/",
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"), // 별칭 적용 안했으면 빼도됨
      },
    },
    build: {
      outDir: "dist",
      sourcemap: false,
      minify: "esbuild",
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom"],
            query: ["@tanstack/react-query"],
          },
        },
      },
    },
    server: {
      proxy: isDev
        ? {
            "/api": {
              target: "https://dummyjson.com",
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api/, ""),
            },
          }
        : undefined,
    },
  }
})
