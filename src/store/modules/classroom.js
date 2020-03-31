import axios from '../../services/axios'

const classroom = {
  state: {
    classrooms: [],
    error: null,
    success: null
  },
  mutations: {
    SET_CLASSROOMS: (state, payload) => {
      state.classrooms = payload
    },
    POST_CLASSROOM: (state, payload) => {
      state.classrooms.push(payload)
    },
    PUT_CLASSROOM: (state, payload) => {
      const editedIndex = state.classrooms.findIndex(
        find => find.id === payload.id
      )
      Object.assign(state.classrooms[editedIndex], payload)
    },
    DELETE_CLASSROOM: (state, payload) => {
      state.classrooms.splice(payload.deleteIndex, 1)
    },
    CHECKOUT_SUCCESS: (state, payload) => {
      state.success = payload
    },
    CHECKOUT_ERROR: (state, payload) => {
      state.error = payload
    },
    RESET_CHECKOUT: (state, payload) => {
      state.success = payload
      state.error = payload
    }
  },
  getters: {
    classroomsDataTable: state => {
      return state.classrooms.map(classroom => {
        return {
          id: classroom.id,
          description: classroom.description
        }
      })
    }
  },
  actions: {
    fetchClassrooms: async ({ commit }) => {
      try {
        const response = await axios.get('classroom')

        console.log(response)
        const json = response.data

        commit('SET_CLASSROOMS', json.data)
      } catch (error) {
        commit('CHECKOUT_ERROR', error)
      }
    },
    postClassroom: async ({ commit }, payload) => {
      try {
        const { data, status } = await axios.post('classroom', payload)

        if (status === 201) {
          console.log(status)
          commit('POST_CLASSROOM', data)
          return { data: data, error: null }
        }
      } catch (error) {
        console.log(error)
        return { data: null, error: error }
      }
    },
    putClassroom: async ({ commit }, payload) => {
      try {
        const response = await axios.put(`classroom/${payload.id}`, payload)
        const json = response.data

        commit('PUT_CLASSROOM', json.data)
        commit('CHECKOUT_SUCCESS', true)
      } catch (error) {
        commit('CHECKOUT_ERROR', error)
      }
    },
    deleteClassroom: async ({ commit }, payload) => {
      try {
        await axios.delete(`classroom/${payload.id}`, payload)

        commit('DELETE_CLASSROOM', payload)
        commit('CHECKOUT_SUCCESS', true)
      } catch (error) {
        commit('CHECKOUT_ERROR', error)
      }
    },
    resetCheckout: async ({ commit }, payload) => {
      commit('RESET_CHECKOUT', payload)
    }
  }
}

export default classroom
