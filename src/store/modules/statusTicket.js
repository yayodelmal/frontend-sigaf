import axios from '../../services/axios'

export default {
  state: {
    statusTickets: []
  },
  mutations: {
    SET_STATUS_TICKETS: (state, statusTickets) => {
      state.statusTickets = statusTickets
    },
    POST_STATUS_TICKET: (state, statusTicket) => {
      state.statusTickets.push(statusTicket)
    },
    PUT_STATUS_TICKET: (state, statusTicket) => {
      const editedIndex = state.statusTickets.findIndex(
        find => find.id === statusTicket.id
      )

      Object.assign(state.statusTickets[editedIndex], statusTicket)
    },
    DELETE_STATUS_TICKET: (state, statusTicket) => {
      const editedIndex = state.statusTickets.findIndex(
        find => find.id === statusTicket.id
      )

      state.statusTickets.splice(editedIndex, 1)
    }
  },
  getters: {
    statusTicketsDatatable: state => {
      return state.statusTickets.map(statusTicket => {
        return {
          id: statusTicket.id,
          description: statusTicket.description
        }
      })
    }
  },
  actions: {
    fetchStatusTickets: async ({ commit }) => {
      try {
        const { data, status } = await axios.get('status-ticket')

        if (status === 200) {
          commit('SET_STATUS_TICKETS', data.statusTickets)
          return { success: true, error: null }
        }
      } catch (error) {
        return { success: false, error: error }
      }
    },
    postStatusTicket: async ({ commit }, statusTicket) => {
      try {
        const { data, status } = await axios.post('status-ticket', statusTicket)

        if (status === 201) {
          commit('POST_STATUS_TICKET', data.statusTicket)
          return { success: true, error: null }
        }
      } catch (error) {
        return { success: false, error: error }
      }
    },
    putStatusTicket: async ({ commit }, statusTicket) => {
      try {
        const { data, status } = await axios.put(
          `status-ticket/${statusTicket.id}`,
          statusTicket
        )
        if (status === 200) {
          commit('PUT_STATUS_TICKET', data.statusTicket)
          return { success: true, error: null }
        }
      } catch (error) {
        return { success: false, error: error }
      }
    },
    deleteStatusTicket: async ({ commit }, statusTicket) => {
      try {
        const { status } = await axios.delete(
          `status-ticket/${statusTicket.id}`
        )

        if (status === 200) {
          commit('DELETE_STATUS_TICKET', statusTicket)
          return { success: true, error: null }
        }
      } catch (error) {
        return { success: false, error: error }
      }
    }
  }
}
