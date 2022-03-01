// https://blog.csdn.net/qq_41308489/article/details/121534153
import { computed } from "vue";
import { mapState, useStore } from "vuex";
export default function (state) {
  // 1. 获取实例 $store
  const store = useStore();
  // 2. 遍历状态数据
  const storeStateFns = mapState(state);
  // 3. 存放处理好的数据对象
  const storeState = {};
  // 4. 对每个函数进行computed
  Object.keys(storeStateFns).forEach((fnKey) => {
    const fn = storeStateFns[fnKey].bind({ $store: store });
    // 遍历生成这种数据结构 => {name: ref(), age: ref()}
    storeState[fnKey] = computed(fn);
  });
  return storeState;
}
// 使用 传入数组
// import useMapState from "./hooks/useMapState";
// export default {
//   setup() {
//     const state = useMapState(["name", "age", "counter"]);
//     return {
//       ...state,
//     };
//   },
// };
// 使用，传入对象
// import useMapState from "./hooks/useMapState";
// export default {
//   setup() {
//     const myState = useMapState({
//       myName: (state) => state.name,
//       myAge: (state) => state.age,
//     });
//     return {
//       ...myState,
//     };
//   },
// };
