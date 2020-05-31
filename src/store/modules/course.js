import axios from '../../services/axios'

const BASE_URL = '/api/v2/courses'

export default {
  namespaced: true,
  state: {
    courses: []
  },
  mutations: {
    SET_COURSES: (state, courses) => {
      state.courses = courses
    }
  },
  getters: {
    courses: state => {
      return state.courses
        .map(({ properties }) => {
          return {
            id: properties.id,
            description: properties.description,
            status: properties.status
          }
        })
        .filter(course => {
          return course.status === 1
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
    }
  }
}
