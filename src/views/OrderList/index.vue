<template>
  <div class="order-list">
    {{ msg }}
  </div>
</template>

<script type="text/javascript">
export default {
  name: "OrderList",
  data() {
    return {
      msg: "订单列表页",
    };
  },
  // watch: {
  // },
  computed: {},
  created() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.order-list {
  position: fixed;
  width: 100%;
  height: 100%;
  @include flex-center();
  flex-direction: column;
}
</style>
