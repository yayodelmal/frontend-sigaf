import Vue from 'vue'
import Vuetify, { VSkeletonLoader } from 'vuetify/lib'
import { es, en } from 'vuetify/es5/locale'
import { Ripple, Scroll } from 'vuetify/lib/directives'

Vue.use(Vuetify, {
  components: {
    VSkeletonLoader
  },
  directives: {
    Ripple,
    Scroll
  }
})

const options = {
  lang: {
    locales: { es, en },
    current: 'es'
  },
  theme: {
    themes: {
      light: {
        blueS: '#006C8D', //'#027087'
        redS: '#AC1315', //'#AC1315' '#BA2E38'
        whiteS: '#FEF7FB',
        grayS: '#404040'
      }
    }
  }
}

export default new Vuetify(options)
