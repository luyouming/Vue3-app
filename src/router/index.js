// import { defineAsyncComponent } from 'vue';
import { createRouter, createWebHashHistory } from "vue-router";

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
        keepAlive: true,
      },
      component: () => import("@/views/Home/index.vue"),
    },
    // 搜索商品
    {
      path: "/search_goods",
      name: "search_goods",
      meta: {
        title: "搜索商品",
        keepAlive: false,
      },
      component: () => import("@/views/SearchGoods/index.vue"),
    },
    {
      path: "/good_details",
      name: "good_details",
      meta: {
        title: "商品详情",
        keepAlive: false,
      },
      component: () => import("@/views/GoodDetails/index.vue"),
    },
    {
      path: "/shopping_cart",
      name: "shopping_cart",
      meta: {
        title: "购物车",
        keepAlive: false,
      },
      component: () => import("@/views/ShoppingCart/index.vue"),
    },
    // 提交下单页
    {
      path: "/order_submit",
      name: "order_submit",
      meta: {
        title: "购物车",
        keepAlive: false,
      },
      component: () => import("@/views/OrderSubmit/index.vue"),
    },
    // 待付款订单页
    {
      path: "/order_pay",
      name: "order_pay",
      meta: {
        title: "待付款的订单",
        keepAlive: false,
      },
      component: () => import("@/views/OrderPay/index.vue"),
    },
    // 种草
    {
      path: "/give_love",
      name: "give_love",
      meta: {
        title: "种草",
        keepAlive: false,
      },
      component: () => import("@/views/GiveLove/index.vue"),
    },
    {
      path: "/user",
      name: "user",
      meta: {
        title: "个人中心",
        keepAlive: false,
      },
      component: () => import("@/views/User/index.vue"),
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
// 跳转后返回顶部
// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.afterEach((to, from, next) => {
  window.scrollTo(0, 0);
});

export default router;
