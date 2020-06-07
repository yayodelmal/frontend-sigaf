import axios from '../../services/axios'

const BASE_URL = '/api/v2/users'

export default {
  namespaced: true,
  state: {
    users: []
  },
  mutations: {
    SET_USERS: (state, users) => {
      state.users = users
    }
  },
  getters: {
    users: state => {
      return state.users
    }
  },
  actions: {
    fetchUsers: async ({ commit }) => {
      try {
        const { data } = await axios.get(BASE_URL)

        console.log(data)
        const { _data, success, error, message } = data

        if (success) {
          commit('SET_USERS', _data.collections)
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
