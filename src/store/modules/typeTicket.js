import axios from '../../services/axios'

const BASE_URL = '/api/v2/type-tickets'

export default {
  namespaced: true,
  state: {
    typeTickets: [],
    tickets: []
  },
  mutations: {
    SET_TYPE_TICKETS: (state, typeTickets) => {
      state.typeTickets = typeTickets
    },
    SET_TICKETS: (state, tickets) => {
      state.tickets = tickets
    },
    POST_TYPE_TICKET: (state, typeTicket) => {
      state.typeTickets.push(typeTicket)
    },
    PUT_TYPE_TICKET: (state, typeTicket) => {
      const editedIndex = state.typeTickets.findIndex(
        find => find.properties.id === typeTicket.properties.id
      )

      Object.assign(state.typeTickets[editedIndex], typeTicket)
    },
    DELETE_TYPE_TICKET: (state, typeTicket) => {
      const editedIndex = state.typeTickets.findIndex(
        find => find.properties.id === typeTicket.id
      )
      state.typeTickets.splice(editedIndex, 1)
    }
  },
  getters: {
    typeTickets: state => {
      return state.typeTickets.map(({ properties, relationships }) => {
        return {
          id: properties.id,
          description: properties.description,
          tickets: {
            numberOfElements: relationships.numberOfElements,
            href: relationships.links.href
          }
        }
      })
    }
  },
  actions: {
    fetchTypeTickets: async ({ commit }) => {
      try {
        const { data } = await axios.get(BASE_URL)

        const { _data, success, error, message } = data

        if (success) {
          commit('SET_TYPE_TICKETS', _data.collections)
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
    fetchTickets: ({ commit, state }, idTypeTicket) => {
      try {
        state.typeTickets.forEach(async ({ properties, relationships }) => {
          if (properties.id === idTypeTicket) {
            const { data } = await axios.get(relationships.links.href)

            const { _data, success, error } = data

            commit('SET_TICKETS', _data.relationships.collection.data)

            return { success, error }
          }
        })
      } catch (error) {
        const { data } = error.response
        return {
          success: data.success,
          error: 'Error grave. Contacte al Administrador.'
        }
      }
    },
    postTypeTicket: async ({ commit }, typeTicket) => {
      try {
        const { data } = await axios.post(BASE_URL, typeTicket)

        const { _data, success, error, message } = data

        if (success) {
          commit('POST_TYPE_TICKET', _data)
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
    putTypeTicket: async ({ commit }, typeTicket) => {
      try {
        const { data, status } = await axios.put(
          `${BASE_URL}/${typeTicket.id}`,
          typeTicket
        )

        if (status === 200) {
          const { _data, success, error, message } = data

          if (success) {
            commit('PUT_TYPE_TICKET', _data)
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
    deleteTypeTicket: async ({ commit }, typeTicket) => {
      try {
        const { status, data } = await axios.delete(
          `${BASE_URL}/${typeTicket.id}`
        )
        if (status === 200) {
          const { success, error, message } = data

          if (success) {
            commit('DELETE_TYPE_TICKET', typeTicket)
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
