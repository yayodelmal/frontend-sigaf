import axios from '../../services/axios'

const BASE_URL = '/api/v2/reports'

export default {
  namespaced: true,
  state: {
    chart: null,
    tableOperator: []
  },
  mutations: {
    SET_CHART: (state, payload) => {
      state.chart = payload
    },
    SET_TABLE_OPERATOR: (state, payload) => {
      state.tableOperator = payload
    }
  },
  getters: {
    chartData: state => {
      return state.chart
    },
    tableOperator: state => {
      return state.tableOperator
    }
  },
  actions: {
    fetchChartByDate: async ({ commit }, payload) => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/courses/${payload.course}/type-ticket/${payload.date}`
        )

        const { _data, success, error, message } = data

        if (success) {
          commit('SET_CHART', _data)
        } else {
          console.log(error)
        }

        return { success, message }
      } catch (error) {
        console.log(error)
      }
    },
    fetchTableOperatorByDate: async ({ commit }, payload) => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/courses/${payload.course}/table-operator/${payload.date}`
        )

        const { _data, success, error, message } = data

        if (success) {
          commit('SET_TABLE_OPERATOR', _data)
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
