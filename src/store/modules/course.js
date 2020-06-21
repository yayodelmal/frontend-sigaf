import axios from '../../services/axios'

const BASE_URL = '/api/v2/courses'

export default {
  namespaced: true,
  state: {
    courses: [],
    course: null,
    coursesByCategory: []
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
    POST_COURSE: (state, course) => {
      state.course.push(course)
    }
  },
  getters: {
    courses: state => {
      return state.courses
        .map(({ properties }) => {
          return {
            id: properties.id,
            description: properties.description,
            status: properties.status,
            category: properties.category
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
            console.log(data._data)
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

        console.log(course)

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
    }
  }
}
