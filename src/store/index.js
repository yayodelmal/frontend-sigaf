import Vue from 'vue'
import Vuex from 'vuex'
import classroom from './modules/classroom'
import statusTicket from './modules/statusTicket'
import finalStatus from './modules/finalStatus'
import typeTicket from './modules/typeTicket'
import motiveTicket from './modules/motiveTicket'
import priorityTicket from './modules/priorityTicket'
import sourceTicket from './modules/sourceTicket'
import section from './modules/section'
import activity from './modules/activity'
import course from './modules/course'
import ticket from './modules/ticket'
import auth from './modules/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    classroom,
    statusTicket,
    finalStatus,
    typeTicket,
    motiveTicket,
    priorityTicket,
    sourceTicket,
    section,
    activity,
    course,
    ticket,
    auth
  }
})
