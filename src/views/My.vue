<template>
  <v-main>
    <v-container class="fill-height bg-gray" fluid>
      <v-app-bar app clipped-right color="white">
        <v-app-bar-nav-icon @click="setDrawer()"></v-app-bar-nav-icon>
        <v-spacer></v-spacer>
        <v-toolbar-title class="blueS--text">
          SISTEMA DE INFORMACIÓN PARA LA GESTIÓN DE ACCIONES
          FORMATIVAS</v-toolbar-title
        >
        <v-spacer></v-spacer>
      </v-app-bar>

      <navigation-drawer-app></navigation-drawer-app>
      <v-container fluid>
        <router-view> </router-view>
      </v-container>
    </v-container>
  </v-main>
</template>

<script>
import NavigationDrawerApp from '../components/my/NavigationDrawer'
//import FooterApp from '../components/my/Footer'
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
  inject: ['theme'],
  components: {
    'navigation-drawer-app': NavigationDrawerApp
    //  'footer-app': FooterApp
  },
  data() {
    return {
      mini: false,
      title: 'Ticket',
      snackbar: true
    }
  },
  computed: {
    ...mapState(['drawer']),
    breackPoint() {
      return this.$vuetify.breakpoint.name
    },
    drawer: {
      get() {
        return this.$store.state.drawer
      },
      set(val) {
        this.$store.commit('SET_DRAWER', val)
      }
    }
  },
  methods: {
    ...mapMutations({
      setDrawer: 'SET_DRAWER'
    }),
    ...mapActions({
      logoutStore: 'auth/logout'
    }),
    setMini() {
      this.mini = !this.mini
    },
    setDrawer() {
      this.drawer = !this.drawer
    }
  },
  watch: {
    // breackPoint(newValue) {
    //   if (newValue === 'sm' || newValue === 'xs') {
    //     this.drawer = true
    //   } else {
    //     this.drawer = false
    //   }
    // }
  }
}
</script>

<style>
.bg-gray {
  background-color: #eceff1;
}
</style>
