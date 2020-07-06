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
    },
    POST_REGISTERED_USER: (state, registeredUser) => {
      state.registeredUsers.push(registeredUser)
    },
    PUT_REGISTERED_USER: (state, registeredUser) => {
      const editedIndex = state.registeredUsers.findIndex(
        find => find.properties.id === registeredUser.properties.id
      )

      Object.assign(state.registeredUsers[editedIndex], registeredUser)
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
    },
    postRegisteredUser: async ({ commit }, registeredUser) => {
      try {
        const { data } = await axios.post(
          `${BASE_URL}/view-store`,
          registeredUser
        )

        const { _data, success, error, message } = data

        if (success) {
          commit('POST_REGISTERED_USER', _data)
        } else {
          console.log(error)
        }

        return { success, message, _data }
      } catch (error) {
        const { data } = error.response
        return {
          success: data.success,
          error: 'Error grave. Contacte al Administrador.'
        }
      }
    }
  }
}
