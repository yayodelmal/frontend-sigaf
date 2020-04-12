import axios from '../../services/axios'

const classroom = {
  state: {
    classrooms: []
  },
  mutations: {
    SET_CLASSROOMS: (state, classrooms) => {
      state.classrooms = classrooms
    },
    POST_CLASSROOM: (state, classroom) => {
      state.classrooms.push(classroom)
    },
    PUT_CLASSROOM: (state, classroom) => {
      const editedIndex = state.classrooms.findIndex(
        find => find.id === classroom.id
      )
      Object.assign(state.classrooms[editedIndex], classroom)
    },
    DELETE_CLASSROOM: (state, classroom) => {
      const editedIndex = state.classrooms.findIndex(
        find => find.id === classroom.id
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
        const { data } = await axios.get('classroom')
        commit('SET_CLASSROOMS', data.classrooms)
        return { success: data.success, error: data.error }
      } catch (error) {
        const { data } = error.response
        return {
          success: data.success,
          error: 'Error grave. Contacte al Administrador.'
        }
      }
    },
    postClassroom: async ({ commit }, classroom) => {
      try {
        const { data } = await axios.post('classroom', classroom)
        commit('POST_CLASSROOM', data.classroom)
        return { success: data.success, error: data.error }
      } catch (error) {
        const { data } = error.response
        return {
          success: data.success,
          error: 'Error grave. Contacte al Administrador.'
        }
      }
    },
    putClassroom: async ({ commit }, classroom) => {
      try {
        const { status, data } = await axios.put(
          `classroom/${classroom.id}`,
          classroom
        )
        if (status === 200) {
          commit('PUT_CLASSROOM', data.classroom)
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
    deleteClassroom: async ({ commit }, classroom) => {
      try {
        const { status, data } = await axios.delete(`classroom/${classroom.id}`)

        if (status === 200) {
          commit('DELETE_CLASSROOM', classroom)
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

export default classroom
