import axios from 'axios'

let http = axios.create({
  baseURL: `http://sigaf.iie.cl/backend-sigaf/public`,
  //baseURL: process.env.VUE_APP_BACKEND_URL,
  //baseURL: `http://sigaf.test`,
  //baseURL: 'http://192.168.43.194:8000',
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
})

http.interceptors.request.use(
  function(config) {
    // What to do before sending the request
    // Write a value to bypass if judgment
    if (config.method == 'get' || config.method == 'delete') {
      config.data = true
    }
    return config
  },
  function(error) {
    // What to do about request errors
    return Promise.reject(error)
  }
)

export default http
