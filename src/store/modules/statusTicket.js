import axios from '../../services/axios'

const BASE_URL = '/api/v2/status-tickets'

export default {
  namespaced: true,
  state: {
    statusTickets: [],
    tickets: []
  },
  mutations: {
    SET_STATUS_TICKETS: (state, statusTickets) => {
      state.statusTickets = statusTickets
    },
    SET_TICKETS: (state, tickets) => {
      state.tickets = tickets
    },
    POST_STATUS_TICKET: (state, statusTicket) => {
      state.statusTickets.push(statusTicket)
    },
    PUT_STATUS_TICKET: (state, statusTicket) => {
      const editedIndex = state.statusTickets.findIndex(
        find => find.properties.id === statusTicket.properties.id
      )

      Object.assign(state.statusTickets[editedIndex], statusTicket)
    },
    DELETE_STATUS_TICKET: (state, statusTicket) => {
      const editedIndex = state.statusTickets.findIndex(
        find => find.properties.id === statusTicket.id
      )
      state.statusTickets.splice(editedIndex, 1)
    }
  },
  getters: {
    statusTickets: state => {
      return state.statusTickets.map(({ properties, relationships }) => {
        return {
          id: properties.id,
          description: properties.description,
          tickets: {
            numberOfElements: relationships.numberOfElements,
            href: relationships.links.href
          }
        }
      })
    },
    statusTicketByOperator: state => {
      return state.statusTickets.map(status => {
        const array = status.relationships.data.reduce(function(
          accumulator,
          object
        ) {
          let key = object.name
          if (!accumulator[key]) {
            accumulator[key] = []
          }
          accumulator[key].push(object)
          return accumulator
        },
        {})

        return { status: status.properties, array }
      })
    }
  },
  actions: {
    fetchStatusTickets: async ({ commit }) => {
      try {
        const { data } = await axios.get(BASE_URL)

        const { _data, success, error, message } = data

        if (success) {
          commit('SET_STATUS_TICKETS', _data.collections)
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
    fetchTickets: ({ commit, state }, idStatusTicket) => {
      try {
        state.statusTickets.forEach(async ({ properties, relationships }) => {
          if (properties.id === idStatusTicket) {
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
    postStatusTicket: async ({ commit }, statusTicket) => {
      try {
        const { data } = await axios.post(BASE_URL, statusTicket)

        const { _data, success, error, message } = data

        if (success) {
          commit('POST_STATUS_TICKET', _data)
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
    putStatusTicket: async ({ commit }, statusTicket) => {
      try {
        const { data, status } = await axios.put(
          `${BASE_URL}/${statusTicket.id}`,
          statusTicket
        )

        if (status === 200) {
          const { _data, success, error, message } = data

          if (success) {
            commit('PUT_STATUS_TICKET', _data)
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
    deleteStatusTicket: async ({ commit }, statusTicket) => {
      try {
        const { status, data } = await axios.delete(
          `${BASE_URL}/${statusTicket.id}`
        )

        if (status === 200) {
          const { success, error, message } = data

          if (success) {
            commit('DELETE_STATUS_TICKET', statusTicket)
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
