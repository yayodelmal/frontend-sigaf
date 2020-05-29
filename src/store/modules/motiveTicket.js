import axios from '../../services/axios'

const BASE_URL = '/api/v2/motive-tickets'

export default {
  namespaced: true,
  state: {
    motiveTickets: [],
    tikets: []
  },
  mutations: {
    SET_MOTIVE_TICKETS: (state, motiveTickets) => {
      state.motiveTickets = motiveTickets
    },
    SET_TICKET: (state, tickets) => {
      state.tickets = tickets
    },
    POST_MOTIVE_TICKET: (state, motiveTicket) => {
      state.motiveTickets.push(motiveTicket)
    },
    PUT_MOTIVE_TICKET: (state, motiveTicket) => {
      const editedIndex = state.motiveTickets.findIndex(
        find => find.properties.id === motiveTicket.properties.id
      )

      Object.assign(state.motiveTickets[editedIndex], motiveTicket)
    },
    DELETE_MOTIVE_TICKET: (state, motiveTicket) => {
      const editedIndex = state.motiveTickets.findIndex(
        find => find.properties.id === motiveTicket.id
      )
      state.motiveTickets.splice(editedIndex, 1)
    }
  },
  getters: {
    motiveTickets: state => {
      return state.motiveTickets.map(({ properties, relationships }) => {
        return {
          id: properties.id,
          description: properties.description,
          tickets: {
            numberOfElements: relationships.numberOfElements,
            href: relationships.links.href
          }
        }
      })
    }
  },
  actions: {
    fetchMotiveTickets: async ({ commit }) => {
      try {
        const { data } = await axios.get(BASE_URL)

        const { _data, success, error, message } = data

        if (success) {
          commit('SET_MOTIVE_TICKETS', _data.collections)
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
    fetchTickets: ({ commit, state }, idMotiveTicket) => {
      try {
        state.motiveTickets.forEach(async ({ properties, relationships }) => {
          if (properties.id === idMotiveTicket) {
            const { data } = await axios.get(relationships.links.href)

            const { _data, success, error } = data

            commit('SET_TICKETS', _data.relationships.collection.data)

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
    },
    postMotiveTicket: async ({ commit }, motiveTicket) => {
      try {
        const { data } = await axios.post(BASE_URL, motiveTicket)

        console.log(motiveTicket)

        const { _data, success, error, message } = data

        if (success) {
          commit('POST_MOTIVE_TICKET', _data)
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
    putMotiveTicket: async ({ commit }, motiveTicket) => {
      try {
        const { data, status } = await axios.put(
          `${BASE_URL}/${motiveTicket.id}`,
          motiveTicket
        )
        if (status === 200) {
          const { _data, success, error, message } = data

          if (success) {
            commit('PUT_MOTIVE_TICKET', _data)
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
    deleteMotiveTicket: async ({ commit }, motiveTicket) => {
      try {
        const { status, data } = await axios.delete(
          `${BASE_URL}/${motiveTicket.id}`
        )

        if (status === 200) {
          const { success, error, message } = data

          if (success) {
            commit('DELETE_MOTIVE_TICKET', motiveTicket)
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
