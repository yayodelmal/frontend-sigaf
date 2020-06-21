import axios from '../../services/axios'

const BASE_URL = '/api/v2/registered-users'

export default {
  namespaced: true,
  state: {
    registeredUsers: []
  },
  mutations: {
    SET_REGISTERED_USERS: (state, registeredUsers) => {
      state.registeredUsers = registeredUsers
    }
  },
  getters: {
    registeredUsers: state => {
      return state.registeredUsers
    }
  },
  actions: {
    fetchRegisteredUsers: async ({ commit }) => {
      try {
        const { data } = await axios.get(BASE_URL)

        console.log(data)

        const { _data, success, error, message } = data

        if (success) {
          commit('SET_REGISTERED_USERS', _data.collections)
        } else {
          console.log(error)
        }

        return { success, message }
      } catch (error) {
        const { data } = error.response
        console.log(error)
        return {
          success: data.success,
          message: data.message
        }
      }
    }
  }
}
