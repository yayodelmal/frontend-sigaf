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
    authenticated: state => state.loginUser && state.access_token,
    token: state => state.access_token,
    user: state => state.loginUser,
    isAdmin: state =>
      state.loginUser
        ? state.loginUser.role.description === 'Administrador'
        : false,
    isTutor(state) {
      if (state.loginUser) {
        return state.loginUser.role.description === 'Tutor'
      } else {
        return false
      }
    },
    isFirstLogin: state => state.loginUser.isFirstLogin === 0,
    isOperator(state) {
      if (state.loginUser) {
        return state.loginUser.role.description === 'Operador'
      } else {
        return false
      }
    },
    isDeveloper(state) {
      if (state.loginUser) {
        return state.loginUser.role.description === 'Developer'
      } else {
        return false
      }
    },
    typeRole(state) {
      if (state.loginUser) {
        return state.loginUser.role
      } else {
        return false
      }
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
        const { data } = await axios.get(`${BASE_URL}/logout`)

        commit('SET_LOGIN_USER', null)
        commit('SET_ACCESS_TOKEN', null)

        return { success: true, message: data.message }
      } catch (error) {
        console.log(error)
        return { success: false }
      }
    },
    partialLogout: ({ commit }) => {
      try {
        commit('SET_LOGIN_USER', null)
        commit('SET_ACCESS_TOKEN', null)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
