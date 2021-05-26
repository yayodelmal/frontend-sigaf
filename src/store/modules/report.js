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
    isLoadedFollowStudentByClassroom: null,
    isLoadedStatusUserClassroomChart: false,
    statusUserClassroomChart: null,
    isLoadedProgressUserClassroomBySection: false,
    progressUserClassroomBySection: null,
    isLoadedProgressUserClassroomByActivity: false,
    progressUserClassroomByActivity: null,
    isLoadedProgressUserClassroomByActivityAvance: false,
    progressUserClassroomByActivityAvance: null
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
    },
    SET_LOADED_STATUS_USER_CLASSROOM_CHART: (state, payload) => {
      state.isLoadedStatusUserClassroomChart = payload
    },
    SET_STATUS_USER_CLASSROOM_CHART: (state, payload) => {
      state.statusUserClassroomChart = payload
    },
    SET_LOADED_PROGRESS_USER_CLASSROOM_SECTION: (state, payload) => {
      state.isLoadedProgressUserClassroomBySection = payload
    },
    SET_PROGRESS_USER_CLASSROOM_SECTION: (state, payload) => {
      state.progressUserClassroomBySection = payload
    },
    SET_LOADED_PROGRESS_USER_CLASSROOM_ACTIVITY_EVALUATION: (
      state,
      payload
    ) => {
      state.isLoadedProgressUserClassroomByActivity = payload
    },
    SET_PROGRESS_USER_CLASSROOM_ACTIVITY_EVALUATION: (state, payload) => {
      state.progressUserClassroomByActivity = payload
    },
    SET_LOADED_PROGRESS_USER_CLASSROOM_ACTIVITY_AVANCE: (state, payload) => {
      state.isLoadedProgressUserClassroomByActivityAvance = payload
    },
    SET_PROGRESS_USER_CLASSROOM_ACTIVITY_AVANCE: (state, payload) => {
      state.progressUserClassroomByActivityAvance = payload
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
    isLoadedStatusUserClassroomChart: state =>
      state.isLoadedStatusUserClassroomChart,
    statusUserClassroomChart: state => state.statusUserClassroomChart,
    isLoadedProgressUserClassroomBySection: state =>
      state.isLoadedProgressUserClassroomBySection,
    progressUserClassroomBySection: state =>
      state.progressUserClassroomBySection,
    isLoadedProgressUserClassroomByActivity: state =>
      state.isLoadedProgressUserClassroomByActivity,
    progressUserClassroomByActivity: state =>
      state.progressUserClassroomByActivity,
    isLoadedProgressUserClassroomByActivityAvance: state =>
      state.isLoadedProgressUserClassroomByActivityAvance,
    progressUserClassroomByActivityAvance: state =>
      state.progressUserClassroomByActivityAvance,
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
    },
    getStatusUserClassroomChart: async ({ commit }, payload) => {
      try {
        commit('SET_LOADED_STATUS_USER_CLASSROOM_CHART', false)
        const { data } = await axios.get(
          `/api/v2/course-registered-users/${payload.course}/classrooms/${payload.classroom}/status-user-classroom`
        )

        const { _data, success, error, message } = data

        if (success) {
          commit('SET_STATUS_USER_CLASSROOM_CHART', _data.chartData)
          commit('SET_LOADED_STATUS_USER_CLASSROOM_CHART', true)

          return { chartData: _data.chartData }
        } else {
          console.log(error)
        }

        return { success, message }
      } catch (error) {
        console.log(error)
      }
    },
    getProgressUserClassroomBySection: async ({ commit }, payload) => {
      try {
        commit('SET_LOADED_PROGRESS_USER_CLASSROOM_SECTION', false)
        const { data } = await axios.get(
          `/api/v2/course-registered-users/${payload.course}/classrooms/${payload.classroom}/progress-classroom-chart`
        )

        const { _data, success, error, message } = data

        if (success) {
          commit('SET_PROGRESS_USER_CLASSROOM_SECTION', _data.chartData)
          commit('SET_LOADED_PROGRESS_USER_CLASSROOM_SECTION', true)

          return { chartData: _data.chartData }
        } else {
          console.log(error)
        }

        return { success, message }
      } catch (error) {
        console.log(error)
      }
    },
    getProgressUserClassroomByActivity: async ({ commit }, payload) => {
      try {
        commit('SET_LOADED_PROGRESS_USER_CLASSROOM_ACTIVITY_EVALUATION', false)
        const { data } = await axios.get(
          `/api/v2/course-registered-users/${payload.course}/classrooms/${payload.classroom}/sections/${payload.section}/progress-activities`
        )

        const { _data, success, error, message } = data

        if (success) {
          commit(
            'SET_PROGRESS_USER_CLASSROOM_ACTIVITY_EVALUATION',
            _data.chartData
          )
          commit('SET_LOADED_PROGRESS_USER_CLASSROOM_ACTIVITY_EVALUATION', true)

          return { chartData: _data.chartData }
        } else {
          console.log(error)
        }

        return { success, message }
      } catch (error) {
        console.log(error)
      }
    },
    getAvanceProgressUserClassroomByActivity: async ({ commit }, payload) => {
      try {
        commit('SET_LOADED_PROGRESS_USER_CLASSROOM_ACTIVITY_AVANCE', false)
        const { data } = await axios.get(
          `/api/v2/course-registered-users/${payload.course}/classrooms/${payload.classroom}/sections/${payload.section}/progress-activities-avance`
        )

        const { _data, success, error, message } = data

        if (success) {
          commit('SET_PROGRESS_USER_CLASSROOM_ACTIVITY_AVANCE', _data.chartData)
          commit('SET_LOADED_PROGRESS_USER_CLASSROOM_ACTIVITY_AVANCE', true)

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
