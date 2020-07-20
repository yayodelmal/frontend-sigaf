import axios from '../../services/axios'

const BASE_URL = '/api/v2/course-registered-user'

export default {
  namespaced: true,
  state: {
    courseRegisteredUsers: []
  },
  mutations: {
    SET_COURSE_REGISTERED_USERS: (state, courseRegisteredUsers) => {
      state.courseRegisteredUsers = courseRegisteredUsers
    },
    PUT_COURSE_REGISTERED_USER: (state, courseRegisteredUser) => {
      const editedIndex = state.courseRegisteredUsers.findIndex(
        find => find.id === courseRegisteredUser.id
      )

      Object.assign(
        state.courseRegisteredUsers[editedIndex],
        courseRegisteredUser
      )
    },
    DELETE_COURSE_REGISTERED_USER: (state, courseRegisteredUser) => {
      console.log()
      const editedIndex = state.courseRegisteredUsers.findIndex(
        find => find.id === courseRegisteredUser.id
      )

      state.courseRegisteredUsers.splice(editedIndex, 1)
    },

    POST_COURSE_REGISTERED_USER: (state, courseRegisteredUser) => {
      state.courseRegisteredUsers.push(courseRegisteredUser)
    }
  },
  getters: {
    courseRegisteredUsers: state => {
      return state.courseRegisteredUsers
    }
  },
  actions: {
    fetchCourseRegisteredUsers: async ({ commit }) => {
      try {
        const { data } = await axios.get(BASE_URL)

        const { _data, success, error, message } = data

        if (success) {
          commit('SET_COURSE_REGISTERED_USERS', _data)
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
    putCourseRegisteredUser: async ({ commit }, courseRegisteredUser) => {
      try {
        const { data, status } = await axios.put(
          `/api/v2/course-registered-user/classroom/${courseRegisteredUser.id}`,
          courseRegisteredUser
        )

        if (status === 200) {
          const { _data, success, error, message } = data
          if (success) {
            commit('course/PUT_USER_BY_COURSE', _data, { root: true })
          } else {
            console.log(error)
          }

          return { success, message, data: _data.properties }
        }
      } catch (error) {
        console.log(error)
        return {
          success: false,
          error: 'Error grave. Contacte al Administrador.'
        }
      }
    },
    postCourseRegisteredUser: async ({ commit }, courseRegisteredUser) => {
      try {
        const { data } = await axios.post(
          `${BASE_URL}s/view-store`,
          courseRegisteredUser
        )

        const { _data, success, error, message } = data

        if (success) {
          commit('POST_COURSE_REGISTERED_USER', _data)
        } else {
          console.log(error)
        }

        return { success, message }
      } catch (error) {
        console.log(error)
        return {
          success: false,
          error: error,
          message: 'Error grave. Contacte al Administrador.'
        }
      }
    },
    deleteCourseRegisteredUser: async ({ commit }, courseRegisteredUser) => {
      try {
        console.log(courseRegisteredUser)
        const { status, data } = await axios.delete(
          `${BASE_URL}s/${courseRegisteredUser.id}`
        )
        console.log(data)
        if (status === 200) {
          const { success, error, message } = data

          if (success) {
            commit('DELETE_COURSE_REGISTERED_USER', courseRegisteredUser)
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
    },
    getCourseRegisteredUserByUser: async (_, courseRegisteredUser) => {
      console.log(courseRegisteredUser)
      const idUser = courseRegisteredUser.registeredUser.id
      const idCourse = courseRegisteredUser.course.id

      const URL = `api/v2/sync/users/${idUser}/courses/${idCourse}/activities`
      try {
        const { data } = await axios.get(URL)

        const { success, error } = data

        if (success) {
          return { success, error }
        } else {
          console.log(error)
        }
      } catch (error) {
        const { data } = error.response
        console.log(error)
        return {
          success: data.success,
          message: data.message
        }
      }
    },

    getCourseRegisteredByCourse: async (_, { properties }) => {
      const course = properties

      if (course.idCourseMoodle !== null) {
        const URL = `${BASE_URL}/${course.id}/users`
        try {
          const { data } = await axios.get(URL)

          if (data.success) {
            return data
          } else {
            console.log(data.error)
          }
        } catch (error) {
          const { data } = error.response
          console.log(error)
          return {
            success: data.success,
            message: data.message
          }
        }
      }
    }
  }
}
