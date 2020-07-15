<template>
  <v-main>
    <v-container class="fill-height" fluid tag="section">
      <v-app-bar app clipped-right flat color="white">
        <v-app-bar-nav-icon @click="setDrawer()"></v-app-bar-nav-icon>
        <v-spacer></v-spacer>
        <v-toolbar-title class="blueS--text">
          SISTEMA DE INFORMACIÓN PARA LA GESTIÓN DE ACCIONES
          FORMATIVAS</v-toolbar-title
        >
        <v-spacer></v-spacer>
        <v-btn @click="showLogoutConfirmation" dark color="grayS lighten-1"
          ><v-icon>mdi-logout</v-icon>CERRAR SESIÓN</v-btn
        >
      </v-app-bar>
      <navigation-drawer-app></navigation-drawer-app>
      <router-view></router-view>
      <footer-app></footer-app>
    </v-container>
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline text-center">SIGAF</v-card-title>

        <v-card-text class="text-center text-h6">
          ¿Cerrar sesión?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="grayS" dark depressed @click="dialog = false">
            CANCELAR
          </v-btn>

          <v-btn color="blueS" dark depressed @click="logout">
            ACEPTAR
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-main>
</template>

<script>
import NavigationDrawerApp from '../components/my/NavigationDrawer'
import FooterApp from '../components/my/Footer'
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
  inject: ['theme'],
  components: {
    'navigation-drawer-app': NavigationDrawerApp,
    'footer-app': FooterApp
    // VBoilerplate: {
    //   functional: true,

    //   render(h, { data, props, children }) {
    //     return h(
    //       'v-skeleton-loader',
    //       {
    //         ...data,
    //         props: {
    //           boilerplate: false,
    //           elevation: 2,
    //           ...props
    //         }
    //       },
    //       children
    //     )
    //   }
    // }
  },
  data() {
    return {
      mini: false,
      title: 'Ticket',
      dialog: false
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
    },
    showLogoutConfirmation() {
      this.dialog = true
    },
    async logout() {
      const { success } = await this.logoutStore()

      if (success) {
        this.dialog = false
        this.$router.push({ name: 'Login' })
      }
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

<style lang="scss" scoped></style>
