<template>
  <div class="list-box" v-for="(item, index) in list" :key="item.id + index">
    <div class="header">
      <div class="left">
        <span class="set-top">置顶</span>
        <span class="time">{{ item.createTime }}</span>
        <span class="read">{{ item.readPeople }}阅读</span>
      </div>
      <div class="right" @click="toggleMyLove(item)">
        <van-icon class="icon" v-if="item.myLove" name="like" color="red" />
        <van-icon class="icon" v-else name="like-o" color="#ccc" />
        {{ item.loved }}
      </div>
    </div>
    <div class="main_title">{{ item.title }}</div>
    <div class="desc"><span class="flag">#单品介绍#</span> {{ item.desc }}</div>
    <div class="img-box">
      <van-image
        class="pic"
        :class="{ onePic: item.imgListArr.length == 1 }"
        v-for="(pic, index) in item.imgListArr"
        :key="pic + index"
        :src="pic"
      />
    </div>
    <div class="link-box" @click="goGoodDetails(item.linkGoodInfo)">
      <div class="left">
        <van-image class="pic" :src="item.linkGoodInfo.imgUrl"></van-image>
        <div class="text">
          <p class="title">{{ item.linkGoodInfo.desc }}</p>
          <p class="price">￥{{ item.linkGoodInfo.price }}</p>
        </div>
      </div>
      <van-icon class="icon" name="arrow" size="20" color="#222" />
    </div>
  </div>
  <bottom-line class="bottom-line"></bottom-line>
</template>

<script lang="ts">
import { toRefs, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import bottomLine from '@components/BottomLine/index.vue'
// import { Toast } from 'vant'
export default {
  name: 'GiveLove',
  components: {
    bottomLine,
  },
  setup: () => {
    const route = useRoute()
    console.log(route.query)
    const baseData = toRefs(
      reactive({
        list: [
          {
            id: '121',
            setedTop: true,
            createTime: '2019年12月29日',
            readPeople: 36,
            loved: 2,
            myLove: false,
            title:
              '虎年行大运,虎年行大运虎年行大运虎年行大运虎年行大运虎年行大运虎年行大运虎年行大运',
            desc: '[小茶日记鸿运当头] 小罐茶礼盒[小茶日记鸿运当头] 小罐茶礼盒[小茶日记鸿运当头] 小罐茶礼盒[小茶日记鸿运当头] 小罐茶礼盒[小茶日记鸿运当头] 小罐茶礼盒',
            imgListArr: ['https://img01.yzcdn.cn/vant/cat.jpeg'],
            linkGoodInfo: {
              id: '121',
              desc: '小罐茶礼盒小罐茶礼盒小罐茶礼盒小罐茶礼盒小罐茶礼盒小罐茶礼盒小罐茶礼盒小罐茶礼盒小小罐茶礼盒小罐茶礼盒小罐茶礼盒罐茶礼盒小罐茶礼盒',
              imgUrl: 'https://img01.yzcdn.cn/vant/cat.jpeg',
              price: '59.00',
            },
          },
          {
            id: '122',
            setedTop: false,
            myLove: false,
            createTime: '2019年12月29日',
            readPeople: 36,
            loved: 2,
            title: '虎年行大运',
            desc: '[小茶日记鸿运当头] 小罐茶礼盒',
            imgListArr: [
              'https://img01.yzcdn.cn/vant/cat.jpeg',
              'https://img01.yzcdn.cn/vant/cat.jpeg',
              'https://img01.yzcdn.cn/vant/cat.jpeg',
            ],
            linkGoodInfo: {
              id: '122',
              desc: '小罐茶礼盒',
              imgUrl: 'https://img01.yzcdn.cn/vant/cat.jpeg',
              price: '99.00',
            },
          },
        ],
      })
    )

    // 去购物车页
    const router = useRouter()
    const goGoodDetails = (item) => {
      console.log(item)
      router.push({ path: '/good_details', query: item })
    }
    // 切换喜爱一个商品
    const toggleMyLove = (item) => {
      baseData.list.value.forEach((data) => {
        if (data.id == item.id) {
          data.myLove = !data.myLove
          data.loved += 1 * (data.myLove ? 1 : -1)
        }
      })
    }
    return {
      ...baseData,
      goGoodDetails,
      toggleMyLove,
    }
  },
}
</script>

<style lang="scss" scoped>
.list-box {
  margin: 24px;
  background: #fff;
  border-radius: 10px;
  padding: 24px;
  .header {
    @include flex-layout(row, space-between, center);
    color: #666;
    .set-top {
      background: orangered;
      font-size: 24px;
      color: #fff;
      padding: 2px 10px;
      border-top-left-radius: 35%;
      border-bottom-right-radius: 35%;
    }
    .time {
      margin: 0 30px 0 20px;
    }
    .right {
      @include flex-center();
      .icon {
        font-size: 30px;
        margin-right: 5px;
      }
    }
  }
  .main_title {
    max-height: 100px;
    @include ellipsis-more(2);
    font-size: 34px;
    font-weight: bold;
    margin: 20px 0;
  }
  .desc {
    max-height: 80px;
    @include ellipsis-more(2);
    font-size: 30px;
    .flag {
      color: orangered;
      font-size: 26px;
    }
  }
  .img-box {
    margin-top: 30px;
    @include flex-layout(row, center， flex-start);
    flex-wrap: nowrap;
    .pic {
      margin-right: 20px;
      border-radius: 6px;
      overflow: hidden;
      &.onePic {
        margin-right: 0px;
      }
    }
  }
  .link-box {
    padding: 15px 20px;
    border-radius: 10px;
    height: 120px;
    margin-top: 20px;
    background: #efefee;
    @include flex-layout(row, space-between, center);
    .left {
      @include flex-layout(row, flex-start, center);
      .pic {
        @include square(120px);
        margin-right: 20px;
      }
      .text {
        width: calc(100% - 120px);
        .title {
          height: 80px;
          margin-bottom: 10px;
          @include ellipsis-more(2);
          font-size: 26px;
          font-weight: normal;
        }
      }
    }
  }
}
.bottom-line {
  margin: 100px 0;
}
</style>
