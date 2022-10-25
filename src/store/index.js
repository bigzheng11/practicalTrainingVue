import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        //true为启用夜间模式
        isNight: false,
    },
    getters: {},
    mutations: {
      changeNightMutations(state, param) {
        state.isNight=param
      }
    },
    actions: {
      changeNightActions(state, param) {
            state.commit("changeNightMutations", param);
        },
    },
    modules: {},
});
