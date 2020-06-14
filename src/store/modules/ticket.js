import axios from '../../services/axios'

const BASE_URL = '/api/v2/tickets'

export default {
  namespaced: true,
  state: {
    tickets: [],
    ticket: null,
    ticketDetails: []
  },
  mutations: {
    SET_TICKETS: (state, tickets) => {
      state.tickets = tickets
    },
    SET_TICKET: (state, ticket) => {
      state.ticket = ticket
    },
    SET_TICKET_DETAILS: (state, ticketDetails) => {
      state.ticketDetails = ticketDetails
    },
    POST_TICKET: (state, ticket) => {
      state.tickets.push(ticket)
    },
    PUT_TICKET: (state, ticket) => {
      const editedIndex = state.tickets.findIndex(
        find => find.properties.id === ticket.properties.id
      )
      Object.assign(state.tickets[editedIndex], ticket)
    },
    DELETE_TICKET: (state, ticket) => {
      console.log(ticket)
      const editedIndex = state.tickets.findIndex(find => {
        console.log(ticket.id)
        console.log(find.properties.id)
        return find.properties.id === ticket.id
      })

      console.log(editedIndex)
      state.tickets.splice(editedIndex, 1)
    }
  },
  getters: {
    tickets: state => {
      return state.tickets.map(ticket => {
        if (ticket.relationships.numberOfElements === 0) {
          return Object.assign(ticket, { showDeleteButton: true })
        } else {
          return Object.assign(ticket, { showDeleteButton: false })
        }
      })
    },
    ticket: state => {
      return state.ticket
    },
    ticketDetailsByTicket: state => {
      return state.ticketDetails.map(({ properties }) => {
        return properties
      })
    },
    getLastTicket: state => {
      return state.tickets[state.tickets.length - 1]
    }
  },
  actions: {
    fetchTicketDetails: async ({ commit }, ticket) => {
      const response = await axios.get(
        `${BASE_URL}/${ticket.id}/ticket-details`
      )

      console.log(response)
      const { _data, success, error, message } = response.data

      if (success) {
        console.log(_data.relationships.collection.data)
        commit('SET_TICKET_DETAILS', _data.relationships.collection.data)

        return { success, error, message }
      } else {
        console.log(error)
        return { success, error, message }
      }
    },
    findTicket: async ({ commit }, ticket) => {
      const response = await axios.get(`${BASE_URL}/${ticket.id}`)

      console.log(response)
      const { _data, success, error, message } = response.data

      if (success) {
        console.log(_data.collections)
        commit('SET_TICKET', _data.collections)

        return { success, error, message }
      } else {
        console.log(error)
        return { success, error, message }
      }
    },
    fetchTickets: async ({ commit }) => {
      const response = await axios.get(BASE_URL)

      const { _data, success, error, message } = response.data

      if (success) {
        console.log(_data.collections)
        commit('SET_TICKETS', _data.collections)

        return { success, error, message }
      } else {
        console.log(error)
        return { success, error, message }
      }
    },
    putTicket: async ({ commit }, ticket) => {
      try {
        const { data, status } = await axios.put(
          `${BASE_URL}/${ticket.id}`,
          ticket
        )
        if (status === 200) {
          const { _data, success, error, message } = data

          if (success) {
            commit('PUT_TICKET', _data)
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
    postTicket: async ({ commit }, ticket) => {
      try {
        const { data } = await axios.post(BASE_URL, ticket)

        console.log(ticket)

        const { _data, success, error, message } = data

        if (success) {
          commit('POST_TICKET', _data)
        } else {
          console.log(error)
        }

        console.log('_dataStore', _data)

        return { success, message, _data }
      } catch (error) {
        const { data } = error.response
        return {
          success: data.success,
          error: 'Error grave. Contacte al Administrador.'
        }
      }
    },
    deleteTicket: async ({ commit }, ticket) => {
      try {
        const { status, data } = await axios.delete(`${BASE_URL}/${ticket.id}`)

        if (status === 200) {
          const { success, error, message } = data

          if (success) {
            commit('DELETE_TICKET', ticket)
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
    },
    clearDetailTicket: ({ commit }) => {
      commit('SET_TICKET_DETAILS', [])
    }
  }
}
