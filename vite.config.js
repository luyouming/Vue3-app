import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
// https://vitejs.dev/config/

// const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  root: process.cwd(),
  base: "./", // 如果是根目录部署请配置为 /  isProduction ? "./" : "/"
  // mode: process.env.NODE_ENV,
  publicDir: "public",
  plugins: [vue()],
  resolve: {
    alias: {
      "@": "/src/", //设置别名
      "@views": "/src/views/",
      "@components": "/src/components/",
      "@assets": "/src/assets/",
      "@mixin": "/src/mixin/",
    },
  },
  server: {
    port: "3000",
    strictPort: false,
    open: false,
    cors: true,
    proxy: {
      // 选项写法 开发环境代理到 测试 预发环境
      "/cvgmallbff": {
        target: "https://wx.t.17u.cn", // 代理网址 --上了预发可以用
        // target: "http://10.181.139.253:5200", //本地联调 --自己本地机子
        changeOrigin: true, // 只改域名端口
        // rewrite: (path) => path.replace(/^\/cvgmallbff/, ""),
      },
      // 测试支付
      "/hsrtmiddletest": {
        target: "https://wx.17u.cn", // 代理网址 --上了预发可以用
        // target: "http://10.181.139.253:5200", //本地联调 --自己本地机子
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/hsrtmiddletest/, ""), // 重写链接
      },
    },
  },
  build: {
    // outDir: 'dist',
    assetsDir: "static",
    // 生产环境移除 console
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // 打包部分文件体积过大问题优化
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
      },
    },
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
