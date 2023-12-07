import { resolve } from "path"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx"
import eslintPlugin from "vite-plugin-eslint"

// element-plus
import Components from "unplugin-vue-components/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    eslintPlugin({
      include: ["src/**/*.vue", "src/**/*.ts"],
      exclude: ["node_modules", "plop-templates"],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      "~": resolve(__dirname, "./"),
      "@": resolve(__dirname, "src"),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
  },
  optimizeDeps: {
    include: ["element-plus/es/locale/lang/zh-cn", "element-plus/es/locale/lang/en"],
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
        charset: false,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("element-plus")) {
            return "element-plus"
          }

          if (id.includes("node_modules")) {
            return "vendor"
          }
        },
      },
    },
  },
})
