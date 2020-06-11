import axios from '../../services/axios'

const BASE_URL = '/api/v2/status-detail-ticket'

export default {
  namespaced: true,
  state: {
    statusDetailTickets: []
  },
  mutations: {
    SET_STATUS_DETAIL_TICKET: (state, statusDetailTickets) => {
      state.statusDetailTickets = statusDetailTickets
    },
    POST_STATUS_DETAIL_TICKET: (state, statusDetailTicket) => {
      state.statusDetailTickets.push(statusDetailTicket)
    },
    PUT_STATUS_DETAIL_TICKET: (state, statusDetailTicket) => {
      const editedIndex = state.statusDetailTickets.findIndex(
        find => find.properties.id === statusDetailTicket.properties.id
      )

      Object.assign(state.statusDetailTickets[editedIndex], statusDetailTicket)
    },
    DELETE_STATUS_DETAIL_TICKET: (state, statusDetailTicket) => {
      const editedIndex = state.statusDetailTickets.findIndex(
        find => find.properties.id === statusDetailTicket.properties.id
      )
      state.statusDetailTickets.splice(editedIndex, 1)
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
      try {
        const { data } = await axios.get(BASE_URL)

        const { _data, success, error, message } = data

        if (success) {
          console.log(_data.collections)
          commit('SET_STATUS_DETAIL_TICKET', _data.collections)
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
    postStatusDetailTicket: async ({ commit }, statusDetailTicket) => {
      try {
        const { data } = await axios.post(BASE_URL, statusDetailTicket)

        const { _data, success, error, message } = data

        if (success) {
          commit('POST_STATUS_DETAIL_TICKET', _data)
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
    putStatusDetailTicket: async ({ commit }, statusDetailTicket) => {
      try {
        const { data, status } = await axios.put(
          `${BASE_URL}/${statusDetailTicket.id}`,
          statusDetailTicket
        )

        if (status === 200) {
          const { _data, success, error, message } = data

          if (success) {
            commit('PUT_STATUS_DETAIL_TICKET', _data)
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
        const { data } = error.response
        return {
          success: data.success,
          error: 'Error grave. Contacte al Administrador.'
        }
      }
    },
    deleteStatusDetailTicket: async ({ commit }, statusDetailTicket) => {
      try {
        const { status, data } = await axios.delete(
          `${BASE_URL}/${statusDetailTicket.id}`
        )
        if (status === 200) {
          const { success, error, message } = data

          if (success) {
            commit('DELETE_STATUS_DETAIL_TICKET', statusDetailTicket)
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
