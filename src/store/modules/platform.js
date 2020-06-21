import axios from '../../services/axios'

const BASE_URL = '/api/v2/platforms'

export default {
  namespaced: true,
  state: {
    platforms: [],
    categories: []
  },
  mutations: {
    SET_PLATFORMS: (state, platforms) => {
      state.platforms = platforms
    },
    SET_CATEGORIES: (state, categories) => {
      state.categories = categories
    }
  },
  getters: {
    platforms: state => {
      return state.platforms.map(({ properties, relationships }) => {
        return {
          id: properties.id,
          description: properties.description,
          categories: {
            numberOfElements: relationships.numberOfElements,
            href: relationships.links.href
          }
        }
      })
    }
  },
  actions: {
    fetchPlatforms: async ({ commit }) => {
      try {
        const { data } = await axios.get(BASE_URL)

        const { _data, success, error, message } = data

        if (success) {
          commit('SET_PLATFORMS', _data.collections)
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
    fetchCategories: ({ commit, state }, idPlatform) => {
      try {
        state.plaftorms.forEach(async ({ properties, relationships }) => {
          if (properties.id === idPlatform) {
            const { data } = await axios.get(relationships.links.href)

            const { _data, success, error } = data

            commit('SET_CATEGORIES', _data.relationships.collections.data)

            return { success, error }
          }
        })
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
