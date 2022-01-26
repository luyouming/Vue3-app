import { createStore } from "vuex";
export default createStore({
  state: {
    // listData: { name: 'famous' },
    // num: 10,
    role: "",
    LOADING: false,
  },
  mutations: {
    // SETDATA(state, value) {
    //   state.listData = value
    // },
    // ADDNUM(state, value) {
    //   state.num = state.num + value
    // },
    showLoading(state) {
      state.LOADING = true;
    },
    hideLoading(state) {
      state.LOADING = false;
    },

    SETROLE(state, value) {
      state.role = value;
    },
  },
  actions: {
    setRole(context, value) {
      context.commit("SETROLE", value);
    },
  },
  modules: {},
});
