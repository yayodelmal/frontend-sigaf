import Vue from 'vue'
import Vuex from 'vuex'
import classroom from './modules/classroom'
import finalStatus from './modules/finalStatus'
import typeTicket from './modules/typeTicket'
import statusTicket from './modules/statusTicket'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    classroom,
    finalStatus,
    typeTicket,
    statusTicket
  }
})
