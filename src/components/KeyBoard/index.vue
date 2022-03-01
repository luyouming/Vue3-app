<template>
  <div
    v-show="visible"
    class="keyboard-container"
    :class="{ middleFix: middleFixed }"
  >
    <!-- <img
      class="arrow"
      src="https://file.40017.cn/trainwechat/miniapp/hsrtfront/Vector.png"
      alt=""
      @click="change('你好啊')"
    /> -->
    <p class="title">票务助手专属键盘</p>
    <van-button
      v-for="(item, index) in keyList"
      :key="index"
      class="keybtn"
      :class="{ deleteBtn: item === 'X' }"
      @click="change(item)"
    >
      {{ item }}
    </van-button>
    <i v-if="visible" class="closeIcon el-icon-arrow-down" @click="hide()"></i>

    <i v-else class="closeIcon el-icon-arrow-up"></i>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'
export default defineComponent({
  name: 'KeyBoard',
  props: {
    keyList: {
      default: () => [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        '.',
        'A',
        'B',
        'C',
        'D',
        'F',
        '加',
        '上铺',
        '中铺',
        '下铺',
        'X',
        // "清空",
      ],
      type: Array,
    },
    middleFixed: {
      default: false,
      type: Boolean,
    },
  },
  setup: (props, context) => {
    let visible = ref<boolean>(false)
    //初始化路由
    // const router = useRouter();

    const change = (item: any) => {
      let operateString =
        item === 'X' ? 'delete' : item === '清空' ? 'clear' : 'change'
      context.emit(operateString, item)
    }

    const show = () => {
      visible.value = true
    }
    const hide = () => {
      visible.value = false
      context.emit('close', 'X')
    }

    return { visible, change, show, hide }
  },
})
</script>

<style lang="scss" scoped>
.keyboard-container {
  width: 100%;
  min-height: 360px;
  background: #ffffff;
  background: #ffffff;
  box-shadow: 11px -3px 13px -2px rgba(187, 185, 185, 0.55);
  position: fixed;
  bottom: 0;
  z-index: 999;
  box-sizing: border-box;
  padding: 40px 30px 15px 30px;
  animation: bottomEaseInAnimate 0.5s ease 1; /*调用动画：动画名、时间、时间线条、播放次数*/
  animation-fill-mode: forwards; /*定义动画结束的状态*/
  .title {
    @include text-height(50px);
    font-size: 36px;
    color: #999999;
    margin-bottom: 40px;
  }
  .closeIcon {
    position: absolute;
    right: 66.84px;
    top: 56px;
    font-size: 45px;
    width: 18.4px;
    height: 35.16px;
    color: #999999;
  }
  .keybtn {
    // @include normal-button();
    width: 136px;
    min-height: 72px;
    height: 72px;
    line-height: 1px;
    margin: 0 16px 34px 17px;
    background: #eef1f8;
    box-shadow: 0px 1.93828px 3.87655px -1.29218px #a8aebb;
    border-radius: 12.9218px;
    font-size: 36px;
    color: #333333;
    float: left;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: normal;
    // &:nth-of-type(1) {
    //   margin-left: 20px;
    // }
  }
  .deleteBtn {
    // margin-left: 27px !important;
    width: 136px;
    min-height: 50px;
    height: 62px;
    margin-top: 5px;
    border: none;
    border-radius: 0;
    box-shadow: none;
    background: url('https://file.40017.cn/trainwechat/miniapp/hsrtfront/pz_deleteBtn.png')
      no-repeat center;
    background-size: cover;
    padding-right: 12px;
    // span {
    //   display: inline-block;
    //   height: 50px;
    //   width: 100%;
    //   margin-top: 11px;

    // }
  }
  @keyframes bottomEaseInAnimate {
    /*定义从下边滑入文字的动画*/
    0% {
      transform: translateY(360px);
      opacity: 1;
    }
    100% {
      transform: translateY(0px);
      opacity: 1;
    }
  }
}
.middleFix {
  position: fixed;
  bottom: 200px;
  z-index: 999;
}
</style>
