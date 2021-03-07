import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/base'
import vuetify from './plugins/vuetify'
import CKEditor from '@ckeditor/ckeditor5-vue2'

Vue.use(CKEditor)
// import VueMask from 'v-mask'

Vue.config.productionTip = false

require('./store/modules/subscriber')

// import { VueMaskFilter } from 'v-mask'
// Vue.filter('VMask', VueMaskFilter)

// Vue.use(VueMask, {
//   placeholders: {
//     R: /[\d/|k|K]/,
//     S: /[.]/
//   }
// })

store.dispatch('auth/attempt', localStorage.getItem('access_token'))

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
