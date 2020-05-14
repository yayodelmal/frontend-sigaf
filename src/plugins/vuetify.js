import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import { es, en } from 'vuetify/es5/locale'

Vue.use(Vuetify)

export default new Vuetify({
  lang: {
    locales: { es, en },
    current: 'es'
  },
  theme: {
    themes: {
      light: {
        blueS: '#027087',
        redS: '#AC1315',
        whiteS: '#FEF7FB',
        grayS: '#404040'
      }
    }
  }
})
