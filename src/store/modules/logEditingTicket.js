import axios from '../../services/axios'

const BASE_URL = '/api/v2/log-editing-tickets'

export default {
  namespaced: true,
  state: {
    logEditingTickets: [],
    logEditingTicket: null
  },
  mutations: {
    SET_LOG_EDITING_TICKETS: (state, log) => {
      state.logEditingTickets = log
    },
    SET_LOG_EDITING_TICKET: (state, log) => {
      state.logEditingTicket = log
    },
    POST_LOG_EDITING_TICKET: (state, log) => {
      state.logEditingTickets.push(log)
    },
    DELETE_LOG_EDITING_TICKET: (state, log) => {
      const editedIndex = state.logEditingTickets.findIndex(
        find => find.properties.id === log.id
      )
      state.logEditingTickets.splice(editedIndex, 1)
    }
  },
  getters: {
    logEditingTickets: state => {
      return state.logEditingTickets.map(({ properties }) => {
        return {
          id: properties.id,
          ticket: properties.ticket,
          user: properties.user,
          createdAt: properties.createdAt
        }
      })
    },
    logEditingTicket: state => {
      return {
        id: state.logEditingTicket.properties.id,
        ticket: state.logEditingTicket.properties.ticket,
        user: state.logEditingTicket.properties.user
      }
    }
  },
  actions: {
    fetchLogEditingTickets: async ({ commit }) => {
      try {
        const { data } = await axios.get(BASE_URL)

        const { _data, success, error, message } = data

        if (success) {
          commit('SET_LOG_EDITING_TICKETS', _data.collections)
        } else {
          console.log(error)
        }

        return { success, message }
      } catch (error) {
        const { data } = error.response
        console.log(error)
        return {
          success: data.success,
          message: data.message
        }
      }
    },
    findLogEditingTicketByTicket: async ({ commit }, ticket) => {
      try {
        const { status, data } = await axios.get(`${BASE_URL}/ticket/${ticket}`)

        if (status === 200) {
          const { success, error, message, statusCode } = data

          if (success) {
            commit('SET_LOG_EDITING_TICKET', data)
          } else {
            console.log(error)
          }
          return { success, message, statusCode }
        } else {
          return {
            success: data.success,
            error: 'No se ha podido realizar la operación'
          }
        }
      } catch (error) {
        console.log(error)
        return {
          success: false,
          error: 'Error grave. Contacte al Administrador.'
        }
      }
    },
    postLogEditingTicket: async ({ commit }, log) => {
      try {
        const { data } = await axios.post(BASE_URL, log)

        const { _data, success, error, message } = data

        if (success) {
          commit('POST_LOG_EDITING_TICKET', _data)
          commit('SET_LOG_EDITING_TICKET', _data)
        } else {
          console.log(error)
        }

        return { success, message }
      } catch (error) {
        const { data } = error.response
        return {
          success: data.success,
          error: 'Error grave. Contacte al Administrador.'
        }
      }
    },

    deleteLogEditingTicket: async ({ commit }, log) => {
      try {
        const { status, data } = await axios.delete(`${BASE_URL}/${log.id}`)

        if (status === 200) {
          const { success, error, message } = data

          if (success) {
            commit('DELETE_LOG_EDITING_TICKET', log)
            commit('SET_LOG_EDITING_TICKET', null)
          } else {
            console.log(error)
          }

          return { success, message }
        } else {
          return {
            success: data.success,
            error: 'No se ha podido realizar la operación'
          }
        }
      } catch (error) {
        console.log(error)
        return {
          success: false,
          error: 'Error grave. Contacte al Administrador.'
        }
      }
    }
  }
}
