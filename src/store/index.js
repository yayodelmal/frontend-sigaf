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
import category from './modules/category'
import registeredUser from './modules/registeredUser'
import auth from './modules/auth'
import role from './modules/role'
import profile from './modules/profile'
import user from './modules/user'
import statusDetailTicket from './modules/statusDetailTicket'
import detailTicket from './modules/detailTicket'
import courseRegisteredUser from './modules/courseRegisteredUser'

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
    category,
    auth,
    role,
    profile,
    registeredUser,
    user,
    detailTicket,
    statusDetailTicket,
    courseRegisteredUser
  }
})
