import axios from '../../services/axios'

const BASE_URL = '/api/v2/status-detail-tickets'

export default {
  namespaced: true,
  state: {
    statusDetailTickets: []
  },
  mutations: {
    SET_STATUS_DETAIL_TICKET: (state, statusDetailTickets) => {
      state.statusDetailTickets = statusDetailTickets
    }
  },
  getters: {
    statusDetailTickets: state => {
      return state.statusDetailTickets.map(({ properties }) => {
        return {
          id: properties.id,
          description: properties.description
        }
      })
    }
  },
  actions: {
    fetchStatusDetailTickets: async ({ commit }) => {
      const response = await axios.get(BASE_URL)

      const { _data, success, error, message } = response.data

      if (success) {
        console.log(_data.collections)
        commit('SET_STATUS_DETAIL_TICKET', _data.collections)

        return { success, error, message }
      } else {
        console.log(error)
        return { success, error, message }
      }
    }
  }
}
