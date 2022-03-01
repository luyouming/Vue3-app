<template>
  <div class="home-container">
    <!-- 搜索框 -->
    <div
      class="search-box"
      @click="goSearchGoods"
      ref="topNavBar"
      :class="{ fixed: showFixedTopNav }"
    >
      <van-icon class="scan" name="scan" @click.stop="scan" />
      <van-search
        v-model="inputVal"
        class="search"
        shape="round"
        background="#fffdea"
        placeholder="搜索商品"
      />
    </div>
    <!-- 面包屑导航 -->
    <div
      class="nav-list"
      :class="{ nav_list_with_search_fix: showFixedTopNav }"
    >
      <div v-for="(item, index) in navList" :key="item + index" class="cell">
        {{ item }}
      </div>
    </div>
    <!-- 左右滑动循环文字通知 -->
    <div class="tips-info">
      <van-icon class="icon" color="#F29035" name="volume-o" />
      <Vue3Marquee class="info">
        <span>物流停运通知: 1月26日-2月7日订单将在2月8日统一发出! </span>
      </Vue3Marquee>
    </div>
    <div class="ADs">
      <img src="https://img01.yzcdn.cn/vant/apple-1.jpg" alt="" />
    </div>
    <!-- 导航入口 -->
    <div class="nav-entries">
      <div
        class="entry"
        v-for="(item, index) in entries"
        :key="item.name + index"
      >
        <img :src="item.url" alt="" />
        <p>{{ item.name }}</p>
      </div>
    </div>
    <!-- 标题栏--每日上新 -->
    <title-bar
      class="title-bar"
      :leftText="'每日上新'"
      :rightText="'查看更多'"
      @next="seeMore(1)"
    >
    </title-bar>
    <!-- 横向滚动 -->
    <div class="goods-list">
      <div
        class="card"
        v-for="(item, index) in goodsList"
        :key="item.id + index"
        @click="goGoodDetails(item)"
      >
        <van-image class="pic" :src="item.imgUrl" />
        <p>{{ item.desc }}</p>
        <div class="price-box">
          <span class="unit">￥</span>
          <span class="num">{{ item.price }}</span>
        </div>
      </div>
    </div>

    <!-- 标题栏 -- 限时折扣 -->
    <title-bar class="title-bar">
      <template v-slot:left>
        <div class="left-content">
          <span class="main">限时折扣</span>
          <van-count-down
            :time="countTime"
            class="count-down"
            @finish="countTimeFinish"
          >
            <template #default="timeData">
              <span class="block">{{ timeZeroFormat(timeData.hours) }}</span>
              <span class="colon">:</span>
              <span class="block">{{ timeZeroFormat(timeData.minutes) }}</span>
              <span class="colon">:</span>
              <span class="block">{{ timeZeroFormat(timeData.seconds) }}</span>
            </template>
          </van-count-down>
        </div>
      </template>
    </title-bar>

    <!-- 横向滚动内容 -->
    <div class="goods-list">
      <div
        class="card"
        v-for="(item, index) in goodsList"
        :key="item.id + index"
        @click="goGoodDetails(item)"
      >
        <van-image class="pic" :src="item.imgUrl" />
        <p>{{ item.desc }}</p>
        <div class="price-box">
          <span class="unit">￥</span>
          <span class="num">{{ item.price }}</span>
        </div>
      </div>
    </div>

    <!-- 标题栏--人气单品 -->
    <title-bar
      class="title-bar"
      :leftText="'人气单品'"
      :rightText="'查看更多'"
      @next="seeMore(1)"
    >
    </title-bar>
    <!-- 横向滚动内容 -->
    <div class="goods-list">
      <div
        class="card"
        v-for="(item, index) in goodsList"
        :key="item.id + index"
        @click="goGoodDetails(item)"
      >
        <van-image class="pic" :src="item.imgUrl" />
        <p>{{ item.desc }}</p>
        <div class="price-box">
          <span class="unit">￥</span>
          <span class="num">{{ item.price }}</span>
        </div>
      </div>
    </div>

    <!-- 客服系列按钮 -->
    <div class="custom-services">
      <div
        class="serve"
        :class="{ mask: item.icon == 'cross' }"
        v-show="showServe(item.icon)"
        v-for="(item, index) in services"
        :key="item.icon + index"
        @click="toggleServiceShow(item.icon)"
      >
        <van-icon
          :color="item.icon == 'cross' ? '#fff' : '#000'"
          :name="item.icon"
          size="0.5rem"
        ></van-icon>
      </div>
    </div>
    <!-- 底部 -->
    <bottom-line class="bottom-line"></bottom-line>
  </div>
</template>

