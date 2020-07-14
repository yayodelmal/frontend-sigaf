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
        .map(({ properties }) => {
          return {
            id: properties.id,
            rut: properties.rut,
            name: properties.name,
            phone: properties.phone,
            mobile: properties.mobile,
            email: properties.email,
            role: properties.role,
            password: properties.password,
            isFirstLogin: properties.isFirstLogin
          }
        })
        .filter(item => {
          return item.role.description !== 'Tutor'
        })
    },
    allUsers: state => {
      return state.users.map(({ properties }) => {
        return {
          id: properties.id,
          rut: properties.rut,
          name: properties.name,
          phone: properties.phone,
          mobile: properties.mobile,
          email: properties.email,
          role: properties.role,
          password: properties.password,
          isFirstLogin: properties.isFirstLogin
        }
      })
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
    },
    postUser: async () => {}
  }
}
