import axios from '../../services/axios'

const classroom = {
  state: {
    classrooms: []
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
      const editedIndex = state.classrooms.findIndex(
        find => find.id === payload.id
      )
      state.classrooms.splice(editedIndex, 1)
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

        const json = response.data

        console.log(json)

        commit('SET_CLASSROOMS', json.classrooms)
      } catch (error) {
        console.log(error)
      }
    },
    postClassroom: async ({ commit }, payload) => {
      try {
        const { data, status } = await axios.post('classroom', payload)

        if (status === 201) {
          commit('POST_CLASSROOM', data.classroom)
          return { success: true, error: null }
        }
      } catch (error) {
        return { success: false, error: error.message }
      }
    },
    putClassroom: async ({ commit }, payload) => {
      try {
        const { status, data } = await axios.put(
          `classroom/${payload.id}`,
          payload
        )
        if (status === 200) {
          commit('PUT_CLASSROOM', data.classroom)
          return { success: true, error: null }
        } else {
          return {
            success: false,
            error: 'No se ha podido realizar la operación'
          }
        }
      } catch (error) {
        return {
          success: false,
          error: error
        }
      }
    },
    deleteClassroom: async ({ commit }, payload) => {
      try {
        const { status } = await axios.delete(`classroom/${payload.id}`)

        if (status === 200) {
          commit('DELETE_CLASSROOM', payload)
          return { success: true, error: null }
        }
      } catch (error) {
        return { success: false, error: error.message }
      }
    }
  }
}

export default classroom
