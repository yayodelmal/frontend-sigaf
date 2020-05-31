import axios from '../../services/axios'

const BASE_URL = '/api/v2/profiles'

export default {
  namespaced: true,
  state: {
    profiles: []
  },
  mutations: {
    SET_PROFILES: (state, profiles) => {
      state.profiles = profiles
    },
    POST_PROFILE: (state, profile) => {
      state.profiles.push(profile)
    },
    PUT_PROFILE: (state, profile) => {
      const editedIndex = state.profiles.findIndex(
        find => find.properties.id === profile.properties.id
      )

      Object.assign(state.profiles[editedIndex], profile)
    },
    DELETE_PROFILE: (state, profile) => {
      const editedIndex = state.profiles.findIndex(
        find => find.properties.id === profile.id
      )
      state.profiles.splice(editedIndex, 1)
    }
  },
  getters: {
    profiles: state => {
      return state.profiles.map(({ properties }) => {
        return {
          id: properties.id,
          description: properties.description
        }
      })
    }
  },
  actions: {
    fetchProfiles: async ({ commit }) => {
      try {
        const { data } = await axios.get(BASE_URL)

        const { _data, success, error, message } = data

        if (success) {
          commit('SET_PROFILES', _data.collections)
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
    postProfile: async ({ commit }, profile) => {
      try {
        const { data } = await axios.post(BASE_URL, profile)

        console.log(profile)

        const { _data, success, error, message } = data

        if (success) {
          commit('POST_PROFILE', _data)
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
    putProfile: async ({ commit }, profile) => {
      try {
        const { data, status } = await axios.put(
          `${BASE_URL}/${profile.id}`,
          profile
        )

        if (status === 200) {
          const { _data, success, error, message } = data

          if (success) {
            commit('PUT_PROFILE', _data)
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
    deleteProfile: async ({ commit }, profile) => {
      try {
        const { status, data } = await axios.delete(`${BASE_URL}/${profile.id}`)
        if (status === 200) {
          const { success, error, message } = data

          if (success) {
            commit('DELETE_PROFILE', profile)
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
