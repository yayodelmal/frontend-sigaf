import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/base'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

require('./store/modules/subscriber')

store.dispatch('auth/attempt', localStorage.getItem('access_token'))
store.dispatch('motiveTicket/fetchMotiveTickets')
store.dispatch('priorityTicket/fetchPriorityTickets')
store.dispatch('sourceTicket/fetchSourceTickets')
store.dispatch('typeTicket/fetchTypeTickets')
store.dispatch('user/fetchUsers')
store.dispatch('statusTicket/fetchStatusTickets')
store.dispatch('classroom/fetchClassrooms')
store.dispatch('statusDetailTicket/fetchStatusDetailTickets')
store.dispatch('detailTicket/fetchDetailTickets')

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
