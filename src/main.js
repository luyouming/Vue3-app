import axios from "axios";
import "lib-flexible";
import "vant/lib/index.css";
// import { Button, Dialog, Icon,
//     Divider, Tab, Tabs, Toast, Notify, Tabbar, TabbarItem,
//     Image as VanImage, Lazyload, Loading   } from 'vant'
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// import './assets/css/style.scss'
import env from "./utils/env.js";
import vantComps from "./utils/vant";

const app = createApp(App);
app.config.globalProperties.$axios = axios;
app.config.globalProperties.$env = env;

app.use(vantComps);
app.use(router).use(store);

app.mount("#app");
