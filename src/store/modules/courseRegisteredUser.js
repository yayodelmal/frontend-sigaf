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
    }
  }
}
