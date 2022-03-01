import axios from "axios";
import "lib-flexible";
import "vant/lib/index.css";
import { createApp } from "vue";
import lazyPlugin from "vue3-lazy";
import App from "./App.vue";
import errImg from "./assets/img/404.png";
import router from "./router";
import store from "./store/index";
// import './assets/css/style.scss'
import env from "./utils/env.js";
import vantComps from "./utils/vant";
import pay from "./utils/pay";
import wx from "weixin-js-sdk";

const app = createApp(App);
app.config.globalProperties.$axios = axios;
app.config.globalProperties.$env = env;
window.wx = wx;

app.use(vantComps).use(pay).use(router).use(store).use(lazyPlugin, {
  // loading: errImg, // 加载时默认图片
  error: errImg, // 图片失败时默认图片
});
app.mount("#app");
