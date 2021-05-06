import axios from '../../services/axios'

const BASE_URL = '/api/v2/reports'

export default {
  namespaced: true,
  state: {
    chart: null,
    tableOperator: [],
    dataCard: null,
    operatorChart: null,
    followStudentByClassroom: null,
    isLoadedFollowStudentByClassroom: null
  },
  mutations: {
    SET_CHART: (state, payload) => {
      state.chart = payload
    },
    SET_TABLE_OPERATOR: (state, payload) => {
      state.tableOperator = payload
    },
    SET_DATA_CARD: (state, payload) => {
      state.dataCard = payload
    },
    SET_OPERATOR_CHART: (state, payload) => {
      state.operatorChart = payload
    },
    SET_LOADED_FOLLOW_STUDENT_CLASSROOM: (state, payload) => {
      state.isLoadedFollowStudentByClassroom = payload
    },
    SET_FOLLOW_STUDENT_CLASSROOM: (state, payload) => {
      state.followStudentByClassroom = payload
    }
  },
  getters: {
    chartData: state => {
      return state.chart
    },
    tableOperator: state => {
      return state.tableOperator
    },
    dataCard: state => state.dataCard,
    operatorChart: state => state.operatorChart,
    followStudentByClassroom: state => state.followStudentByClassroom,
    isLoadedFollowStudentByClassroom: state =>
      state.isLoadedFollowStudentByClassroom
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
          commit('SET_TABLE_OPERATOR', _data.table)
          commit('SET_OPERATOR_CHART', _data.chartData)
        } else {
          console.log(error)
        }

        return { success, message }
      } catch (error) {
        console.log(error)
      }
    },
    fetchSideCardReportData: async ({ commit }, payload) => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/courses/${payload.course}/data-card/${payload.date}`
        )

        const { _data, success, error, message } = data

        if (success) {
          commit('SET_DATA_CARD', _data)
        } else {
          console.log(error)
        }

        return { success, message }
      } catch (error) {
        console.log(error)
      }
    },
    getFollowStudentByClassroom: async ({ commit }, payload) => {
      try {
        commit('SET_LOADED_FOLLOW_STUDENT_CLASSROOM', false)
        const { data } = await axios.get(
          `api/v2/course-registered-users/${payload.course}/classrooms/${payload.classroom}/follow-student-classroom`
        )

        const { _data, success, error, message } = data

        if (success) {
          commit('SET_FOLLOW_STUDENT_CLASSROOM', _data)
          commit('SET_LOADED_FOLLOW_STUDENT_CLASSROOM', true)
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
