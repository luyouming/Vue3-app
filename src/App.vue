<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" v-if="$route.meta.keepAlive" />
    </keep-alive>
    <component :is="Component" v-if="!$route.meta.keepAlive" />
  </router-view>
  <!-- 公共底部菜单 -->
  <van-tabbar v-model="bottomNavActiveVal" v-show="showBottomNav">
    <van-tabbar-item icon="wap-home" @click="go('')">首页</van-tabbar-item>
    <!-- @click="go('giveLove')" -->
    <van-tabbar-item @click="go('give_love')" icon="star">种草</van-tabbar-item>
    <van-tabbar-item icon="shopping-cart" @click="go('shopping_cart')"
      >购物车</van-tabbar-item
    >
    <van-tabbar-item icon="manager" @click="go('user')">我的</van-tabbar-item>
  </van-tabbar>
  <div v-show="LOADING" class="loading">
    <van-loading type="spinner" color="#1989fa" />
  </div>
</template>

<script lang="ts">
import { toRefs, reactive, defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import useMapState from '@/utils/useMapState'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'App',
  components: {},
  setup: () => {
    // const baseData = toRefs(
    //   reactive({
    //     bottomNavActive: 0,
    //   })
    // )
    const router = useRouter()
    const go = (path: string) => {
      router.push('/' + path)
    }
    const globalState = useMapState({
      // 可以拿到store 中想要的公共状态，但是如果v-model 绑定这个值，要想修改到全局，还需要包装成computed，如下
      LOADING: (state) => state.global.LOADING,
      showBottomNav: (state) => state.global.showBottomNav,
      bottomNavActive: (state) => state.global.bottomNavActive,
    })
    const store = useStore()
    const bottomNavActiveVal = computed({
      get() {
        return globalState.bottomNavActive.value
      },
      set(val) {
        store.dispatch('global/setBottomNavActive', val)
      },
    })
    return {
      // ...baseData,
      bottomNavActiveVal,
      go,
      ...globalState,
    }
  },
  // 这是vue2的 computed + mapState 写法
  // computed: {
  //   ...mapState({
  //     //...展开运算符
  //     showBottomNav: (state) => state.global.showBottomNav,
  //     LOADING: (state) => state.global.LOADING, //此处注意需要区分模块(cart)，不能少 .cart.
  //   }),
  // },
  // 以下是vue3 写法精简
  // import useMapState from '@/utils/useMapState'
})
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
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
