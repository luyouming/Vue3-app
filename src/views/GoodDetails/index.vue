<template>
  <div class="order-list">
    <!-- 轮播图 -->
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(image, index) in images" :key="index"
        ><img v-lazy="image"
      /></van-swipe-item>
      <template #indicator="{ active, total }">
        <div class="custom-indicator">{{ active + 1 }}/{{ total }}</div>
      </template>
    </van-swipe>
    <!-- 价格 -->
    <div class="price-box">
      ￥
      <div class="num">{{ goodDetailsInfo.price }}</div>
      <div class="discount">
        新人专享￥<span class="num">{{ goodDetailsInfo.price - 5 }}</span
        >起
      </div>
    </div>
    <div class="orgPrice">价格 <s>￥ 99.9</s></div>
    <!-- 优惠券 -->
    <div class="coupon-bar">
      <div class="left">
        <div class="price">￥<span class="num">5</span></div>
        <div class="discribe">
          <p>新人专享券</p>
          <p>本商品下单可抵扣</p>
        </div>
      </div>
      <div class="getIt" @click="getCoupon">
        {{ hasGetCoupon ? '已领取' : '立即领取' }}
      </div>
    </div>
    <!-- 评价 -->
    <van-cell class="comment" title="商品评价" value="暂无评价" />
    <van-cell
      class="comment all-comments"
      title="该商品所属店铺评价"
      is-link
      value="查看全部"
    />
    <!-- 底部结款导航栏 -->
    <van-action-bar>
      <van-action-bar-icon icon="chat-o" text="客服" :dot="false" />
      <!-- badge="5" 有消息冒泡及数量-->
      <van-action-bar-icon icon="shop-o" text="店铺" />
      <van-action-bar-icon
        icon="cart-o"
        text="购物车"
        :badge="shoppingCartNum"
        @click="goShoppingCart"
      />
      <van-action-bar-button
        type="warning"
        @click="addToShoppingCart"
        text="加入购物车"
      />
      <van-action-bar-button type="danger" @click="buyIt" text="立即购买" />
    </van-action-bar>
    <!-- 遮罩层 -->
    <van-overlay class="overlay" :show="showPayQrcode" @click="finishPay(-1)">
      <div class="block" @click.stop>
        <van-image class="img" :src="payQrcode"></van-image>
        <p class="desc">请使用微信扫一扫完成支付</p>
        <van-icon
          class="icon"
          @click="finishPay(-1)"
          size="18px"
          name="cross"
          color="#333"
        />
      </div>
    </van-overlay>
  </div>
</template>

