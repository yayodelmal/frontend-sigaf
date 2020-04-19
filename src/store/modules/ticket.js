import axios from '../../services/axios'

export default {
  state: {
    tikets: []
  },
  mutations: {},
  getters: {},
  actions: {
    fetchTickets: async () => {
      const { data } = await axios.get('tickets')

      console.log(data)
    }
  }
}
