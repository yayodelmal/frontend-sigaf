import axios from '../../services/axios'

export default {
  state: {
    finalStatuses: []
  },
  mutations: {
    SET_FINAL_STATUSES: (state, finalStatuses) => {
      state.finalStatuses = finalStatuses
    },
    POST_FINAL_STATUS: (state, finalStatus) => {
      state.finalStatuses.push(finalStatus)
    },
    PUT_FINAL_STATUS: (state, finalStatus) => {
      const editedIndex = state.finalStatuses.findIndex(
        find => find.id === finalStatus.id
      )
      Object.assign(state.finalStatuses[editedIndex], finalStatus)
    },
    DELETE_FINAL_STATUS: (state, finalStatus) => {
      const editedIndex = state.finalStatuses.findIndex(
        find => find.id === finalStatus.id
      )
      state.finalStatuses.splice(editedIndex, 1)
    }
  },
  getters: {
    finalStatusesDataTable: state => {
      return state.finalStatuses.map(finalStatus => {
        return {
          id: finalStatus.id,
          description: finalStatus.description
        }
      })
    }
  },
  actions: {
    fetchFinalStatuses: async ({ commit }) => {
      try {
        const { data } = await axios.get('final-status')
        commit('SET_FINAL_STATUSES', data.finalStatuses)
        return { success: data.success, error: data.error }
      } catch (error) {
        const { data } = error.response
        return {
          success: data.success,
          error: 'Error grave. Contacte al Administrador.'
        }
      }
    },
    postFinalStatus: async ({ commit }, finalStatus) => {
      try {
        const { data } = await axios.post('final-status', finalStatus)
        commit('POST_FINAL_STATUS', data.finalStatus)
        return { success: data.success, error: data.error }
      } catch (error) {
        const { data } = error.response
        return {
          success: data.success,
          error: 'Error grave. Contacte al Administrador.'
        }
      }
    },
    putFinalStatus: async ({ commit }, finalStatus) => {
      try {
        const { data, status } = await axios.put(
          `final-status/${finalStatus.id}`,
          finalStatus
        )
        if (status === 200) {
          commit('PUT_FINAL_STATUS', data.finalStatus)
          return { success: data.success, error: data.error }
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
    deleteFinalStatus: async ({ commit }, finalStatus) => {
      try {
        const { status, data } = await axios.delete(
          `final-status/${finalStatus.id}`
        )

        if (status === 200) {
          commit('DELETE_FINAL_STATUS', finalStatus)
          return { success: data.success, error: data.error }
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
    }
  }
}
