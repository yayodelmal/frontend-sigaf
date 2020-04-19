import Vue from 'vue'
import Vuex from 'vuex'
import classroom from './modules/classroom'
import statusTicket from './modules/statusTicket'
import finalStatus from './modules/finalStatus'
import ticket from './modules/ticket'
import auth from './modules/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    classroom,
    statusTicket,
    finalStatus,
    ticket,
    auth
  }
})
