<template>
  <div class="good-card-container">
    <div class="pic-box">
      <van-image class="pic" :src="goodsList.imgUrl"></van-image>
    </div>
    <div class="content" :class="{ content_readonly: readOnly }">
      <p class="desc" :class="{ desc_readonly: readOnly }">
        {{ goodsList.desc }}
      </p>
      <span class="tags" v-if="!readOnly">{{ goodsList.goodsType }}</span>
      <p class="seven-days" v-if="!readOnly">
        {{ goodsList.sevenDays ? '' : '不支持' }}7天无理由退货
      </p>
      <div class="price">
        ￥<span class="num">{{ goodsList.price }}</span>
      </div>
      <p
        class="single-price"
        v-if="!readOnly && goodsList.total && goodsList.num > 0"
      >
        每件预计到手￥{{ (goodsList.total / goodsList.num).toFixed(2) }}
      </p>
      <van-stepper
        v-if="!readOnly"
        class="step"
        input-width="22px"
        button-size="22px"
        v-model="goodsList.num"
        @change="changeGoodNum"
      />
      <div class="step readonly" v-else>X{{ goodsList.num }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'good-card',
  props: {
    goodsList: {
      default: {
        id: '121',
        imgUrl: 'https://img01.yzcdn.cn/vant/cat.jpeg',
        desc: '测试数据',
        goodsType: 'wink调皮虎',
        sevenDays: true,
        price: 5,
        total: 32,
        num: 5,
      },
      type: Object,
      required: true,
    },
    readOnly: {
      default: false,
      type: Boolean,
      required: false,
    },
  },
  emits: ['changeNum'],
  setup: (props, context) => {
    // const count = ref(0)
    const changeGoodNum = (item) => {
      context.emit('changeNum', { id: props.goodsList.id, newNum: item })
    }
    return { changeGoodNum }
  },
})
</script>

<style lang="scss">
.good-card-container {
  width: 100%;
  position: relative;
  .pic-box {
    float: left;
    @include square(180px);
    @include flex-center();
    border-radius: 20px;
    overflow: hidden;
    .pic {
      width: 100%;
      height: 100%;
    }
  }
  .content {
    float: left;
    width: calc(100% - 200px);
    margin-left: 20px;
    &.content_readonly {
      height: 180px;
    }
    .desc {
      @include ellipsis-more(2);
      font-size: 28px;
      &.desc_readonly {
        height: 85px;
        margin-bottom: 30px;
      }
    }
    .tags {
      color: #888;
      padding: 5px 8px;
      font-size: 22px;
      background: whitesmoke;
      border-radius: 8px;
    }
    .seven-days {
      color: orange;
      font-size: 24px;
      margin-top: 20px;
    }
    .price {
      margin-top: 10px;
      .num {
        font-size: 50px;
        margin-left: -5px;
      }
      color: orangered;
    }
    .single-price {
      font-size: 24px;
      color: #666;
    }
    .step {
      position: absolute;
      right: 0;
      bottom: 0;
      &.readonly {
        font-size: 26px;
      }
    }
  }
}
</style>
