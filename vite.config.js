import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
// https://vitejs.dev/config/

const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  root: process.cwd(),
  base: isProduction ? "/shooping-mall/" : "/", // 如果是根目录部署请配置为 /
  // mode: process.env.NODE_ENV,
  publicDir: "public",
  plugins: [vue()],
  resolve: {
    alias: {
      "@": "/src/", //设置别名
      "@components": "/src/components/",
      "@assets": "/src/assets/",
      "@views": "/src/views/",
    },
  },
  server: {
    port: "3000",
    strictPort: false,
    open: false,
    cors: true,
    proxy: {
      // 选项写法
      "/wxmp": {
        // target:'https://wx.17u.cn', // 代理网址 --上了预发可以用
        target: "http://10.181.139.253:5100", //本地联调 --自己本地机子
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/wxmp/, ""),
      },
    },
  },
  build: {
    // outDir: 'dist',
    assetsDir: "static",
    sourcemap: false,
    manifest: false,
    brotliSize: false,
  },
  optimizeDeps: {
    include: [
      "vue",
      // "vuex",
      // "vue-router",
      // "vant",
      // "axios",
    ],
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/assets/css/style.scss";`, //引用公共样式，使用vite搭建项目只安装sass即可，不需要安装node-sass,sass-loader
        charset: false,
      },
    },
  },
  define: {
    "process.env": {},
  },
});
