import axios from '../../services/axios'

const BASE_URL = '/api/v2/registered-users'

export default {
  namespaced: true,
  state: {
    registeredUsers: [],
    registeredUser: null
  },
  mutations: {
    SET_REGISTERED_USERS: (state, registeredUsers) => {
      state.registeredUsers = registeredUsers
    },
    SET_REGISTERED_USER: (state, registeredUser) => {
      state.registeredUser = registeredUser
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
    },
    regions: () => {
      return [
        {
          id: 'Región de Arica y Parinacota',
          description: 'Región de Arica y Parinacota'
        },
        {
          id: 'Región de Tarapacá',
          description: 'Región de Tarapacá'
        },
        {
          id: 'Región de Antofagasta',
          description: 'Región de Antofagasta'
        },
        {
          id: 'Región de Atacama',
          description: 'Región de Atacama'
        },
        {
          id: 'Región de Coquimbo',
          description: 'Región de Coquimbo'
        },
        {
          id: 'Región de Valparaíso',
          description: 'Región de Valparaíso'
        },
        {
          id: 'Región Metropolitana de Santiago',
          description: 'Región Metropolitana de Santiago'
        },
        {
          id: "Región del Libertador General Bernardo O'Higgins",
          description: "Región del Libertador General Bernardo O'Higgins"
        },
        {
          id: 'Región del Maule',
          description: 'Región del Maule'
        },
        {
          id: 'Región de Ñuble',
          description: 'Región de Ñuble'
        },
        {
          id: 'Región del Biobío',
          description: 'Región del Biobío'
        },
        {
          id: 'Región de La Araucanía',
          description: 'Región de La Araucanía'
        },
        {
          id: 'Región de Los Ríos',
          description: 'Región de Los Ríos'
        },
        {
          id: 'Región de Los Lagos',
          description: 'Región de Los Lagos'
        },
        {
          id: 'Región de Aisén del G. Carlos Ibáñez del Campo',
          description: 'Región de Aisén del G. Carlos Ibáñez del Campo'
        },
        {
          id: 'Región de Magallanes y de la Antártica  Chilena',
          description: 'Región de Magallanes y de la Antártica  Chilena'
        }
      ]
    }
  },
  actions: {
    findRegisteredUserByRut: async ({ commit }, payload) => {
      try {
        const { data } = await axios.get(`/api/v2/registered-user/${payload}`)

        const { _data, success, error } = data

        if (success) {
          commit('SET_REGISTERED_USER', _data)
        } else {
          console.log(error)
        }

        return data
      } catch (error) {
        const { data } = error.response
        console.log(error)
        return {
          success: data.success,
          message: data.message
        }
      }
    },
    fetchRegisteredUsers: async ({ commit }) => {
      try {
        const { data } = await axios.get(BASE_URL)

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
    putRegisteredUser: async (_, registeredUser) => {
      try {
        const { data } = await axios.put(
          `${BASE_URL}/${registeredUser.id}/view-update`,
          registeredUser
        )
        const { _data, success, message } = data
        return { success, message, _data }
      } catch (error) {
        console.log(error)
        return {
          success: false,
          error: 'Error grave. Contacte al Administrador.'
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