<script lang="ts">
import { ref, toRefs, reactive, watch, getCurrentInstance } from 'vue'
import Vue3Marquee from 'vue3-marquee'
import homeAPI from '../../utils/api/home'
import titleBar from '@components/TitleBar/index.vue'
import bottomLine from '@components/BottomLine/index.vue'
import { mockData } from './mock/index'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { useStore } from 'vuex'
import { topTabBarFixed } from '@mixin'

import * as storage from 'tcfe-helper/util/storage'
// import layerMask from "../../components/LayerMask/index.vue";
export default {
  name: 'HomePage',
  components: {
    Vue3Marquee,
    // layerMask,
    titleBar,
    bottomLine,
  },
  mixins: [topTabBarFixed],
  setup: () => {
    // 需要底部导航
    // const store = useStore()
    // store.dispatch('global/toggleBottomNav', true)
    // store.dispatch('global/setBottomNavActive', 0)
    // onBeforeRouteLeave((to, from) => {
    //   store.dispatch('global/toggleBottomNav', false)
    // })

    const baseData = toRefs(
      reactive({
        showPop: false,
        showAllAervices: false,
        // showFixedTopNav: false,
        countTime: 1 * 60 * 60 * 1000, // 倒计时  几小时
        popTitle: '温馨提示',
        ...mockData,
        services: [
          {
            icon: 'service-o',
          },
          {
            icon: 'shopping-cart-o',
          },
          {
            icon: 'share-o',
          },
          {
            icon: 'cross',
          },
          {
            icon: 'plus',
          },
        ],
      })
    )

    // 访问环境变量
    const { proxy } = getCurrentInstance()

    console.log('环境变量', proxy.$env)
    console.log('微信jssdk方法', window.wx)

    // 扫码逻辑
    const scan = () => {
      console.log('点扫码')
    }
    // 查看更多
    const seeMore = (type) => {
      console.log('查看更多:::', type)
    }
    // 展示客服
    const showServe = (icon) => {
      if (baseData.showAllAervices.value) {
        // 点了+号，那就只有加号不展示，别的都展示
        return icon != 'plus'
      } else {
        // 点了X  那就只展示服务和加号
        return icon == 'plus' || icon == 'service-o'
      }
    }
    // 切换展示客服
    const toggleServiceShow = (icon) => {
      // console.log(icon);
      if (icon == 'plus') {
        baseData.showAllAervices.value = true
      } else if (icon == 'cross') {
        baseData.showAllAervices.value = false
      }
    }
    // 倒计时结束
    const countTimeFinish = () => {
      console.log('倒计时结束')
    }
    // 倒计时补零
    const timeZeroFormat = (time) => {
      if (time < 10) {
        return '0' + time
      } else {
        return time
      }
    }
    const router = useRouter()
    // console.log(router)

    // 去详情页
    const goGoodDetails = (item) => {
      router.push({ path: '/good_details', query: item })
    }
    // 去搜索商品页
    const goSearchGoods = (item) => {
      console.log(item)
      router.push({ path: '/search_goods', query: item })
    }

    const inputVal = ref('')
    watch(
      () => inputVal.value,
      (nv, ov) => {
        if (nv != '' && nv != ov) {
          clearTimeout(window.inputTimeout) // 每当用户输入的时候把前一个 setTimeout clear 掉
          window.inputTimeout = setTimeout(() => {
            // 然后又创建一个新的 setTimeout, 这样就能保证用户输入的 时间间隔内如果还有字符输入的话，就不会执行事件函数
            console.log(nv)
          }, 600) //用户输入完 0.55秒后执行事件
        }
      }
    )

    return {
      inputVal,
      scan,
      ...baseData,
      seeMore,
      toggleServiceShow,
      showServe,
      countTimeFinish,
      timeZeroFormat,
      goGoodDetails,
      goSearchGoods,
      // toFixNavBar,
    }
  },
  // keepalive 开启特有的生命周期
  activated() {
    const store = useStore()
    store.dispatch('global/toggleBottomNav', true)
    store.dispatch('global/setBottomNavActive', 0)
    onBeforeRouteLeave((to, from) => {
      store.dispatch('global/toggleBottomNav', false)
    })
    // 调用一个接口试试
    homeAPI
      .getConvertInfo(
        {
          spuids:
            'P1472118998677073920,P1482709280749535232,P1468501599293825024,P1480818913808764928,P1480808629803175936,P1483685255444447232,P1480819750899564544,P1480819714379747330,P1480812521135816704,P1480807306428960768,P1483687359382835200,P1480824067207467008,P1483688982083551232,P1480809656442949632,P1483700609864437760,P1480810819687026688,P1483709557669642240,P1480805282291400704,P1480806928337604608,P1483716088314204160,P1480812735871602688,P1480809895988039680,P1483717564071677952',
        },
        {
          loading: false, // 底下有下拉的加载。不需要一开始的大屏加载等待loading了
        }
      )
      .then((res) => {
        console.log('第一个接口返回::::', res)
        let goods = []
        res.list.map((item) => {
          let Obj = { ...item.spu }
          Obj.imgUrl = item.spu.image
          Obj.desc = item.spu.title
          Obj.price = item.minPrice
          goods.push(Obj)
        })

        this.goodsList = goods
      })
      .catch((err) => {
        console.log(err)
      })
  },
}
</script>

