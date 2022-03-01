<template>
  <div class="order-pay">
    <div class="order_status">订单状态: <span class="val">待支付</span></div>
    <div class="goods-box">
      <!-- 购物车商品列表--共{{ shoppingCartNum }}件商品 -->
      <div
        class="good-cards"
        v-for="(good, index) in goodsList"
        :key="good.id + index"
      >
        <good-card :goodsList="good" :readOnly="true"></good-card>
      </div>
      <!-- 详细信息 -->
      <van-cell-group class="details-info" inset>
        <van-cell title="配送方式" value="快递免运费" />
        <van-cell title="买家留言" value="无" />
      </van-cell-group>

      <van-cell-group class="details-info" inset>
        <van-cell title="商品金额" value="￥9.90" />
        <van-cell title="运费" value="-￥0.00" />
        <van-cell title="" :value="'合计 ￥' + totalPrice" />
      </van-cell-group>

      <!-- 去结算支付 -->
      <div class="submit-order">
        <div>
          合计: <span class="val">￥{{ totalPrice }}</span>
        </div>
        <div class="btn" @click="goPay">
          <van-loading size="20px" color="#ffffff" v-if="paying" />
          <span v-else>去支付</span>
        </div>
      </div>
    </div>
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
    <!-- <div class="tips light">
      <van-icon color="#ee0a24" name="fire-o" />
      已同步至好物圈
    </div> -->
    <bottom-line class="bottom-line"></bottom-line>
  </div>
</template>

<script lang="ts">
import { toRefs, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import bottomLine from '@components/BottomLine/index.vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { mockData } from './mock/index'
import goodCard from '@components/GoodCard/index.vue'
import { Coupon } from '_vant@3.4.3@vant/lib'
// import { Toast } from 'vant'
export default {
  name: 'OrderPay',
  components: {
    goodCard,
    bottomLine,
  },
  setup: () => {
    // 需要底部导航
    // const store = useStore()
    // store.dispatch('global/toggleBottomNav', true)
    // store.dispatch('global/setBottomNavActive', 2)
    // onBeforeRouteLeave((to, from) => {
    //   store.dispatch('global/toggleBottomNav', false)
    // })
    // 测试优惠券
    const coupon = {
      available: 1,
      condition: '无门槛\n最多优惠12元',
      reason: '',
      value: 1500,
      name: '优惠券名称',
      startAt: 1489104000,
      endAt: 1514592000,
      valueDesc: '15',
      unitDesc: '元',
    }
    const coupons = ref([coupon])
    const showCouponList = ref(false)
    const chosenCoupon = ref(-1)

    const route = useRoute()
    console.log('订单号::::', route.query.orderSerialId)
    let totalPrice = 0
    // 带着query 信息去搜索勾选的商品
    // 测试数据两个商品 下面是mock的数据
    let { goodsList } = mockData
    goodsList.forEach((item) => {
      item.total = item.price * item.num
      totalPrice += item.total
    })

    // console.log(goodsList)

    const baseData = toRefs(
      reactive({
        shoppingCartNum: goodsList.length,
        goodsList,
        totalPrice,
        paying: false,
        showPayQrcode: false,
        payQrcode:
          'https://file.40017.cn/trainwechat/miniapp/hsrtfront/travel_around_wx_qrcode.png',
      })
    )

    // 去逛逛
    const router = useRouter()

    const finishPay = (val) => {
      baseData.showPayQrcode.value = false
      // baseData.paying.value = false
      if (val < 0) {
        baseData.paying.value = false
      } else {
        console.log('去成功支付结果页')
      }
    }

    // 立即付款
    const goPay = () => {
      baseData.paying.value = true
      setTimeout(() => {
        baseData.showPayQrcode.value = true
      }, 1000)
    }

    return {
      ...baseData,
      goPay,
      finishPay,
    }
  },
}
</script>

<style lang="scss" scoped>
.light {
  color: #666;
  margin: 25px 0;
  font-size: 26px;
  text-align: center;
}
.tips {
  margin-top: 40px;
}
.order-pay {
  padding-bottom: 212px;
  .order_status {
    padding: 24px;
    margin: 24px;
    font-size: 28px;
    background: #fff;
    .val {
      font-size: 36px;
      font-weight: bold;
    }
  }
}

.order-pay .goods-box {
  @include flex-layout(column, center, flex-start);
  font-size: 32px;
  .good-cards {
    width: calc(100% - 48px);
    padding: 20px;
    margin: 0 24px;
    border-radius: 20px;
    background: #fff;
    box-sizing: border-box;
    @include flex-layout(row, flex-start, flex-start);
  }
  // .coupon-bar {
  //   margin: 24px;
  //   width: calc(100% - 48px);
  //   border-radius: 20px;
  // }
  .details-info {
    width: calc(100% - 48px);
    margin: 24px;
  }
  .submit-order {
    position: fixed;
    bottom: 0px;
    width: 100%;
    height: 112px;
    background: #fff;
    @include flex-layout(row, space-between, center);
    padding: 0 24px;
    box-sizing: border-box;
    font-weight: bold;
    .val {
      color: orangered;
    }

    .btn {
      font-size: 30px;
      font-weight: bold;
      padding: 15px 30px;
      width: 150px;
      text-align: center;
      border-radius: 30px;
      background: orangered;
      color: #fff;
    }
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
.bottom-line {
  margin-top: 100px;
}
</style>
