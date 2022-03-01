<template>
  <div class="search-goods">
    <!-- 搜索框 -->
    <div class="search-box" ref="topNavBar" :class="{ fixed: showFixedTopNav }">
      <van-icon class="scan" name="scan" @click="scan" />
      <van-search
        v-model="inputVal"
        class="search"
        shape="round"
        background="#ffffff"
        placeholder="搜索商品"
      />
    </div>
    <title-bar
      class="title-bar"
      :class="{ title_bar_with_search_fix: showFixedTopNav }"
      :leftText="'历史搜索'"
      @next="seeMore(1)"
    >
      <template v-slot:right>
        <div @click="clearHistory">
          <van-icon color="#666" name="delete" size="14px"></van-icon>
          <span>清空</span>
        </div>
      </template>
    </title-bar>

    <!-- 历史标签 -->
    <div class="history_tags">
      <div
        class="tag"
        @click="inputVal = tag"
        v-for="(tag, index) in historyTags"
        :key="tag + index"
      >
        {{ tag }}
      </div>
    </div>
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

    <!-- 底部 -->
    <bottom-line class="bottom-line"></bottom-line>
  </div>
</template>

<script lang="ts">
import { ref, toRefs, reactive, watch, getCurrentInstance } from 'vue'
import homeAPI from '../../utils/api/home'
import bottomLine from '@components/BottomLine/index.vue'
import { mockData } from './mock/index'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { useStore } from 'vuex'
import { topTabBarFixed } from '@mixin'
import titleBar from '@components/TitleBar/index.vue'

import * as storage from 'tcfe-helper/util/storage'
// import layerMask from "../../components/LayerMask/index.vue";
export default {
  name: 'SearchGoods',
  components: {
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
        historyTags: ['冰', '星', '竹林'],
        ...mockData,
        orgGoodsList: [],
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

    // 调用一个接口试试

    const getGoodsList = (val) => {
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
          if (val) {
            // 实际上是带着参数去搜索
            baseData.goodsList.value = goods.filter((item) => {
              return item.desc.includes(val)
            })
          } else {
            baseData.goodsList.value = goods
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
    getGoodsList()

    // 访问环境变量
    const { proxy } = getCurrentInstance()

    console.log('环境变量', proxy.$env)
    console.log('微信jssdk方法', window.wx)

    // 扫码逻辑
    const scan = () => {
      console.log('点扫码')
    }

    const router = useRouter()

    // 去详情页
    const goGoodDetails = (item) => {
      router.push({ path: '/good_details', query: item })
    }
    const inputVal = ref('')
    watch(
      () => inputVal.value,
      (nv, ov) => {
        nv = nv.trim() // 去除前后空格
        if (nv != '' && nv != ov) {
          clearTimeout(window.inputTimeout) // 每当用户输入的时候把前一个 setTimeout clear 掉
          window.inputTimeout = setTimeout(() => {
            // 然后又创建一个新的 setTimeout, 这样就能保证用户输入的 时间间隔内如果还有字符输入的话，就不会执行事件函数
            console.log(nv)
            getGoodsList(nv) // 重新请求拿到新的数据源
            // 滤出所有的相关商品
            // if (baseData.goodsList.value &&  baseData.goodsList.value.length> 0){
            //   return
            // }
            if (baseData.historyTags.value.includes(nv)) {
              let curIndex = baseData.historyTags.value.findIndex(
                (item) => nv == item
              )
              baseData.historyTags.value.splice(curIndex, 1)
              baseData.historyTags.value.unshift(nv)
            } else {
              baseData.historyTags.value.unshift(nv)
            }
            if (baseData.historyTags.value.length > 4) {
              baseData.historyTags.value.splice(4)
            }
          }, 600) //用户输入完 0.55秒后执行事件
        } else if (nv == '') {
          getGoodsList()
        }
      }
    )
    // 清空历史搜索
    const clearHistory = () => {
      console.log('清空历史搜索')
      baseData.historyTags.value = []
    }

    return {
      inputVal,
      scan,
      ...baseData,
      goGoodDetails,
      clearHistory,
    }
  },
}
</script>

<style lang="scss" scoped>
.search-goods {
  width: 100%;
  height: auto;
  min-height: calc(100vh - 120px); // 撑满剩余盒子高度
  background: #ffffff;
  // background: linear-gradient(to bottom, #fffdea, #fff);
  .search-box {
    width: 100%;
    box-sizing: border-box;
    background: #fff;
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
    background: #f7f8fa;
  }

  // 标题栏
  .title-bar {
    margin: 0 24px;
  }
  .title_bar_with_search_fix {
    margin-top: 120px;
  }
  .history_tags {
    @include flex-layout(row, flex-start, center);
    padding: 0 24px;
    .tag {
      @include text-height(60px);
      padding: 0 20px;
      font-size: 26px;
      border: 1px solid #ddd;
      margin-right: 15px;
      border-radius: 20px;
    }
  }

  // 商品列表
  .goods-list {
    // @include horizontal-scroll(100%);
    padding-bottom: 18px;
    margin: 0 8px;
    @include flex-layout(row, flex-start, center);
    flex-wrap: wrap;
    .card {
      @include flex-layout(column);
      margin: 16px;
      overflow: hidden;
      width: calc(50% - 32px);
      :deep(.pic) {
        @include square(320px);
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
