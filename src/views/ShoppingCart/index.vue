<template>
  <div class="shopping-cart">
    <div class="null-box" v-if="shoppingCartNum < 1">
      <van-image
        class="cart"
        width="100"
        height="100"
        src="https://img.yzcdn.cn/vant/cat.jpeg"
      />
      <p>购物车还是空的</p>
      <p class="light">赶紧买点宝贝慰劳下自己吧</p>
      <van-button type="default" @click="goBuyGoods">去逛逛</van-button>
    </div>
    <div class="goods-box" v-else>
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

      <!-- 购物车商品列表--共{{ shoppingCartNum }}件商品 -->
      <div
        class="good-cards"
        v-for="(good, index) in goodsList"
        :key="good.id + index"
      >
        <van-icon
          class="check"
          :class="{ active: good.checked }"
          @click="toggleCheck(good)"
          name="checked"
        />
        <good-card @changeNum="changeGoodNum" :goodsList="good"></good-card>
      </div>
      <!-- 去结算支付 -->
      <div class="pay-order">
        <div>
          <van-icon
            class="check"
            :class="{ active: allChecked }"
            @click="toggleAllChecked"
            name="checked"
          />
          全选
        </div>
        <div
          class="btn"
          :class="{ active: checkGoodList.length > 0 }"
          @click="goDrawOrder"
        >
          结算
        </div>
      </div>
    </div>

    <div class="tips light">
      <van-icon color="#ee0a24" name="fire-o" />
      已同步至好物圈
    </div>
  </div>
</template>

<script lang="ts">
import { toRefs, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { mockData } from './mock/index'
import goodCard from '@components/GoodCard/index.vue'
import { Coupon } from '_vant@3.4.3@vant/lib'
// import { Toast } from 'vant'
export default {
  name: 'ShoppingCart',
  components: {
    goodCard,
  },
  setup: () => {
    // 需要底部导航
    const store = useStore()
    store.dispatch('global/toggleBottomNav', true)
    store.dispatch('global/setBottomNavActive', 2)
    onBeforeRouteLeave((to, from) => {
      store.dispatch('global/toggleBottomNav', false)
    })
    const route = useRoute()
    // 加入购物车应该是调接口，这里应该每次从购物车去查询接口，得到信息列表
    // let goodsList = Object.values(route.query)
    // 测试数据两个商品
    let { goodsList } = mockData
    goodsList.forEach((item) => {
      item.checked = false
      item.total = item.price * item.num
    })
    console.log(goodsList)
    // 测试优惠券
    const coupon = {
      available: 1,
      condition: '无门槛\n最多优惠12元',
      reason: '',
      value: 150,
      name: '优惠券名称',
      startAt: 1489104000,
      endAt: 1514592000,
      valueDesc: '1.5',
      unitDesc: '元',
    }
    const coupons = ref([coupon])
    const showCouponList = ref(false)
    const chosenCoupon = ref(-1)

    const baseData = toRefs(
      reactive({
        shoppingCartNum: goodsList.length,
        goodsList,
        allChecked: false,
        checkGoodList: [],
      })
    )

    const onChange = (index) => {
      showCouponList.value = false
      chosenCoupon.value = index
    }
    const onExchange = (code) => {
      coupons.value.push(coupon) // 模拟就是新增默认的券
    }
    // 立即购买
    const clearIt = () => {
      console.log('清空购物车')
    }
    const changeGoodNum = (item) => {
      // console.log(item)
      // 修改了当前的数量，此时应该找到对应对象修改掉total，并且考虑是否勾选了优惠券
      goodsList.forEach((good) => {
        if (good.id == item.id) {
          good.num = item.newNum
          good.total = good.price * item.newNum
        }
      })
    }
    // 去逛逛
    const router = useRouter()
    const goBuyGoods = () => {
      console.log('去逛逛')
      router.push({ path: '/' })
    }
    // 去下单页
    const goDrawOrder = () => {
      // console.log('去下单页')
      console.log('当前选中:::', baseData.checkGoodList.value)
      let chosenGoods = baseData.checkGoodList.value || {}
      if (Object.values(chosenGoods).length > 0) {
        router.push({
          path: '/order_submit',
          query: chosenGoods,
        })
      }
    }
    // 切换单选
    const toggleCheck = (good) => {
      good.checked = !good.checked
      if (!good.checked) {
        baseData.allChecked.value = false
        const chosenIndex = baseData.checkGoodList.value.findIndex(
          (item) => item.id == good.id
        )
        baseData.checkGoodList.value.splice(chosenIndex, 1)
      } else {
        if (baseData.checkGoodList.value.indexOf(good.id) < 0) {
          baseData.checkGoodList.value.push(good.id)
        }
      }
    }
    // 切换全选
    const toggleAllChecked = () => {
      baseData.allChecked.value = !baseData.allChecked.value
      baseData.checkGoodList.value = [] // 先清空
      // 此时应该要进行把列表的数据更新下
      goodsList.forEach((good) => {
        good.checked = baseData.allChecked.value
        //  如果是全选要加入，否则就清空
        if (baseData.allChecked.value) {
          baseData.checkGoodList.value.push(good.id)
        }
      })
    }
    return {
      ...baseData,
      clearIt,
      goBuyGoods,
      coupons,
      showCouponList,
      onChange,
      onExchange,
      chosenCoupon,
      disabledCoupons: [coupon],
      changeGoodNum,
      toggleCheck,
      toggleAllChecked,
      goDrawOrder,
    }
  },
}
</script>

<style lang="scss" scoped>
.shopping-cart .null-box {
  @include flex-layout(column, center, center);
  margin-top: 200px;
  font-size: 32px;
  .cart {
    margin-bottom: 60px;
  }
}
.light {
  color: #666;
  margin: 25px 0;
  font-size: 26px;
  text-align: center;
}
.tips {
  margin-top: 40px;
}
.shopping-cart .goods-box {
  @include flex-layout(column, center, flex-start);
  margin-top: 24px;
  font-size: 32px;
  .good-cards {
    width: calc(100% - 48px);
    padding: 20px;
    margin: 24px 24px 0 24px;
    border-radius: 20px;
    background: #fff;
    box-sizing: border-box;
    @include flex-layout(row, flex-start, flex-start);
    .check {
      margin-top: 50px;
      margin-right: 20px;
      color: grey;
      &.active {
        color: orangered;
      }
    }
  }
  .coupon-bar {
    margin: 0 24px;
    width: calc(100% - 48px);
    border-radius: 20px;
  }
  .pay-order {
    position: fixed;
    bottom: 108px;
    width: 100%;
    height: 112px;
    background: #fff;
    @include flex-layout(row, space-between, center);
    padding: 0 24px;
    box-sizing: border-box;
    .check {
      color: grey;
      &.active {
        color: orangered;
      }
    }
    .btn {
      font-size: 30px;
      font-weight: bold;
      padding: 10px 30px;
      width: 90px;
      text-align: center;
      border-radius: 30px;
      background: #eee;
      color: #888;
      &.active {
        background: orangered;
        color: #fff;
      }
    }
  }
}
</style>
