import Vue from 'vue'
import Vuex from 'vuex'
import alert from './modules/alert'
import classroom from './modules/classroom'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    alert,
    classroom
  }
})
