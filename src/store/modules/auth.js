import axios from '../../services/axios'

export default {
  namespaced: true,
  state: {
    loginUser: null,
    access_token: null
  },
  mutations: {
    SET_LOGIN_USER: (state, user) => {
      state.loginUser = Object.assign({}, user)
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
    }
  },
  actions: {
    login: async (_, credentials) => {
      try {
        const { data } = await axios.post('auth/login', credentials)

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
        const { data } = await axios.get('auth/user')

        commit('SET_LOGIN_USER', data.user)

        return { success: true }
      } catch (error) {
        console.log(error.response)

        commit('SET_ACCESS_TOKEN', null)
        commit('SET_LOGIN_USER', null)
      }
    }
  }
}
