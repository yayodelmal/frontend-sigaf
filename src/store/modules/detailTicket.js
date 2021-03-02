import axios from '../../services/axios'

const BASE_URL = '/api/v2/ticket-details'

export default {
  namespaced: true,
  state: {
    detailTickets: []
  },
  mutations: {
    SET_DETAIL_TICKETS: (state, detailTickets) => {
      state.detailTickets = detailTickets
    },
    POST_DETAIL_TICKET: (state, detailTicket) => {
      state.detailTicket = detailTicket
    }
  },
  getters: {
    detailTickets: state => {
      return state.detailTickets
    }
  },
  actions: {
    fetchDetailTickets: async ({ commit }) => {
      const response = await axios.get(BASE_URL)

      const { _data, success, error, message } = response.data

      if (success) {
        console.log(_data.collections)
        commit('SET_DETAIL_TICKETS', _data.collections)

        return { success, error, message }
      } else {
        console.log(error)
        return { success, error, message }
      }
    },

    postMassiveDetailTicket: async (_, detailTicket) => {
      try {
        const { data } = await axios.post(
          '/api/v2/ticket-details/multiple',
          detailTicket
        )

        const { _data, success, error } = data

        if (success) {
          return { _data, success }
        } else {
          console.log(error)
        }
      } catch (error) {
        const { data } = error.response
        return {
          success: data.success,
          error: 'Error grave. Contacte al Administrador.'
        }
      }
    },
    postDetailTicket: async ({ commit }, detailTicket) => {
      try {
        const { data } = await axios.post(BASE_URL, detailTicket)

        const { _data, success, error, message } = data

        if (success) {
          commit('POST_DETAIL_TICKET', _data)
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
