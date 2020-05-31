import axios from '../../services/axios'

const BASE_URL = '/api/v2/roles'

export default {
  namespaced: true,
  state: {
    roles: []
  },
  mutations: {
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    POST_ROLE: (state, role) => {
      state.roles.push(role)
    },
    PUT_ROLE: (state, role) => {
      const editedIndex = state.roles.findIndex(
        find => find.properties.id === role.properties.id
      )

      Object.assign(state.roles[editedIndex], role)
    },
    DELETE_ROLE: (state, role) => {
      const editedIndex = state.roles.findIndex(
        find => find.properties.id === role.id
      )
      state.roles.splice(editedIndex, 1)
    }
  },
  getters: {
    roles: state => {
      return state.roles.map(({ properties, relationships }) => {
        return {
          id: properties.id,
          description: properties.description,
          users: {
            numberOfElements: relationships.numberOfElements,
            href: relationships.links.href
          }
        }
      })
    }
  },
  actions: {
    fetchRoles: async ({ commit }) => {
      try {
        const { data } = await axios.get(BASE_URL)

        const { _data, success, error, message } = data

        if (success) {
          commit('SET_ROLES', _data.collections)
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
    postRole: async ({ commit }, role) => {
      try {
        const { data } = await axios.post(BASE_URL, role)

        console.log(role)

        const { _data, success, error, message } = data

        if (success) {
          commit('POST_ROLE', _data)
        } else {
          console.log(error)
        }

        return { success, message }
      } catch (error) {
        const { data } = error.response
        return {
          success: data.success,
          error: 'Error grave. Contacte al Administrador.'
        }
      }
    },
    putRole: async ({ commit }, role) => {
      try {
        const { data, status } = await axios.put(`${BASE_URL}/${role.id}`, role)

        if (status === 200) {
          const { _data, success, error, message } = data

          if (success) {
            commit('PUT_ROLE', _data)
          } else {
            console.log(error)
          }

          return { success, message }
        } else {
          return {
            success: data.success,
            error: 'No se ha podido realizar la operación'
          }
        }
      } catch (error) {
        const { data } = error.response
        return {
          success: data.success,
          error: 'Error grave. Contacte al Administrador.'
        }
      }
    },
    deleteRole: async ({ commit }, role) => {
      try {
        const { status, data } = await axios.delete(`${BASE_URL}/${role.id}`)
        if (status === 200) {
          const { success, error, message } = data

          if (success) {
            commit('DELETE_ROLE', role)
          } else {
            console.log(error)
          }

          return { success, message }
        } else {
          return {
            success: data.success,
            error: 'No se ha podido realizar la operación'
          }
        }
      } catch (error) {
        console.log(error)
        return {
          success: false,
          error: 'Error grave. Contacte al Administrador.'
        }
      }
    }
  }
}
