import Vue from 'vue'
import Vuex from 'vuex'
import classroom from './modules/classroom'
import statusTicket from './modules/statusTicket'
import auth from './modules/auth'
import motiveTicket from './modules/motiveTicket'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    classroom,
    statusTicket,
    auth,
    motiveTicket
  }
})
