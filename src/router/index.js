// import { defineAsyncComponent } from 'vue';
import { createRouter, createWebHashHistory } from "vue-router";
// const path = require('path')

const isProduction = process.env.NODE_ENV === "production";
const basePath = isProduction ? "/shooping-mall/" : "/";

const router = createRouter({
  history: createWebHashHistory(basePath), // 如果是根目录部署请配置为 /
  routes: [
    // route -> routes
    {
      path: "/",
      name: "home",
      meta: {
        title: "首页",
        keepAlive: false,
      },
      component: () => import("@/views/Home/index.vue"),
    },
    {
      path: "/order",
      name: "order",
      meta: {
        title: "订单",
        keepAlive: false,
      },
      component: () => import("@/views/OrderList/index.vue"),
    },
  ],
});
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.afterEach((to, from) => {
  // console.log('afterEach')
});

export default router;
