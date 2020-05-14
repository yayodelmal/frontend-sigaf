import axios from '../../services/axios'

export default {
  state: {
    priorityTickets: []
  },
  mutations: {},
  getters: {},
  actions: {
    fetchPriorityTickets: async ({ commit }) => {
      try {
        const { data } = await axios.get('priority-ticket')
        commit()
        return { success: data.success, error: data.error }
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
