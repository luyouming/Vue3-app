<template>
  <div @click="visible = true">
    <slot name="pop_btn">
      <van-button type="primary">点我</van-button>
    </slot>
  </div>
  <!-- 传送到body下，这样fixed 蒙层不会受到父级元素的特殊样式设置影响，兼容性更强 -->
  <teleport to="body">
    <div
      v-if="visible"
      class="layer-mask-container"
      :class="{ top: popPlace == 'top', bottom: popPlace == 'bottom' }"
    >
      <div class="contentBox" :style="{ width: width }">
        <p class="title">{{ title }}</p>
        <slot></slot>
        <div class="btn_box">
          <van-button
            v-if="iscancelButton"
            class="btn"
            @click="
              () => {
                visible = false;
                $emit('cancel');
              }
            "
            >{{ cancelButtonText }}</van-button
          >
          <van-button
            v-if="isconfirmButton"
            class="btn btn_blue"
            @click="
              visible = false;
              $emit('confirm');
            "
            >{{ confirmButtonText }}</van-button
          >
        </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from "vue";
// import { useRouter } from 'vue-router'
export default defineComponent({
  name: "LayerMask",
  props: {
    buttonText: {
      default: () => [],
      // [
      //   { name: '继续拍摄', type: 0 },
      //   { name: '提交出票信息', type: 1 }
      // ]
      type: Array,
    },
    title: {
      default: "温馨提示",
      type: String,
      required: false,
    },
    iscancelButton: {
      default: true,
      type: Boolean,
    },
    cancelButtonText: {
      default: "取消",
      type: String,
    },
    isconfirmButton: {
      default: true,
      type: Boolean,
    },
    confirmButtonText: {
      default: "确认",
      type: String,
    },
    width: {
      default: "242px",
      type: String,
    },
    popPlace: {
      default: "center",
      type: String,
    },
  },
  emits: ["cancel", "confirm", "next"],
  setup: () => {
    // const count = ref(0)
    // const doNext = (item: any) => {
    //   context.emit('next', item)
    // }
    return {};
  },
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    confirm() {
      this.$emit("confirm");
    },
  },
});
</script>

<style lang="scss">
.layer-mask-container {
  width: 100%;
  height: 100%;
  @include flex-center();
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 999;
  .contentBox {
    min-width: 242px;
    background: #ffffff;
    border-radius: 32px;
    padding: 30px;
    box-sizing: border-box;
    font-size: 24px;
    text-align: center;
    .title {
      @include text-height(56px);
      font-size: 40px;
      font-weight: bold;
      color: #333333;
      margin-bottom: 30px;
    }

    .btn_box {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 30px;
      .btn {
        @include normal-button();
        margin: 0 10px;
        min-width: 200px;
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
      .singleBtn {
        margin: 0px;
      }
    }
  }
}
.layer-mask-container.top {
  align-items: flex-start;
}
.layer-mask-container.bottom {
  align-items: flex-end;
}
</style>
