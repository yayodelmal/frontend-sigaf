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
        const { data } = await axios.get('status-ticket')

        commit('SET_STATUS_TICKETS', data.statusTickets)
        return { success: data.success, error: data.error }
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
        const { data } = await axios.post('status-ticket', statusTicket)
        commit('POST_STATUS_TICKET', data.statusTicket)
        return { success: data.success, error: data.error }
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
          `status-ticket/${statusTicket.id}`,
          statusTicket
        )
        if (status === 200) {
          commit('PUT_STATUS_TICKET', data.statusTicket)
          return { success: data.success, error: data.error }
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
          `status-ticket/${statusTicket.id}`
        )

        if (status === 200) {
          commit('DELETE_STATUS_TICKET', statusTicket)
          return { success: data.success, error: data.error }
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
    }
  }
}
