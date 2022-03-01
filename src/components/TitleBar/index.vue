<template>
  <div class="title-bar-container">
    <slot name="left">
      <div class="left" v-if="leftText">{{ leftText }}</div>
    </slot>
    <slot name="right">
      <div class="right" v-if="rightText" @click="doNext()">
        {{ rightText }}<van-icon name="arrow" />
      </div>
    </slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'title-bar',
  props: {
    leftText: {
      default: '',
      type: String,
      required: false,
    },
    rightText: {
      default: '',
      type: String,
      required: false,
    },
  },
  emits: ['next'],
  setup: (props, context) => {
    // const count = ref(0)
    const doNext = () => {
      context.emit('next')
    }
    return { doNext }
  },
  data() {
    return {
      visible: false,
    }
  },
})
</script>

<style lang="scss">
.title-bar-container {
  @include flex-center();
  justify-content: space-between;
  height: 80px;
  .left {
    font-size: 32px;
    font-family: '微软雅黑';
    font-weight: bold;
  }
  .right {
    color: #999;
  }
}
</style>
