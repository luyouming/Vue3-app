<template>
  <div class="bottom-line">
    <van-image class="pic" src="//www.ly.com/favicon.ico" /> 同程福利汇
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'bottom-line',
  props: {
    // leftText: {
    //   default: '',
    //   type: String,
    //   required: false,
    // },
  },
  // emits: ['next'],
  // setup: (props, context) => {
  //   const doNext = () => {
  //     context.emit('next')
  //   }
  //   return { doNext }
  // },
})
</script>

<style lang="scss">
.bottom-line {
  @include flex-center();
  padding: 20px 0;
  color: #602596;
  font-weight: bold;
  text-align: center;
  .pic {
    margin-right: 10px;
  }
}
</style>
