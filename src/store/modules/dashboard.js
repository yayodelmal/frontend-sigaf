import axios from '../../services/axios'

export default {
  namespaced: true,
  state: {
    sourcePieChart: {},
    typePieChart: {},
    statusPieChart: {},
    priorityPieChart: {},
    motivePieChart: {},
    statusUserChart: {},
    timeLoggedUserChart: {},
    statusTicketByOperatorChart: {},
    statusTicketByMotiveChart: {},
    totalTicket: 0,
    openTickets: 0,
    closeTickets: 0,
    lastDayTicket: 0,
    isLoadingStatusMotive: false,
    isLoadedTypeChart: false,
    isLoadedMotiveChart: false,
    isLoadedStatusUserChart: false,
    isLoadedTimeLoggedUserChart: false
  },
  mutations: {
    SET_LOADED_STATUS_MOTIVE: (state, isLoadingStatusMotive) => {
      state.isLoadingStatusMotive = isLoadingStatusMotive
    },
    SET_SOURCE_PIE_CHART: (state, sourcePieChart) => {
      state.sourcePieChart = sourcePieChart
    },
    SET_TOTAL_TICKET: (state, payload) => {
      state.totalTicket = payload
    },
    SET_OPEN_TICKET: (state, payload) => {
      state.openTickets = payload
    },
    SET_CLOSE_TICKET: (state, payload) => {
      state.closeTickets = payload
    },
    SET_LAST_DAY_TICKET: (state, payload) => {
      state.lastDayTicket = payload
    },
    SET_PRIORITY_PIE_CHART: (state, priorityPieChart) => {
      state.priorityPieChart = priorityPieChart
    },
    SET_TYPE_PIE_CHART: (state, typePieChart) => {
      state.typePieChart = typePieChart
    },
    SET_LOADED_TYPE_CHART: (state, isLoadedTypeChart) => {
      state.isLoadedTypeChart = isLoadedTypeChart
    },
    SET_STATUS_USER_CHART: (state, statusUserChart) => {
      state.statusUserChart = statusUserChart
    },
    SET_LOADED_STATUS_USER_CHART: (state, isLoadedStatusUserChart) => {
      state.isLoadedStatusUserChart = isLoadedStatusUserChart
    },
    SET_TIME_LOGGED_USER_CHART: (state, timeLoggedUserChart) => {
      state.timeLoggedUserChart = timeLoggedUserChart
    },
    SET_LOADED_TIME_LOGGED_USER_CHART: (state, isLoadedTimeLoggedUserChart) => {
      state.isLoadedTimeLoggedUserChart = isLoadedTimeLoggedUserChart
    },
    SET_MOTIVE_CHART: (state, motivePieChart) => {
      state.motivePieChart = motivePieChart
    },
    SET_LOADED_MOTIVE_CHART: (state, isLoadedMotiveChart) => {
      state.isLoadedMotiveChart = isLoadedMotiveChart
    },
    SET_STATUS_PIE_CHART: (state, statusPieChart) => {
      state.statusPieChart = statusPieChart
    },
    SET_STATUS_TICKET_BY_OPERATOR_CHART: (
      state,
      statusTicketByOperatorChart
    ) => {
      state.statusTicketByOperatorChart = statusTicketByOperatorChart
    },
    SET_STATUS_TICKET_BY_MOTIVE_CHART: (state, statusTicketByMotiveChart) => {
      state.statusTicketByMotiveChart = statusTicketByMotiveChart
    }
  },
  getters: {
    totalTicket: state => state.totalTicket,
    lastDayTicket: state => state.lastDayTicket,
    openTickets: state => state.openTickets,
    closeTickets: state => state.closeTickets,
    statusTicketByMotiveChart: state => state.statusTicketByMotiveChart,
    isLoadedStatusMotive: state => state.isLoadingStatusMotive,
    typePieChart: state => state.typePieChart,
    isLoadedTypeChart: state => state.isLoadedTypeChart,
    motivePieChart: state => state.motivePieChart,
    isLoadedMotiveChart: state => state.isLoadedMotiveChart,
    statusUserChart: state => state.statusUserChart,
    isLoadedStatusUserChart: state => state.isLoadedStatusUserChart,
    timeLoggedUserChart: state => state.timeLoggedUserChart,
    isLoadedTimeLoggedUserChart: state => state.isLoadedTimeLoggedUserChart,
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
    getLastDayTicket: async ({ commit }, payload) => {
      try {
        const { data } = await axios.get(
          `api/v2/tickets/${payload}/last-day/count`
        )
        commit('SET_LAST_DAY_TICKET', data)
      } catch (error) {
        console.log(error)
      }
    },
    getOpenTicket: async ({ commit }, payload) => {
      try {
        const { data } = await axios.get(`api/v2/tickets/${payload}/open/count`)
        commit('SET_OPEN_TICKET', data)
      } catch (error) {
        console.log(error)
      }
    },
    getCloseTicket: async ({ commit }, payload) => {
      try {
        const { data } = await axios.get(
          `api/v2/tickets/${payload}/close/count`
        )
        commit('SET_CLOSE_TICKET', data)
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
    getMotivePieChart: async ({ commit }, payload) => {
      try {
        commit('SET_LOADED_MOTIVE_CHART', false)
        const { data } = await axios.get(
          `/api/v2/tickets/${payload}/motive-chart`
        )

        const { _data, success, error, message } = data

        if (success) {
          commit('SET_MOTIVE_CHART', _data.chartData)
          commit('SET_LOADED_MOTIVE_CHART', true)
          return { chartData: _data.chartData }
        } else {
          console.log(error)
        }

        return { success, message }
      } catch (error) {
        console.log(error)
      }
    },
    getTypePieChart: async ({ commit }, payload) => {
      try {
        commit('SET_LOADED_TYPE_CHART', false)
        const { data } = await axios.get(
          `/api/v2/tickets/${payload}/type-chart`
        )

        const { _data, success, error, message } = data

        if (success) {
          commit('SET_TYPE_PIE_CHART', _data.chartData)
          commit('SET_LOADED_TYPE_CHART', true)

          return { chartData: _data.chartData }
        } else {
          console.log(error)
        }

        return { success, message }
      } catch (error) {
        console.log(error)
      }
    },
    getStatusUserChart: async ({ commit }, payload) => {
      try {
        commit('SET_LOADED_STATUS_USER_CHART', false)
        const { data } = await axios.get(
          `/api/v2/course-registered-users/${payload}/status/count`
        )

        const { _data, success, error, message } = data

        if (success) {
          commit('SET_STATUS_USER_CHART', _data.chartData)
          commit('SET_LOADED_STATUS_USER_CHART', true)

          return { chartData: _data.chartData }
        } else {
          console.log(error)
        }

        return { success, message }
      } catch (error) {
        console.log(error)
      }
    },
    getTimeLoggedUserChart: async ({ commit }, payload) => {
      try {
        commit('SET_LOADED_TIME_LOGGED_USER_CHART', false)
        const { data } = await axios.get(
          `/api/v2/course-registered-users/${payload}/logged-time/count`
        )

        const { _data, success, error, message } = data

        if (success) {
          commit('SET_TIME_LOGGED_USER_CHART', _data.chartData)
          commit('SET_LOADED_TIME_LOGGED_USER_CHART', true)

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
    getStatusTicketMotiveChart: async ({ commit }, payload) => {
      try {
        commit('SET_LOADED_STATUS_MOTIVE', false)
        const { data } = await axios.get(
          `/api/v2/tickets/${payload}/status-motive-chart`
        )

        const { _data, success, error, message } = data

        if (success) {
          commit('SET_STATUS_TICKET_BY_MOTIVE_CHART', _data.chartData)
          commit('SET_LOADED_STATUS_MOTIVE', true)
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
