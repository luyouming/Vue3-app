const SET_ROLE = "SET_ROLE";
const SET_LOADING = "SET_LOADING";

export default {
  namespaced: true,

  state: {
    role: "",
    LOADING: false,
  },

  // getters: {
  //     getRole (state) {
  //         return state.role
  //     },
  //     getApiLoadingStatus (state) {
  //         return state.LOADING
  //     },
  // },

  mutations: {
    [SET_ROLE]: (state, role) => {
      state.role = role;
    },
    [SET_LOADING]: (state, status) => {
      state.LOADING = status;
    },
  },

  actions: {
    setRole(context, value) {
      context.commit(SET_ROLE, value);
    },
    setLoading(context, value) {
      context.commit(SET_LOADING, value);
    },
    // async setUsername ({dispatch, commit, getters}, data) {
    //     let username = getters.getUsername
    //     return new Promise((resolve, reject) => {
    //         setTimeout(()=>{
    //             commit('GET_USER_NAME', data)
    //             resolve(data)
    //         }, 2000)
    //     })
    // },
    // async setRandomImg ({dispatch, commit, getters}, data) {
    //     // let randomImg = getters.getRandomImg
    //     return new Promise((resolve, reject) => {
    //         axios.get('https://dog.ceo/api/breeds/image/random').then((res) => {
    //             let img = res.data.message
    //             commit('SET_LOADING', img)
    //             resolve(img)
    //         })
    //     })
    // },
  },
};
