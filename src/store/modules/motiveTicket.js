import axios from '../../services/axios'

export default {
  state: {
    motiveTickets: []
  },
  mutations: {
    SET_MOTIVE_TICKETS: (state, motiveTickets) => {
      state.motiveTickets = motiveTickets
    },
    POST_MOTIVE_TICKET: (state, motiveTicket) => {
      state.motiveTickets.push(motiveTicket)
    },
    PUT_MOTIVE_TICKET: (state, motiveTicket) => {
      const editedIndex = state.motiveTickets.findIndex(
        find => find.id === motiveTicket.id
      )
      Object.assign(state.motiveTickets[editedIndex], motiveTicket)
    },
    DELETE_MOTIVE_TICKET: (state, motiveTicket) => {
      const editedIndex = state.motiveTickets.findIndex(
        find => find.id === motiveTicket.id
      )
      state.motiveTickets.splice(editedIndex, 1)
    }
  },
  getters: {
    motiveTicketsDataBase: state => {
      return state.motiveTickets.map(motiveTicket => {
        return {
          id: motiveTicket.id,
          description: motiveTicket.description
        }
      })
    }
  },
  actions: {
    fetchMotiveTickets: async ({ commit }) => {
      try {
        const { data } = await axios.get('motive-ticket')
        commit('SET_MOTIVE_TICKETS', data.motiveTickets)
        return { success: data.success, error: data.error }
      } catch (error) {
        const { data } = error.response
        return {
          success: data.success,
          error: 'Error grave. Contacte al Administrador.'
        }
      }
    },
    postMotiveTicket: async ({ commit }, motiveTicket) => {
      try {
        const { data } = await axios.post('motive-ticket', motiveTicket)
        commit('POST_MOTIVE_TICKET', data.motiveTicket)
        return { success: data.success, error: data.error }
      } catch (error) {
        const { data } = error.response
        return {
          success: data.success,
          error: 'Error grave. Contacte al Administrador.'
        }
      }
    },
    putMotiveTicket: async ({ commit }, motiveTicket) => {
      try {
        const { data, status } = await axios.put(
          `motive-ticket/${motiveTicket.id}`,
          motiveTicket
        )
        if (status === 200) {
          commit('PUT_MOTIVE_TICKET', data.motiveTicket)
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
    deleteMotiveTicket: async ({ commit }, motiveTicket) => {
      try {
        const { status, data } = await axios.delete(
          `motive-ticket/${motiveTicket.id}`
        )

        if (status === 200) {
          commit('DELETE_MOTIVE_TICKET', motiveTicket)
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
