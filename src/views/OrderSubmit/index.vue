<template>
  <div class="order-submit">
    <div class="goods-box">
      <!-- 购物车商品列表--共{{ shoppingCartNum }}件商品 -->
      <div
        class="good-cards"
        v-for="(good, index) in goodsList"
        :key="good.id + index"
      >
        <good-card @changeNum="changeGoodNum" :goodsList="good"></good-card>
      </div>
      <!-- 优惠券单元格 -->
      <van-coupon-cell
        class="coupon-bar"
        :title="'领券'"
        :coupons="coupons"
        :chosen-coupon="chosenCoupon"
        @click="showCouponList = true"
      />
      <!-- 优惠券列表 -->
      <van-popup
        v-model:show="showCouponList"
        round
        position="bottom"
        style="height: 90%; padding-top: 4px"
      >
        <van-coupon-list
          :coupons="coupons"
          :chosen-coupon="chosenCoupon"
          :disabled-coupons="disabledCoupons"
          @change="onChange"
          @exchange="onExchange"
        />
      </van-popup>
      <!-- 去结算支付 -->
      <div class="submit-order">
        <div>
          应付: ￥<span>{{ totalPrice }}</span>
        </div>
        <div class="btn" @click="goSubmitOrder">
          <van-loading size="20px" color="#ffffff" v-if="paying" />
          <span v-else>提交订单</span>
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
  name: 'OrderSubmit',
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
    const router = useRouter()

    let chosenGoodIds = Object.values(route.query)
    console.log(chosenGoodIds)
    let totalPrice = 0
    // 带着query 信息去搜索勾选的商品
    // 测试数据两个商品 下面是mock的数据
    let { goodsList } = mockData

    goodsList = goodsList.filter((item) => chosenGoodIds.includes(item.id))

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
    // 立即下单
    const goSubmitOrder = () => {
      console.log(
        '提交订单:::' + baseData.totalPrice.value,
        baseData.goodsList.value
      )
      console.log('优惠券信息:::', coupons.value[chosenCoupon.value] || '无')
      baseData.paying.value = true
      setTimeout(() => {
        baseData.showPayQrcode.value = true
      }, 1000)
    }
    const changeGoodNum = (item) => {
      // console.log(item)
      // 修改了当前的数量，此时应该找到对应对象修改掉total，并且考虑是否勾选了优惠券
      baseData.totalPrice.value = 0 // 重置
      goodsList.forEach((good) => {
        if (good.id == item.id) {
          // good.num = item.newNum
          good.total = good.price * item.newNum
        }
        // 修改总价
        baseData.totalPrice.value += good.num * good.price
        if (chosenCoupon.value > -1) {
          baseData.totalPrice.value -=
            coupons.value[chosenCoupon.value].value / 100
        }
      })
    }
    // 去逛逛
    const goBuyGoods = () => {
      console.log('去逛逛')
      router.push({ path: '/' })
    }

    const onChange = (index) => {
      showCouponList.value = false
      if (index > -1 && chosenCoupon.value !== index) {
        console.log(coupons.value)
        if (chosenCoupon.value > -1) {
          // 原来就选了一张券，这等于改券，要加回来原来的券
          baseData.totalPrice.value +=
            coupons.value[chosenCoupon.value].value / 100
        }
        baseData.totalPrice.value -= coupons.value[index].value / 100
        chosenCoupon.value = index // 存起来
      } else {
        chosenCoupon.value = -1
        // 恢复原价
        baseData.totalPrice.value = 0
        goodsList.forEach((item) => {
          baseData.totalPrice.value += item.total
        })
      }
    }
    const onExchange = (code) => {
      coupons.value.push({ ...coupon, value: 2000, valueDesc: 20 }) // 模拟就是新增默认的券
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
      goBuyGoods,
      coupons,
      showCouponList,
      onChange,
      onExchange,
      chosenCoupon,
      disabledCoupons: [coupon],
      changeGoodNum,
      goSubmitOrder,
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
.order-submit {
  padding-bottom: 212px;
}
.order-submit .goods-box {
  @include flex-layout(column, center, flex-start);
  font-size: 32px;
  .good-cards {
    width: calc(100% - 48px);
    padding: 20px;
    margin: 24px 24px 0 24px;
    border-radius: 20px;
    background: #fff;
    box-sizing: border-box;
    @include flex-layout(row, flex-start, flex-start);
  }
  .coupon-bar {
    margin: 24px;
    width: calc(100% - 48px);
    border-radius: 20px;
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
