import axios from '../../services/axios'

const BASE_URL = '/api/v2/activities'

export default {
  namespaced: true,
  state: {
    activities: [],
    activity: null
  },
  mutations: {
    SET_ACTIVITIES: (state, activities) => {
      state.activities = activities
    },
    POST_ACTIVITY: (state, activity) => {
      state.activities.push(activity)
    },
    PUT_ACTIVITY: (state, activity) => {
      console.log('mutated', activity)
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
    },
    FIND_ACTIVITY: (state, activity) => {
      state.activity = activity
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
          course: properties.course.properties,
          idActivityMoodle: properties.idActivityMoodle,
          type: properties.type
        }
      })
    },
    activity: state => {
      return state.activity
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
    },
    findActivity: async ({ commit }, idActivity) => {
      try {
        const { status, data } = await axios.get(`${BASE_URL}/${idActivity}`)

        if (status === 200) {
          const { success, error, message } = data

          if (success) {
            commit('FIND_ACTIVITY', data._data)
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
    getContributoryActivities: async (_, data_) => {
      try {
        const URL = `api/v2/sync/course-users/${data_.users.course.id_course_moodle}/users/${data_.users.registeredUser.id_registered_moodle}/activities/${data_.array}`

        const { data } = await axios.get(URL)

        console.log(data)

        const { success } = data

        return { success }
      } catch (error) {
        console.log(error.message)
      }
    }
  }
}
