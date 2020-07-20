import axios from '../../services/axios'

const BASE_URL = '/api/v2/final-statuses'

export default {
  namespaced: true,
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
        find => find.properties.id === finalStatus.properties.id
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
    finalStatuses: state => {
      return state.finalStatuses.map(({ properties }) => {
        return {
          id: properties.id,
          description: properties.description
        }
      })
    }
  },
  actions: {
    fetchFinalStatuses: async ({ commit }) => {
      try {
        const { data } = await axios.get(BASE_URL)

        const { _data, success, error, message } = data

        if (success) {
          commit('SET_FINAL_STATUSES', _data.collections)
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
    postFinalStatus: async ({ commit }, finalStatus) => {
      try {
        const { data } = await axios.post(BASE_URL, finalStatus)

        const { _data, success, error, message } = data

        if (success) {
          commit('POST_FINAL_STATUS', _data)
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
    putFinalStatus: async ({ commit }, finalStatus) => {
      try {
        const { data, status } = await axios.put(
          `${BASE_URL}/${finalStatus.id}`,
          finalStatus
        )
        if (status === 200) {
          const { _data, success, error, message } = data

          if (success) {
            commit('PUT_FINAL_STATUS', _data)
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
    deleteFinalStatus: async ({ commit }, finalStatus) => {
      try {
        const { status, data } = await axios.delete(
          `${BASE_URL}/${finalStatus.id}`
        )

        if (status === 200) {
          const { success, error, message } = data

          if (success) {
            commit('DELETE_FINAL_STATUS', finalStatus)
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
