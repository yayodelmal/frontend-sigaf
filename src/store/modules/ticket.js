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
    }
  },
  getters: {
    tickets: state => {
      return state.tickets
    },
    ticket: state => {
      return state.ticket
    },
    ticketDetailsByTicket: state => {
      return state.ticketDetails
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
    postTicket: async ({ commit }, ticket) => {
      try {
        const { data } = await axios.post(BASE_URL, ticket)

        console.log(ticket)

        const { _data, success, error, message } = data

        console.log()

        if (success) {
          commit('POST_TICKET', _data)
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
    }
  }
}
