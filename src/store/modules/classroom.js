import axios from '../../services/axios'

const BASE_URL = '/api/v2/classrooms'

export default {
  namespaced: true,
  state: {
    classrooms: [],
    classroomByCourse: null
  },
  mutations: {
    SET_CLASSROOMS: (state, classrooms) => {
      state.classrooms = classrooms
    },
    SET_CLASSROOMS_BY_COURSE: (state, payload) => {
      state.classroomByCourse = payload
    },
    POST_CLASSROOM: (state, classroom) => {
      state.classrooms.push(classroom)
    },
    PUT_CLASSROOM: (state, classroom) => {
      const editedIndex = state.classrooms.findIndex(
        find => find.properties.id === classroom.properties.id
      )
      Object.assign(state.classrooms[editedIndex], classroom)
    },
    DELETE_CLASSROOM: (state, classroom) => {
      const editedIndex = state.classrooms.findIndex(
        find => find.properties.id === classroom.id
      )
      state.classrooms.splice(editedIndex, 1)
    }
  },
  getters: {
    classrooms: state => {
      return state.classrooms.map(({ properties }) => {
        return {
          id: properties.id,
          description: properties.description
        }
      })
    },
    classroomByCourse: state => {
      if (!state.classroomByCourse) return null
      return state.classroomByCourse.map(classroom => {
        return classroom.properties.classroom
      })
    }
  },
  actions: {
    findClassroomByCourse: async ({ commit }, payload) => {
      try {
        const URL = `/api/v2/courses/${payload}/registered-users`

        const { data } = await axios.get(URL)

        console.log('data', data)

        const { success, _data } = data

        commit('SET_CLASSROOMS_BY_COURSE', _data.relationships.collection.data)
        return { success, data }
      } catch (error) {
        console.log(error.message)
      }
    },
    fetchClassrooms: async ({ commit }) => {
      try {
        const { data } = await axios.get(BASE_URL)

        const { _data, success, error, message } = data

        if (success) {
          commit('SET_CLASSROOMS', _data.collections)

          console.log(_data.collections)
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
    postClassroom: async ({ commit }, classroom) => {
      try {
        const { data } = await axios.post(BASE_URL, classroom)

        const { _data, success, error, message } = data

        if (success) {
          commit('POST_CLASSROOM', _data)
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
    putClassroom: async ({ commit }, classroom) => {
      try {
        const { data, status } = await axios.put(
          `${BASE_URL}/${classroom.id}`,
          classroom
        )
        if (status === 200) {
          const { _data, success, error, message } = data

          if (success) {
            commit('PUT_CLASSROOM', _data)
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
    deleteClassroom: async ({ commit }, classroom) => {
      try {
        const { status, data } = await axios.delete(
          `${BASE_URL}/${classroom.id}`
        )

        if (status === 200) {
          const { success, error, message } = data

          if (success) {
            commit('DELETE_CLASSROOM', classroom)
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