<script lang="ts">
import { toRefs, reactive, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Toast } from 'vant'
export default {
  name: 'GoodDetails',
  setup: () => {
    const route = useRoute()
    console.log(route.query)
    let goodDetailsInfo = route.query || {
      price: '68.00-952.00',
    }
    let images = goodDetailsInfo.imgUrl
      ? [goodDetailsInfo.imgUrl]
      : [
          'https://img01.yzcdn.cn/vant/apple-1.jpg',
          'https://img01.yzcdn.cn/vant/apple-2.jpg',
          'https://img01.yzcdn.cn/vant/apple-3.jpg',
          'https://img01.yzcdn.cn/vant/apple-4.jpg',
        ] // 测试数据
    const baseData = toRefs(
      reactive({
        images,
        shoppingCartNum: 0,
        hasGetCoupon: false, // 是否已领取优惠券
        goodDetailsInfo: goodDetailsInfo,
        cartGoods: [],
        showPayQrcode: false, // 展示二维码
        payQrcode:
          'https://file.40017.cn/trainwechat/miniapp/hsrtfront/travel_around_wx_qrcode.png',
      })
    )
    // 访问环境变量
    const { proxy } = getCurrentInstance()

    // 立即购买
    const buyIt = () => {
      // console.log('购买')
      baseData.showPayQrcode.value = true
      // 调用支付
      proxy.$func.pay(
        {
          orderSerialId: 53645777,
          orderAmount: 300,
        },
        ({ code, text }) => {
          console.log(code, text)
        },
        'hsrtmiddletest/payment/getPayLinkInfoToTravel'
      ) // 最新火车票获取支付参数的接口
    }
    // 立即领券
    const getCoupon = () => {
      console.log('领券')
      baseData.hasGetCoupon.value = true
      Toast('领取成功')
    }
    const addToShoppingCart = () => {
      console.log('加入购物车')
      baseData.shoppingCartNum.value++

      baseData.cartGoods.value.push(route.query.id)
      console.log(typeof baseData.cartGoods.value, baseData.cartGoods.value)
    }
    // 去购物车页
    const router = useRouter()
    const goShoppingCart = () => {
      router.push({ path: '/shopping_cart', query: baseData.cartGoods.value })
    }

    const finishPay = (val) => {
      baseData.showPayQrcode.value = false
      // baseData.paying.value = false
      setTimeout(() => {
        console.log('去支付详情页')
        // 订单号
        router.push({
          path: '/order_pay',
          query: { orderSerialId: '346688769' },
        })
      }, 1000)
    }
    return {
      ...baseData,
      addToShoppingCart,
      buyIt,
      getCoupon,
      goShoppingCart,
      finishPay,
    }
  },
}
</script>

<style lang="scss" scoped>
.order-list {
  .my-swipe {
    width: 100%;
    height: 600px;
    background-color: #fff;
  }
  .van-swipe .van-swipe-item img {
    height: 100%;
    width: auto;
  }
  .price-box {
    color: orangered;
    @include flex-layout(row, flex-start, center);
    margin: 30px 24px 0px 24px;
    .num {
      font-size: 50px;
      font-weight: bold;
    }
    .discount {
      padding: 2px 16px;
      border-radius: 15px;
      margin-left: 15px;
      @include text-height(36px);
      background-color: orangered;
      color: #fff;
      .num {
        font-size: 30px;
      }
    }
  }
  .orgPrice {
    color: #666;
    text-align: left;
    margin-left: 24px;
  }
  // 优惠券
  .coupon-bar {
    margin: 15px 24px;
    @include linear-x(#e68438, #ee7536, 20%, 80%);
    border-radius: 10px;
    padding: 15px 15px;
    color: #fff;
    @include flex-layout(row, space-between, center);
    font-weight: 600;
    .left {
      text-align: left;
      @include flex-layout(row, flex-start, center);
      .price {
        margin-right: 20px;
        .num {
          font-size: 50px;
          margin-left: -5px;
        }
      }
      .discribe p:nth-last-of-type(1) {
        font-weight: normal;
        font-size: 22px;
      }
    }
    .getIt {
      font-size: 32px;
    }
  }
  :deep(.comment) {
    margin: 18px 0;
    padding: 20px 24px;
    .van-cell__title {
      font-weight: bold;
      font-size: 26px;
    }
    .van-cell__title,
    .van-cell__value {
      line-height: 52px;
    }
  }
  :deep(.overlay) {
    @include flex-center();
    height: 100%;
    .block {
      height: 600px;
      width: 500px;
      background: #fff;
      @include flex-layout(column, center, center);
      position: relative;
      img {
        width: 300px;
        height: 300px;
      }
      .desc {
        font-size: 36px;
        font-weight: bold;
        margin-top: 30px;
      }
      .icon {
        position: absolute;
        top: 20px;
        right: 20px;
      }
    }
  }
  .custom-indicator {
    position: absolute;
    right: 25px;
    bottom: 25px;
    padding: 6px 12px;
    width: 60px;
    text-align: center;
    height: 30px;
    font-size: 24px;
    border-radius: 20px;
    color: #fff;
    background: rgba(0, 0, 0, 0.5);
  }
}
</style>
