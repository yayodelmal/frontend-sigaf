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
    },
    POST_CATEGORY: (state, category) => {
      state.categories.push(category)
    },
    PUT_CATEGORY: (state, category) => {
      const editedIndex = state.categories.findIndex(
        find => find.properties.id === category.properties.id
      )
      Object.assign(state.categories[editedIndex], category)
    },
    DELETE_CATEGORY: (state, category) => {
      const editedIndex = state.categories.findIndex(
        find => find.properties.id === category.id
      )
      state.categories.splice(editedIndex, 1)
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
          idCategoryMoodle: properties.idCategoryMoodle,
          platform: properties.platform,
          status: properties.status
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
    },
    getCategoriesByPlatform: async ({ commit }, link) => {
      try {
        const { status, data } = await axios.get(link)

        if (status === 200) {
          const { success, error, message } = data

          if (success) {
            console.log(data._data)
            commit(
              'SET_CATEGORIES_BY_PLATFORM',
              data._data.relationships.collections.description
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
    postCategory: async ({ commit }, category) => {
      try {
        const { data } = await axios.post('/api/v2/categories/post', category)

        console.log(category)

        const { _data, success, error, message } = data

        if (success) {
          commit('POST_CATEGORY', _data)
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
    putCategory: async ({ commit }, category) => {
      try {
        const { data, status } = await axios.put(
          `/api/v2/categories/put/${category.id}`,
          category
        )
        if (status === 200) {
          const { _data, success, error, message } = data

          if (success) {
            commit('PUT_CATEGORY', _data)
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
    deleteCategory: async ({ commit }, category) => {
      try {
        const { status, data } = await axios.delete(
          `${BASE_URL}/${category.id}`
        )

        if (status === 200) {
          const { success, error, message } = data

          if (success) {
            commit('DELETE_CATEGORY', category)
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
    }
  }
}
