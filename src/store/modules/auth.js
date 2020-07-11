import axios from '../../services/axios'

const BASE_URL = '/api/auth'

export default {
  namespaced: true,
  state: {
    loginUser: null,
    access_token: null
  },
  mutations: {
    SET_LOGIN_USER: (state, user) => {
      if (user !== null) {
        state.loginUser = Object.assign({}, user.properties)
      } else {
        state.loginUser = user
      }
    },
    SET_ACCESS_TOKEN: (state, access_token) => {
      state.access_token = access_token
    }
  },
  getters: {
    authenticated(state) {
      return state.loginUser && state.access_token
    },
    token(state) {
      return state.access_token
    },
    user(state) {
      return state.loginUser
    },
    isAdmin(state) {
      if (state.loginUser) {
        return state.loginUser.role.description === 'Administrador'
      } else {
        return false
      }

      // return localStorage.getItem('role') === 'Administrador'
    },
    isTutor(state) {
      if (state.loginUser) {
        return state.loginUser.role.description === 'Tutor'
      } else {
        return false
      }
      // return localStorage.getItem('role') === 'Tutor'
    },
    isOperator(state) {
      if (state.loginUser) {
        return state.loginUser.role.description === 'Operador'
      } else {
        return false
      }
      // return localStorage.getItem('role') === 'Operador'
    },
    typeRole(state) {
      if (state.loginUser) {
        return state.loginUser.role
      } else {
        return false
      }
      //  return localStorage.getItem('role')
    }
  },
  actions: {
    login: async (_, credentials) => {
      try {
        const { data } = await axios.post(`${BASE_URL}/login`, credentials)

        return { success: true, token: data.access_token }
      } catch (error) {
        return { success: false }
      }
    },
    attempt: async ({ commit, state }, token) => {
      if (token) {
        commit('SET_ACCESS_TOKEN', token)
      }

      if (!state.access_token) {
        return
      }

      try {
        const { data } = await axios.get(`${BASE_URL}/user`)

        commit('SET_LOGIN_USER', data.user)

        return { success: true }
      } catch (error) {
        console.log(error.response)

        commit('SET_ACCESS_TOKEN', null)
        commit('SET_LOGIN_USER', null)
      }
    },
    logout: async ({ commit }) => {
      try {
        console.log('exe')
        const { data } = await axios.get(`${BASE_URL}/logout`)

        commit('SET_LOGIN_USER', null)
        commit('SET_ACCESS_TOKEN', null)

        return { success: true, message: data.message }
      } catch (error) {
        console.log(error)
        return { success: false }
      }
    }
  }
}
