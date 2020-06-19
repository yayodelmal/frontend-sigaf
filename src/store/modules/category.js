import axios from '../../services/axios'

const BASE_URL = '/api/v2/categories'

export default {
  namespaced: true,
  state: {
    categories: [],
    categoriesByPlatform: []
  },
  mutations: {
    SET_CATEGORIES: (state, categories) => {
      state.categories = categories
    },
    SET_CATEGORIES_BY_PLATFORM: (state, categories) => {
      state.categoriesByPlatform = categories
    }
  },
  getters: {
    categories: state => {
      return state.categories.map(({ properties, relationships }) => {
        return {
          id: properties.id,
          description: properties.description,
          courses: {
            numberOfElements: relationships.numberOfElements,
            href: relationships.links.href
          },
          platorm: properties.platorm
        }
      })
    },
    categoriesByPlatform: state => {
      return state.categoriesByPlatform
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
      // },
      // getCategoriesByPlatform: async ({ commit }, link) => {
      //   try {
      //     const { status, data } = await axios.get(link)

      //     if (status === 200) {
      //       const { success, error, message } = data

      //       if (success) {
      //         console.log(data._data)
      //         commit(
      //           'SET_CATEGORIES_BY_PLATFORM',
      //           data._data.relationships.collections.description
      //         )
      //       } else {
      //         console.log(error)
      //       }

      //       return { success, message }
      //     } else {
      //       return {
      //         success: data.success,
      //         error: 'No se ha podido realizar la operación'
      //       }
      //     }
      //   } catch (error) {
      //     console.log(error)
      //     return {
      //       success: false,
      //       error: 'Error grave. Contacte al Administrador.'
      //     }
      //   }
    }
  }
}