<style lang="scss" scoped>
.home-container {
  width: 100%;
  height: auto;
  padding-bottom: 210px;
  // background: #fffdea;
  background: linear-gradient(to bottom, #fffdea, #fff);
  .search-box {
    width: 100%;
    box-sizing: border-box;
    background: #fffdea;
    padding: 12px;
    height: 120px;
    position: relative;
    &.fixed {
      position: fixed;
      top: 0;
      z-index: 3;
    }
    .scan {
      position: absolute;
      right: 48px;
      top: 40px;
      width: 40px;
      @include text-height(40px);
      font-size: 30px;
      z-index: 3;
    }
  }

  :deep(.van-search .van-search__content) {
    background: #fff;
  }
  // 面包屑导航
  .nav-list {
    @include flex-center();
    justify-content: flex-start;
    margin: 15px 0;
    padding-top: 10px;
    .cell {
      width: 20%;
      text-align: center;
      border-right: 1px solid #ddd;
      color: #555;
      @include text-height(25px);
    }
    .cell:nth-last-of-type(1) {
      border-right: none;
    }
  }
  // // 搜索置顶时
  .nav_list_with_search_fix {
    margin-top: 120px;
  }
  // 广告通知
  .tips-info {
    @include flex-center();
    justify-content: flex-start;
    margin: 0 24px;
    .icon {
      @include square(60px);
      line-height: 60px;
      font-size: 30px;
    }
    .info {
      width: 100%;
      text-align: left;
      color: #f29035;
      text-indent: 200px;
    }
  }
  // 广告轮播图
  .ADs {
    width: 100%;
    box-sizing: border-box;
    height: 200px;
    @include flex-center();
    overflow: hidden;
    border-radius: 20px;
    img {
      width: 100%;
      height: auto;
    }
  }
  // 导航入口
  .nav-entries {
    @include flex-center();
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 40px 5px 20px 5px;
    .entry {
      width: 20%;
      text-align: center;
      margin: 10px 0;
      img {
        @include square(80px);
      }
      // p {
      //   text-align: ;
      // }
    }
  }
  // 标题栏
  .title-bar {
    margin: 0 24px;
    .left-content {
      @include flex-layout(row, flex-start, center);
      .main {
        font-size: 32px;
        font-family: '微软雅黑';
        font-weight: bold;
      }
      // 倒计时
      .count-down {
        margin-left: 20px;
        .colon {
          display: inline-block;
          margin: 0 10px;
          font-weight: bold;
        }
        .block {
          display: inline-block;
          width: 40px;
          color: #fff;
          font-weight: bold;
          font-size: 24px;
          text-align: center;
          // background-color: #ee0a24;
          background-color: orangered;
        }
      }
    }
  }

  // 客服系列按钮
  .custom-services {
    position: fixed;
    right: 30px;
    bottom: 160px;
    width: 80px;
    @include flex-center();
    flex-direction: column;
    .serve {
      background: #fff;
      box-shadow: 1px 1px 1px 1px #ccc;
      border-radius: 50%;
      margin-bottom: 15px;
      @include square(80px);
      @include flex-center();
      &.mask {
        background: #000;
        opacity: 0.5;
      }
    }
  }
  // 商品列表
  .goods-list {
    @include horizontal-scroll(100%);
    padding-bottom: 18px;
    .card {
      @include flex-layout(column);
      margin-right: 30px;
      :deep(.pic) {
        @include square(270px);
        border-radius: 10px;
        overflow: hidden;
        @include flex-center;
        img {
          width: auto;
          height: 100%;
        }
      }
      p {
        margin: 12px 24px;
        text-align: left;
        max-height: 80px;
        @include ellipsis-more(2);
      }
      .price-box {
        width: 270px;
        text-align: left;
        padding-left: 24px;
        @include text-height(32px);
        .unit {
          color: #f29035;
        }
        .num {
          color: #f29035;
          font-size: 32px;
        }
      }
    }
  }
  .bottom-line {
    margin-top: 180px;
  }
}
</style>
