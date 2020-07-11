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
      } else {
        axios.defaults.headers.common['Authorization'] = null
        localStorage.removeItem('access_token')
        localStorage.removeItem('role')
      }
      break

    case 'auth/SET_LOGIN_USER':
      if (mutation.payload) {
        console.log('role => ', mutation.payload.properties.role.description)
        localStorage.setItem(
          'role',
          mutation.payload.properties.role.description
        )
      }
      break
  }
})
