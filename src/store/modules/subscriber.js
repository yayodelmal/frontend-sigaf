import store from '../../store'
import axios from '../../services/axios'

store.subscribe(mutation => {
  console.log(mutation)
  switch (mutation.type) {
    case 'auth/SET_ACCESS_TOKEN':
      if (mutation.payload) {
        axios.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${mutation.payload}`
        localStorage.setItem('access_token', mutation.payload)

        store.dispatch('motiveTicket/fetchMotiveTickets')
        store.dispatch('priorityTicket/fetchPriorityTickets')
        store.dispatch('sourceTicket/fetchSourceTickets')
        store.dispatch('typeTicket/fetchTypeTickets')
        store.dispatch('user/fetchUsers')
        store.dispatch('statusTicket/fetchStatusTickets')
        store.dispatch('classroom/fetchClassrooms')
        store.dispatch('statusDetailTicket/fetchStatusDetailTickets')
        store.dispatch('detailTicket/fetchDetailTickets')
      } else {
        axios.defaults.headers.common['Authorization'] = null
        localStorage.removeItem('access_token')
      }
      break
  }
})
