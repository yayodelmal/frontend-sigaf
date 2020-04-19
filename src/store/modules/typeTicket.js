import axios from '../../services/axios'

export default {
  state: {
    typeTickets: []
  },
  mutations: {
    SET_TYPE_TICKETS: (state, typeTickets) => {
      state.typeTickets = typeTickets
    },
    POST_TYPE_TICKET: (state, typeTicket) => {
      state.typeTickets.push(typeTicket)
    },
    PUT_TYPE_TICKET: (state, typeTicket) => {
      const editedIndex = state.typeTickets.findIndex(
        find => find.id === typeTicket.id
      )
      Object.assign(state.typeTickets[editedIndex], typeTicket)
    },
    DELETE_TYPE_TICKET: (state, typeTicket) => {
      const editedIndex = state.typeTickets.findIndex(
        find => find.id === typeTicket.id
      )
      state.typeTickets.splice(editedIndex, 1)
    }
  },
  getters: {
    typeTicketsDataTable: state => {
      return state.typeTickets.map(typeTicket => {
        return {
          id: typeTicket.id,
          description: typeTicket.description
        }
      })
    }
  },
  actions: {
    fetchTypeTickets: async ({ commit }) => {
      try {
        const { data } = await axios.get('in-out-ticket')

        commit('SET_TYPE_TICKETS', data.inOutTickets)
        return { success: data.success, error: data.error }
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
        const { data } = await axios.post('in-out-ticket', typeTicket)
        commit('POST_TYPE_TICKET', data.inOutTicket)
        return { success: data.success, error: data.error }
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
          `in-out-ticket/${typeTicket.id}`,
          typeTicket
        )

        if (status === 200) {
          commit('PUT_TYPE_TICKET', data.inOutTicket)
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
    deleteTypeTicket: async ({ commit }, typeTicket) => {
      try {
        const { status, data } = await axios.delete(
          `in-out-ticket/${typeTicket.id}`
        )

        if (status === 200) {
          commit('DELETE_TYPE_TICKET', typeTicket)
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
