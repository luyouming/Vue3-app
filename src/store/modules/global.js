// const SET_ROLE = "SET_ROLE";
// const SET_LOADING = "SET_LOADING";

export default {
  namespaced: true,
  state: {
    // listData: { name: 'famous' },
    // num: 10,
    role: "",
    LOADING: false,
    showBottomNav: false,
    bottomNavActive: 0,
  },
  mutations: {
    TOGGLEAPILOADING(state, flag) {
      state.LOADING = flag;
    },
    TOGGLEBOTTOMNAV(state, flag) {
      state.showBottomNav = flag;
    },
    SETBOTTOMNAVACTIVE(state, index) {
      state.bottomNavActive = index;
    },
    SETROLE(state, value) {
      state.role = value;
    },
  },
  actions: {
    setRole(context, value) {
      context.commit("SETROLE", value);
    },
    toggleApiLoading(context, value) {
      context.commit("TOGGLEAPILOADING", value);
    },
    toggleBottomNav(context, value) {
      context.commit("TOGGLEBOTTOMNAV", value);
    },
    setBottomNavActive(context, value) {
      context.commit("SETBOTTOMNAVACTIVE", value);
    },
  },
};
