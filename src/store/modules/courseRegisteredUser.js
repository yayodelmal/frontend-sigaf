import axios from '../../services/axios'

const BASE_URL = '/api/v2/course-registered-user'

export default {
  namespaced: true,
  state: {
    courseRegisteredUsers: [],
    countUsersByCourses: [],
    storeUsersByCourse: [],
    lastDateSync: ''
  },
  mutations: {
    SET_LAST_DATE_SYNC: (state, payload) => {
      state.lastDateSync = payload
    },
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
      const editedIndex = state.courseRegisteredUsers.findIndex(
        find => find.id === courseRegisteredUser.id
      )

      state.courseRegisteredUsers.splice(editedIndex, 1)
    },

    POST_COURSE_REGISTERED_USER: (state, courseRegisteredUser) => {
      state.courseRegisteredUsers.push(courseRegisteredUser)
    },
    SET_COUNT_BY_COURSE: (state, payload) => {
      const editedIndex = state.countUsersByCourses.findIndex(
        find => find.id === payload.id
      )
      if (editedIndex === -1) {
        state.countUsersByCourses.push(payload)
      } else {
        Object.assign(state.countUsersByCourses[editedIndex], payload)
      }
      console.log('stateCountusers', state.countUsersByCourses)
    },
    SET_STORE_USERS_BY_COURSE: (state, payload) => {
      const editedIndex = state.storeUsersByCourse.findIndex(
        find => find.id === payload.id
      )
      if (editedIndex === -1) {
        state.storeUsersByCourse.push(payload)
      } else {
        Object.assign(state.storeUsersByCourse[editedIndex], payload)
      }
      console.log('stateStoreUsersByCourse', state.storeUsersByCourse)
    }
  },
  getters: {
    lastDateSync: state => state.lastDateSync,
    courseRegisteredUsers: state => {
      return state.courseRegisteredUsers
    },
    countUsersByCourses: state => {
      return state.countUsersByCourses
    },
    storeUsersByCourse: state => {
      return state.storeUsersByCourse
    }
  },
  actions: {
    fetchCourseRegisteredUsers: async ({ commit }) => {
      try {
        const { data } = await axios.get(`${BASE_URL}`)

        const { _data, success, error, message } = data

        if (success) {
          commit('SET_COURSE_REGISTERED_USERS', _data)

          console.log('data', _data)
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
    putArrayCourseRegisteredUsers: async ({ commit }, payload) => {
      try {
        const { classroom_id } = payload
        console.log(payload)

        const { data, status } = await axios.put(
          `/api/v2/course-registered-user/classroom/${classroom_id}/users`,
          payload
        )

        if (status === 200) {
          const { _data, success, message } = data

          _data.forEach(user => {
            user.classroom = payload.classroom
            user.classroomId = payload.classroom_id

            commit('course/PUT_USER_BY_COURSE_', user, { root: true })
          })

          return { success, message, data: _data }
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

    getCourseRegisteredByCoursePaginate: async (_, url) => {
      try {
        const { data } = await axios.get(url)

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
    },

    getCourseRegisteredByCourse: async ({ commit }, course) => {
      const id = course.id

      if (course.idCourseMoodle !== null) {
        const URL = `${BASE_URL}/${id}/users`
        try {
          const { data } = await axios.get(URL)

          if (data.success) {
            commit('SET_COURSE_REGISTERED_USERS', data._data.data)
            commit('SET_STORE_USERS_BY_COURSE', {
              id: id,
              collection: data._data.data
            })
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
    },

    findCourseRegisteredUserByUserCourse: async (_, payload) => {
      const { course, user } = payload

      const URL = `${BASE_URL}/${user}/courses/${course}`

      const { data } = await axios.get(URL)
      console.log(data)
      return data
    },
    findCourseRegisteredUserByActivity: async (_, IdActivity) => {
      console.log(IdActivity)
    },
    numberOfUsersByCourse: async ({ commit }, course) => {
      try {
        const { data } = await axios.get(`${BASE_URL}s/${course.id}/count`)

        const { _data, success, message } = data

        commit('SET_COUNT_BY_COURSE', _data)
        return { success, message, _data }
      } catch (error) {
        const { data } = error.response
        console.log(error)
        return {
          success: data.success,
          message: data.message
        }
      }
    },
    getLastSyncDate: async ({ commit }, course) => {
      try {
        const URL = `/api/v2/course-registered-users/${course.id}/last-sync`

        const { data } = await axios.get(URL)

        commit('SET_LAST_DATE_SYNC', data._data)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
