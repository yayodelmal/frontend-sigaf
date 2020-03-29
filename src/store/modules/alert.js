import axios from '../../services/axios'

const alert = {
  state: {
    alerts: []
  },
  mutations: {
    SET_ALERTS: (state, payload) => {
      state.alerts = payload
    },
    PUSH_ALERT: (state, payload) => {
      state.alerts.push(payload)
    }
  },
  getters: {
    alerts: state => {
      return state.alerts
    }
  },
  actions: {
    fetchAlerts: async ({ commit }) => {
      const response = await axios.get('alert')

      const json = response.data

      commit('SET_ALERTS', json.data)
    },
    postAlert: async ({ commit }) => {
      const params = {
        ticket_id: 1,
        user_id: '1',
        time: '18:00:00',
        date: '2020-03-28',
        status_reminder: 1,
        status_notification: 1,
        comment: 'mi commentario editado desde vue'
      }

      const response = await axios.post('alert', params)

      const alert = response.data

      if (alert.success) {
        commit('PUSH_ALERT', alert.data)
      } else {
        console.log(alert.error)
      }
    }
  }
}

export default alert
