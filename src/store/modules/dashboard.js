import axios from '../../services/axios'

export default {
  namespaced: true,
  state: {
    sourcePieChart: {},
    statusPieChart: {},
    priorityPieChart: {},
    statusTicketByOperatorChart: {},
    totalTicket: 0
  },
  mutations: {
    SET_SOURCE_PIE_CHART: (state, sourcePieChart) => {
      state.sourcePieChart = sourcePieChart
    },
    SET_TOTAL_TICKET: (state, payload) => {
      state.totalTicket = payload
    },
    SET_PRIORITY_PIE_CHART: (state, priorityPieChart) => {
      state.priorityPieChart = priorityPieChart
    },
    SET_STATUS_PIE_CHART: (state, statusPieChart) => {
      state.statusPieChart = statusPieChart
    },
    SET_STATUS_TICKET_BY_OPERATOR_CHART: (
      state,
      statusTicketByOperatorChart
    ) => {
      state.statusTicketByOperatorChart = statusTicketByOperatorChart
    }
  },
  getters: {
    totalTicket: state => state.totalTicket,
    sourcePieChart: state => {
      return state.sourcePieChart
    },
    priorityPieChart: state => {
      return state.priorityPieChart
    },
    statusPieChart: state => {
      return state.statusPieChart
    },
    statusTicketByOperatorChart: state => {
      return state.statusTicketByOperatorChart
    }
  },
  actions: {
    getTotalTicket: async ({ commit }, payload) => {
      try {
        const { data } = await axios.get(
          `api/v2/tickets/${payload}/total/count`
        )
        commit('SET_TOTAL_TICKET', data)
      } catch (error) {
        console.log(error)
      }
    },
    getSourcePieChart: async ({ commit }, payload) => {
      try {
        const { data } = await axios.get(
          `/api/v2/tickets/${payload}/source-chart`
        )

        const { _data, success, error, message } = data

        if (success) {
          commit('SET_SOURCE_PIE_CHART', _data.chartData)

          return { chartData: _data.chartData }
        } else {
          console.log(error)
        }

        return { success, message }
      } catch (error) {
        console.log(error)
      }
    },
    getStatusTicketByOperatorChart: async ({ commit }, payload) => {
      try {
        const { data } = await axios.get(
          `/api/v2/tickets/${payload}/status-operator-chart`
        )

        const { _data, success, error, message } = data

        if (success) {
          commit('SET_STATUS_TICKET_BY_OPERATOR_CHART', _data.chartData)

          return { chartData: _data.chartData }
        } else {
          console.log(error)
        }

        return { success, message }
      } catch (error) {
        console.log(error)
      }
    },
    getPriorityDoughnutChart: async ({ commit }, payload) => {
      try {
        const { data } = await axios.get(
          `/api/v2/tickets/${payload}/priority-chart`
        )

        const { _data, success, error, message } = data

        if (success) {
          commit('SET_PRIORITY_PIE_CHART', _data.chartData)

          return { chartData: _data.chartData }
        } else {
          console.log(error)
        }

        return { success, message }
      } catch (error) {
        console.log(error)
      }
    },
    getStatusPieChart: async ({ commit }, payload) => {
      try {
        const { data } = await axios.get(
          `/api/v2/tickets/${payload}/status-chart`
        )

        const { _data, success, error, message } = data

        if (success) {
          commit('SET_STATUS_PIE_CHART', _data.chartData)

          return { chartData: _data.chartData }
        } else {
          console.log(error)
        }

        return { success, message }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
