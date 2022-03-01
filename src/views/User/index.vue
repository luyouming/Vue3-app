<template>
  <div class="header-box">
    <div class="user-box">
      <div class="head-img">
        <van-image class="pic" src="https://img.yzcdn.cn/vant/cat.jpeg" />
      </div>
      <div class="desc">
        <p class="title">点击显示微信头像</p>
        <p class="txt">成长值0</p>
      </div>
    </div>
    <div class="bottom-bar">
      <div class="diamand">
        <van-icon
          name="like-o"
          color="#ee0a24"
          size="large"
        />成为会员，领8张优惠券
      </div>
      <div class="goRegister">立即注册<van-icon name="arrow" /></div>
    </div>
  </div>
  <div class="content-box">
    <van-row class="info-tags" justify="space-around">
      <van-col span="4" class="nav">
        <p class="price">0.00</p>
        <p class="txt">余额</p>
      </van-col>
      <van-col span="4" class="nav">
        <p class="price">0.00</p>
        <p class="txt">积分</p>
      </van-col>
      <van-col span="4" class="nav">
        <p class="price">0.00</p>
        <p class="txt">卡</p>
      </van-col>
      <van-col span="4" class="nav">
        <p class="price">0.00</p>
        <p class="txt">优惠券/码</p>
      </van-col>
      <van-col span="4" class="nav">
        <p class="price"><van-icon size="18" name="cash-o" color="#000" /></p>
        <p class="txt">零钱</p>
      </van-col>
    </van-row>
    <!-- 我的订单 -->
    <van-cell-group inset class="my-order">
      <van-cell title="我的订单" value="查看全部订单" is-link />
      <van-row class="info-tags" justify="space-around">
        <van-col span="4" class="nav">
          <p class="price"><van-icon size="18" name="cash-o" color="#000" /></p>
          <p class="txt">待付款</p>
        </van-col>
        <van-col span="4" class="nav">
          <p class="price"><van-icon size="18" name="cash-o" color="#000" /></p>
          <p class="txt">待发货</p>
        </van-col>
        <van-col span="4" class="nav">
          <p class="price"><van-icon size="18" name="cash-o" color="#000" /></p>
          <p class="txt">待收货</p>
        </van-col>
        <van-col span="4" class="nav">
          <p class="price"><van-icon size="18" name="cash-o" color="#000" /></p>
          <p class="txt">评价</p>
        </van-col>
        <van-col span="4" class="nav">
          <p class="price"><van-icon size="18" name="cash-o" color="#000" /></p>
          <p class="txt">退款/售后</p>
        </van-col>
      </van-row>
    </van-cell-group>
    <!-- 卡片 -->
    <van-cell-group inset class="function-lines">
      <van-cell title="购物车" icon="location-o" value="" is-link />
      <van-cell title="任务中心" icon="location-o" value="" is-link />
      <van-cell title="返现" icon="location-o" value="" is-link />
      <van-cell title="赠品" icon="location-o" value="" is-link />
    </van-cell-group>
    <van-cell-group inset class="function-lines">
      <van-cell title="收货地址" icon="location-o" value="" is-link />
    </van-cell-group>
    <van-cell-group inset class="function-lines">
      <van-cell title="个人信息" icon="location-o" value="" is-link />
      <van-cell title="账号设置" icon="location-o" value="" is-link />
    </van-cell-group>
  </div>
</template>

<script lang="ts">
import { toRefs, reactive } from 'vue'
import { useStore } from 'vuex'
// useRoute, useRouter,
import { onBeforeRouteLeave } from 'vue-router'
// import { Toast } from 'vant'
export default {
  name: 'User',
  setup: () => {
    // 需要底部导航
    const store = useStore()
    store.dispatch('global/toggleBottomNav', true)
    store.dispatch('global/setBottomNavActive', 3)
    onBeforeRouteLeave((to, from) => {
      store.dispatch('global/toggleBottomNav', false)
    })
    // const route = useRoute()
    // let goodsList = Object.values(route.query)
    // console.log(goodsList)
    const baseData = toRefs(
      reactive({
        userName: 'famous',
      })
    )
    return {
      ...baseData,
    }
  },
}
</script>

<style lang="scss" scoped>
.header-box {
  background-color: #b58f65;
  height: 400px;
  width: 100%;
  position: relative;
  .user-box {
    position: absolute;
    left: 34px;
    top: 84px;
    @include flex-layout(row, flex-start, center);
    .head-img {
      @include square(150px);
      // border: 1px solid red;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 20px;
      .pic {
        width: 100%;
        height: 100%;
      }
    }
    .desc {
      .title {
        font-size: 36px;
        font-weight: bold;
      }
      .txt {
        background-color: #333;
        padding: 5px 10px;
        width: 90px;
        @include text-height(30px);
        color: #f8deac;
        border-radius: 20px;
        font-size: 22px;
        text-align: center;
      }
    }
  }
  .bottom-bar {
    position: absolute;
    bottom: 0;
    width: calc(100% - 48px);
    margin: 0 24px;
    background-color: #36332d;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    padding: 0 20px;
    box-sizing: border-box;
    @include text-height(90px);
    @include flex-layout(row, space-between, center);
    .diamand {
      color: #f8deac;
      @include flex-center();
      i {
        margin-right: 10px;
      }
    }
    .goRegister {
      color: #fff;
    }
  }
}
.content-box {
  padding: 24px 24px 134px 24px;
  .info-tags {
    background-color: #fff;
    padding: 20px 0;
    border-radius: 20px;
    .nav {
      text-align: center;
      .price {
        font-size: 32px;
        font-weight: bold;
      }
      .txt {
        color: #666;
      }
    }
  }
  :deep(.my-order) {
    padding: 24px 0;
    margin-top: 24px;
    .van-cell {
      padding: 0 24px 24px 24px;
    }
    .van-cell__title,
    .van-cell__value {
      @include text-height(48px);
    }
    .van-cell__title {
      font-size: 30px;
      font-weight: bold;
    }
  }
  :deep(.function-lines) {
    margin-top: 24px;
    .van-cell {
      padding: 20px;
    }
    .van-cell__title,
    .van-cell__value {
      @include text-height(48px);
    }
  }
}
</style>
