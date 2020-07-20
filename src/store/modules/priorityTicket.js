import axios from '../../services/axios'

const BASE_URL = '/api/v2/priority-tickets'

export default {
  namespaced: true,
  state: {
    priorityTickets: [],
    tickets: []
  },
  mutations: {
    SET_PRIORITY_TICKETS: (state, priorityTickets) => {
      state.priorityTickets = priorityTickets
    },
    SET_TICKETS: (state, tickets) => {
      state.tickets = tickets
    },
    POST_PRIORITY_TICKET: (state, priorityTicket) => {
      state.priorityTickets.push(priorityTicket)
    },
    PUT_PRIORITY_TICKET: (state, priorityTicket) => {
      const editedIndex = state.priorityTickets.findIndex(
        find => find.properties.id === priorityTicket.properties.id
      )

      Object.assign(state.priorityTickets[editedIndex], priorityTicket)
    },
    DELETE_PRIORITY_TICKET: (state, priorityTicket) => {
      const editedIndex = state.priorityTickets.findIndex(
        find => find.properties.id === priorityTicket.id
      )
      state.priorityTickets.splice(editedIndex, 1)
    }
  },
  getters: {
    priorityTickets: state => {
      return state.priorityTickets.map(({ properties, relationships }) => {
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
    fetchPriorityTickets: async ({ commit }) => {
      try {
        const { data } = await axios.get(BASE_URL)

        const { _data, success, error, message } = data

        if (success) {
          commit('SET_PRIORITY_TICKETS', _data.collections)
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
    fetchTickets: ({ commit, state }, idPriorityTicket) => {
      try {
        state.priorityTickets.forEach(async ({ properties, relationships }) => {
          if (properties.id === idPriorityTicket) {
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
    postPriorityTicket: async ({ commit }, priorityTicket) => {
      try {
        const { data } = await axios.post(BASE_URL, priorityTicket)

        const { _data, success, error, message } = data

        if (success) {
          commit('POST_PRIORITY_TICKET', _data)
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
    putPriorityTicket: async ({ commit }, priorityTicket) => {
      try {
        const { data, status } = await axios.put(
          `${BASE_URL}/${priorityTicket.id}`,
          priorityTicket
        )

        if (status === 200) {
          const { _data, success, error, message } = data

          if (success) {
            commit('PUT_PRIORITY_TICKET', _data)
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
    deletePriorityTicket: async ({ commit }, priorityTicket) => {
      try {
        const { status, data } = await axios.delete(
          `${BASE_URL}/${priorityTicket.id}`
        )
        if (status === 200) {
          const { success, error, message } = data

          if (success) {
            commit('DELETE_PRIORITY_TICKET', priorityTicket)
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
