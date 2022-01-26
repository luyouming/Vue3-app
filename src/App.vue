<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" v-if="$route.meta.keepAlive" />
    </keep-alive>
    <component :is="Component" v-if="!$route.meta.keepAlive" />
  </router-view>
  <!-- 公共底部菜单 -->
  <van-tabbar v-model="active">
    <van-tabbar-item icon="wap-home" @click="go('')">首页</van-tabbar-item>
    <van-tabbar-item icon="star" @click="go('order')">种草</van-tabbar-item>
    <van-tabbar-item icon="shopping-cart">购物车</van-tabbar-item>
    <van-tabbar-item icon="manager">我的</van-tabbar-item>
  </van-tabbar>
  <div v-show="LOADING" class="loading">
    <van-loading type="spinner" color="#1989fa" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
export default defineComponent({
  name: "App",
  components: {},
  data() {
    return {
      active: 0,
    };
  },
  computed: {
    ...mapState(["LOADING"]),
  },
  methods: {
    go(path: string) {
      this.$router.push("/" + path);
    },
  },
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /* background: #f8f9fd; */
  /* color: #2c3e50; */
  /* margin-top: 60px; */
  /* 最常用的基本字体大小基准 */
  font-size: 24px;
  /* position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0; */
}
.loading {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
