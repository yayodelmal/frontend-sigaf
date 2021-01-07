import axios from '../../services/axios'

const BASE_URL = '/api/v2/courses'

export default {
  namespaced: true,
  state: {
    courses: [],
    course: null,
    coursesByCategory: [],
    usersByCourse: []
  },
  mutations: {
    SET_COURSES: (state, courses) => {
      state.courses = courses
    },
    SET_COURSE: (state, course) => {
      state.course = course
    },
    SET_COURSES_BY_CATEGORY: (state, courses) => {
      state.coursesByCategory = courses
    },
    SET_USER_BY_COURSE: (state, usersByCourse) => {
      state.usersByCourse = usersByCourse
    },
    POST_COURSE: (state, course) => {
      state.courses.push(course)
    },
    PUT_COURSE: (state, course) => {
      const editedIndex = state.courses.findIndex(
        find => find.properties.id === course.properties.id
      )
      Object.assign(state.courses[editedIndex], course)
    },
    PUT_USER_BY_COURSE: (state, user) => {
      const editedIndex = state.usersByCourse.findIndex(find => {
        return find.properties.id === user.properties.id
      })

      Object.assign(state.usersByCourse[editedIndex], user)
    },
    PUT_USER_BY_COURSE_: (state, user) => {
      let data = { properties: user }
      const editedIndex = state.usersByCourse.findIndex(find => {
        let data = { properties: user }

        return find.properties.id === data.properties.id
      })

      console.log(editedIndex)

      Object.assign(state.usersByCourse[editedIndex], data)
    },

    DELETE_COURSE: (state, course) => {
      const editedIndex = state.courses.findIndex(
        find => find.properties.id === course.id
      )
      state.courses.splice(editedIndex, 1)
    }
  },
  getters: {
    courses: state => {
      return state.courses
        .map(({ properties }) => {
          return {
            id: properties.id,
            description: properties.description,
            idCourseMoodle: properties.idCourseMoodle,
            category: properties.category,
            status: properties.status
          }
        })
        .filter(course => {
          return course.status === 1
        })
    },
    course: state => {
      return state.course
    },
    coursesByCategory: state => {
      return state.coursesByCategory
    },
    usersByCourse: state => {
      return state.usersByCourse.map(({ properties }) => {
        const rutUpper = properties.registeredUser.rut_registered_moodle
        let status

        if (rutUpper) {
          status =
            properties.registeredUser.rut ===
            properties.registeredUser.rut_registered_moodle.toUpperCase()
        } else {
          status =
            properties.registeredUser.rut ===
            properties.registeredUser.rut_registered_moodle
        }
        return Object.assign(properties, {
          status: status,
          classroomId: properties.classroom.id
        })
      })
    }
  },
  actions: {
    fetchCourses: async ({ commit }) => {
      try {
        const { data } = await axios.get(BASE_URL)

        const { _data, success, error, message } = data

        if (success) {
          commit('SET_COURSES', _data.collections)
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
    findCourse: async ({ commit }, idCourse) => {
      try {
        const { status, data } = await axios.get(`${BASE_URL}/${idCourse}`)

        if (status === 200) {
          const { success, error, message } = data

          if (success) {
            commit('SET_COURSE', data._data)
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
    getCoursesByCategory: async ({ commit }, link) => {
      try {
        const { status, data } = await axios.get(link)

        if (status === 200) {
          const { success, error, message } = data

          if (success) {
            commit(
              'SET_COURSES_BY_CATEGORY',
              data._data.relationships.collections.data
            )
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
    postCourse: async ({ commit }, course) => {
      try {
        const { data } = await axios.post('/api/v2/courses/post', course)

        const { _data, success, error, message } = data

        if (success) {
          commit('POST_COURSE', _data)
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
    putCourse: async ({ commit }, course) => {
      try {
        const { data, status } = await axios.put(
          `${BASE_URL}/${course.id}`,
          course
        )
        if (status === 200) {
          const { _data, success, error, message } = data

          if (success) {
            commit('PUT_COURSE', _data)
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
    deleteCourse: async ({ commit }, course) => {
      try {
        const { status, data } = await axios.delete(`${BASE_URL}/${course.id}`)

        if (status === 200) {
          const { success, error, message } = data

          if (success) {
            commit('DELETE_COURSE', course)
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
    getUsersByCourse: async ({ commit }, courseId) => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/${courseId}/registered-users`
        )

        const { _data, success, error, message } = data

        if (success) {
          commit('SET_USER_BY_COURSE', _data.relationships.collection.data)
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
    }
  }
}
