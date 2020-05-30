import axios from '../../services/axios'

const BASE_URL = '/api/v2/tickets'

export default {
  namespaced: true,
  state: {
    tickets: []
  },
  mutations: {
    SET_TICKETS: (state, tickets) => {
      state.tickets = tickets
    }
  },
  getters: {
    tickets: state => {
      return state.tickets
    }
  },
  actions: {
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
    }
  }
}
