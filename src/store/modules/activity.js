import axios from '../../services/axios'

const BASE_URL = '/api/v2/activities'

export default {
  namespaced: true,
  state: {
    activities: []
  },
  mutations: {
    SET_ACTIVITIES: (state, activities) => {
      state.activities = activities
    },
    POST_ACTIVITY: (state, activity) => {
      const section = { properties: activity.section }
      const storeActivity = {
        properties: { ...activity, section }
      }
      console.log(storeActivity)
      state.activities.push(storeActivity)
    },
    PUT_ACTIVITY: (state, activity) => {
      const editedIndex = state.activities.findIndex(
        find => find.properties.id === activity.properties.id
      )

      Object.assign(state.activities[editedIndex], activity)
    },
    DELETE_ACTIVITY: (state, activity) => {
      const editedIndex = state.activities.findIndex(
        find => find.properties.id === activity.id
      )
      state.activities.splice(editedIndex, 1)
    }
  },
  getters: {
    activities: state => {
      return state.activities.map(({ properties }) => {
        return {
          id: properties.id,
          description: properties.description,
          weighing: properties.weighing,
          section: properties.section.properties,
          course: properties.course.properties
        }
      })
    }
  },
  actions: {
    fetchActivities: async ({ commit }) => {
      try {
        const { data } = await axios.get(BASE_URL)

        const { _data, success, error, message } = data

        if (success) {
          console.log(_data.collections)
          commit('SET_ACTIVITIES', _data.collections)
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
    postActivity: async ({ commit }, activity) => {
      try {
        const { data } = await axios.post(BASE_URL, activity)

        const { _data, success, error, message } = data

        if (success) {
          commit('POST_ACTIVITY', _data)
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
    putActivity: async ({ commit }, activity) => {
      activity.section_id = activity.section.id
      try {
        console.log('activity', activity)
        const { data, status } = await axios.put(
          `${BASE_URL}/${activity.id}`,
          activity
        )

        if (status === 200) {
          const { _data, success, error, message } = data

          if (success) {
            commit('PUT_ACTIVITY', _data)
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
    deleteActivity: async ({ commit }, activity) => {
      try {
        const { status, data } = await axios.delete(
          `${BASE_URL}/${activity.id}`
        )

        if (status === 200) {
          const { success, error, message } = data

          if (success) {
            commit('DELETE_ACTIVITY', activity)
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
