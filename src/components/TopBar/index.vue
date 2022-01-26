<template>
  <div class="top-bar-container" :class="{ fixed: !noFixed }">
    <img
      class="arrow"
      src="https://file.40017.cn/trainwechat/miniapp/hsrtfront/Vector.png"
      alt
      @click="goback"
    />
    <div class="cnt">
      <div
        class="tips"
        :class="{ backTips: singleBackHomeBtn }"
        @click="singleBackHomeBtn ? goback() : clickOnTipsInfo()"
        v-html="tipsInfo"
      ></div>
      <div class="btn_box">
        <div v-if="buttonText.length === 0">
          <slot name="btn_box"></slot>
        </div>
        <div v-else>
          <van-button
            class="btn"
            :class="{ btn_blue: item.type == 1, btn_grey: item.type == 2 }"
            v-for="(item, index) in buttonText"
            :key="item.name + index"
            @click="item.type !== 2 ? doNext(item) : ''"
            >{{ item.name }}</van-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from "vue";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "TopBar",
  props: {
    buttonText: {
      default: () => [], // type 不写最终样式为 0
      // [
      //   { name: '继续拍摄', type: 0 },
      //   { name: '提交出票信息', type: 1 }
      // ]
      type: Array,
      // required: true
    },
    tipsInfo: {
      default: ``,
      // `<div
      // >共识别<span class="orange">20条</span>出票信息，回填<span class="orange">成功18条</span
      // >出票信息，回填<span class="orange">失败2条</span>失败信息</div>`
      type: String,
      // required: true
    },
    singleBackHomeBtn: {
      default: false,
      type: Boolean,
    },
    noFixed: {
      default: false,
      type: Boolean,
    },
    customGoback: {
      //自定义返回按钮
      default: "",
    },
  },
  setup: (props, context) => {
    const count = ref(0);
    //初始化路由
    const router = useRouter();

    let goback;
    if (props.customGoback === "") {
      goback = () => {
        props.singleBackHomeBtn ? router.push("/") : router.go(-1);
      };
    } else {
      goback = props.customGoback || "";
    }
    let clickOnTipsInfo = () => {
      context.emit("tipsClick");
    };

    const doNext = (item: any) => {
      context.emit("next", item);
    };
    return { count, goback, clickOnTipsInfo, doNext };
  },
});
</script>

<style lang="scss">
.top-bar-container {
  width: 100%;
  height: 112px;
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  &.fixed {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 3;
  }
  .backIcon {
    position: absolute;
    left: 55px;
    top: 40px;
    font-size: 29px;
  }
  .cnt {
    display: flex;
    flex-grow: 1;
    align-items: center;
  }
  .tips {
    text-align: left;
    flex-grow: 1;
    padding-left: 6px;
    @include text-height(36px);
    font-size: 26px;
    color: #666666;
    .orange {
      color: #ff6767;
    }
    &.backTips {
      font-size: 36px;
      font-weight: bold;
      top: 36px;
      @include text-height(50px);
    }
  }
  .arrow {
    width: 46px;
    height: 40px;
    margin-left: 68px;
  }
  .btn_box {
    flex-shrink: 0;
    margin-right: 68px;
    .btn {
      @include normal-button();
      margin-left: 51px;
    }
    .btn_blue {
      background: #4a59db;
      color: #fff;
    }
    .btn_grey {
      background: #dadada;
      border: 1px solid #e2e2e2;
      color: #fff;
    }
  }
}
</style>
