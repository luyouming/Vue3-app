<template>
  <div class="home-container">
    <van-icon class="scan" name="scan" @click="scan" />
    <!-- 搜索框 -->
    <van-search
      v-model="inputVal"
      class="search-box"
      shape="round"
      background="#fffdea"
      placeholder="搜索商品"
    />
    <!-- 面包屑导航 -->
    <div class="nav-list">
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
    <!-- 轮播图 -->
    <!-- <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(image, index) in images" :key="index"
        ><img v-lazy="image"
      /></van-swipe-item>
    </van-swipe> -->
    <!-- <h1 class="title">我是首页</h1> -->
    <!-- <layer-mask
      :title="popTitle"
      :iscancelButton="false"
      @cancel="next('cancel')"
      @confirm="next('confirm')"
    >
      <template v-slot:pop_btn>
        <van-button type="primary">点我</van-button>
      </template>
      <template v-slot:default> 内容，内容，我是内容 </template>
    </layer-mask> -->
  </div>
</template>

<script type="text/javascript">
// import homeAPI from "../../utils/api/home";
import { ref, toRefs, reactive, watch, getCurrentInstance } from "vue";
import Vue3Marquee from "vue3-marquee";
import homeAPI from "../../utils/api/home";
export default {
  name: "HomePage",
  components: {
    Vue3Marquee,
    // layerMask: require("../../components/LayerMask/index.vue").default,
  },
  setup: () => {
    // 访问环境变量
    const { proxy } = getCurrentInstance();
    console.log("app环境变量::::", proxy.$env);
    // 调用一个接口试试
    homeAPI
      .getConvertInfo({
        pageNo: 1,
        pageSize: 10,
        supplierCode: "",
        loading: false, // 底下有下拉的加载。不需要一开始的大屏加载等待loading了
      })
      .then((res) => {
        console.log("第一个接口返回::::", res);
      });
    const baseData = toRefs(
      reactive({
        showPop: false,
        popTitle: "温馨提示",
        navList: ["热搜", "新年礼遇", "休闲零食", "新品上市", "正在热卖"],
      })
    );
    // 扫码逻辑
    const scan = () => {
      console.log("点扫码");
    };
    const inputVal = ref("");
    watch(
      () => inputVal.value,
      (nv, ov) => {
        if (nv != "" && nv != ov) {
          clearTimeout(window.inputTimeout); // 每当用户输入的时候把前一个 setTimeout clear 掉
          window.inputTimeout = setTimeout(() => {
            // 然后又创建一个新的 setTimeout, 这样就能保证用户输入的 时间间隔内如果还有字符输入的话，就不会执行事件函数
            console.log(nv);
          }, 600); //用户输入完 0.55秒后执行事件
        }
      }
    );

    return {
      inputVal,
      scan,
      ...baseData,
    };
  },
  // watch: {
  // },
  computed: {},
  created() {
    // homeAPI
    //   .getConvertInfo({
    //     pageNo: 1,
    //     pageSize: 10,
    //     supplierCode: "",
    //     loading: false, // 底下有下拉的加载。不需要一开始的大屏加载等待loading了
    //   })
    //   .then(res => {
    //     console.log(res);
    //   });
  },
  methods: {
    next(type) {
      console.log(type);
    },
    searchChange() {
      console.log(this.inputVal);
    },
  },
};
</script>

<style lang="scss" scoped>
.home-container {
  width: 100%;
  height: auto;
  background: #fffdea;
  background: linear-gradient(to bottom, #fffdea, #fff);
  position: relative;
  .search-box {
    width: 100%;
    padding: 24px;
  }
  .scan {
    position: absolute;
    right: 48px;
    top: 38px;
    width: 40px;
    @include text-height(40px);
    font-size: 30px;
    z-index: 3;
  }
  :deep(.van-search .van-search__content) {
    background: #fff;
  }
  // 面包屑导航
  .nav-list {
    @include flex-center();
    justify-content: flex-start;
    margin: 30px 0;
    .cell {
      width: 20%;
      border-right: 1px solid #ddd;
      color: #555;
      @include text-height(25px);
    }
    .cell:nth-last-of-type(1) {
      border-right: none;
    }
  }
  // 广告通知
  .tips-info {
    @include flex-center();
    justify-content: flex-start;
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
  // .my-swipe {
  //   width: 100%;
  //   height: 350px;
  //   background-color: #fff;
  // }
  // .title {
  //   margin: 30px 0;
  //   font-size: 30px;
  // }
  // .van-swipe .van-swipe-item img {
  //   height: 100%;
  //   width: auto;
  // }
}
</style>
