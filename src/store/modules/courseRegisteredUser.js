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

        console.log('data', data)
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

          console.log('_data', _data)

          if (success) {
            commit('course/PUT_USER_BY_COURSE', _data, { root: true })
          } else {
            console.log(error)
          }

          return { success, message }
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

        console.log(courseRegisteredUser)

        const { _data, success, error, message } = data

        console.log(data)

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
    }
  }
}
