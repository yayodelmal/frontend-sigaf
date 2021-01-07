import axios from '../../services/axios'

const BASE_URL = '/api/v2/sections'

export default {
  namespaced: true,
  state: {
    sections: []
  },
  mutations: {
    SET_SECTIONS: (state, sections) => {
      state.sections = sections
    },
    POST_SECTION: (state, section) => {
      state.sections.push(section)
    },
    PUT_SECTION: (state, section) => {
      const editedIndex = state.sections.findIndex(
        find => find.properties.id === section.properties.id
      )
      Object.assign(state.sections[editedIndex], section)
    },
    DELETE_SECTION: (state, section) => {
      const editedIndex = state.sections.findIndex(
        find => find.properties.id === section.id
      )
      state.sections.splice(editedIndex, 1)
    }
  },
  getters: {
    sections: state => {
      return state.sections.map(({ properties }) => {
        return {
          id: properties.id,
          description: properties.description,
          activities: properties.activities,
          numberActivities: properties.activities.length
        }
      })
    }
  },
  actions: {
    fetchSections: async ({ commit }) => {
      try {
        const { data } = await axios.get(BASE_URL)

        const { _data, success, error, message } = data

        if (success) {
          commit('SET_SECTIONS', _data.collections)
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
    postSection: async ({ commit }, section) => {
      try {
        const { data } = await axios.post(BASE_URL, section)

        const { _data, success, error, message } = data

        if (success) {
          commit('POST_SECTION', _data)
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
    putSection: async ({ commit }, section) => {
      try {
        const { data, status } = await axios.put(
          `${BASE_URL}/${section.id}`,
          section
        )

        if (status === 200) {
          const { _data, success, error, message } = data

          if (success) {
            commit('PUT_SECTION', _data)
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
    deleteSection: async ({ commit }, section) => {
      try {
        const { status, data } = await axios.delete(`${BASE_URL}/${section.id}`)

        if (status === 200) {
          const { success, error, message } = data

          if (success) {
            commit('DELETE_SECTION', section)
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
