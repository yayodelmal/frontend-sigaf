import axios from '../../services/axios'

const BASE_URL = '/api/v2/source-tickets'

export default {
  namespaced: true,
  state: {
    sourceTickets: [],
    tickets: []
  },
  mutations: {
    SET_SOURCE_TICKETS: (state, sourceTickets) => {
      state.sourceTickets = sourceTickets
    },
    SET_TICKETS: (state, tickets) => {
      state.tickets = tickets
    },
    POST_SOURCE_TICKET: (state, sourceTicket) => {
      state.sourceTickets.push(sourceTicket)
    },
    PUT_SOURCE_TICKET: (state, sourceTicket) => {
      const editedIndex = state.sourceTickets.findIndex(
        find => find.properties.id === sourceTicket.properties.id
      )

      Object.assign(state.sourceTickets[editedIndex], sourceTicket)
    },
    DELETE_SOURCE_TICKET: (state, sourceTicket) => {
      const editedIndex = state.sourceTickets.findIndex(
        find => find.properties.id === sourceTicket.id
      )
      state.sourceTickets.splice(editedIndex, 1)
    }
  },
  getters: {
    sourceTickets: state => {
      return state.sourceTickets.map(({ properties, relationships }) => {
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
    fetchSourceTickets: async ({ commit }) => {
      try {
        const { data } = await axios.get(BASE_URL)

        const { _data, success, error, message } = data

        if (success) {
          commit('SET_SOURCE_TICKETS', _data.collections)
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
    fetchTickets: ({ commit, state }, idSourceTicket) => {
      try {
        state.sourceTickets.forEach(async ({ properties, relationships }) => {
          if (properties.id === idSourceTicket) {
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
    postSourceTicket: async ({ commit }, sourceTicket) => {
      try {
        const { data } = await axios.post(BASE_URL, sourceTicket)

        const { _data, success, error, message } = data

        if (success) {
          commit('POST_SOURCE_TICKET', _data)
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
    putSourceTicket: async ({ commit }, sourceTicket) => {
      try {
        const { data, status } = await axios.put(
          `${BASE_URL}/${sourceTicket.id}`,
          sourceTicket
        )

        if (status === 200) {
          const { _data, success, error, message } = data

          if (success) {
            commit('PUT_SOURCE_TICKET', _data)
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
    deleteSourceTicket: async ({ commit }, sourceTicket) => {
      try {
        const { status, data } = await axios.delete(
          `${BASE_URL}/${sourceTicket.id}`
        )
        if (status === 200) {
          const { success, error, message } = data

          if (success) {
            commit('DELETE_SOURCE_TICKET', sourceTicket)
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
