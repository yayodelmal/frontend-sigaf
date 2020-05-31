import axios from '../../services/axios'

const BASE_URL = '/api/v2/categories'

export default {
  namespaced: true,
  state: {
    categories: []
  },
  mutations: {
    SET_CATEGORIES: (state, categories) => {
      state.categories = categories
    }
  },
  getters: {
    categories: state => {
      return state.categories.map(({ properties, relationships }) => {
        return {
          id: properties.id,
          description: properties.description,
          numberOfCourses: relationships.numberOfElements,
          getLinkCourses: relationships.links.href
        }
      })
    }
  },
  actions: {
    fetchCategories: async ({ commit }) => {
      try {
        const { data } = await axios.get(BASE_URL)

        const { _data, success, error, message } = data

        if (success) {
          commit('SET_CATEGORIES', _data.collections)
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
