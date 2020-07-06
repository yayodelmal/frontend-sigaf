<template>
  <v-main>
    <v-container class="fill-height" fluid>
      <v-app-bar app clipped-right flat color="white">
        <v-app-bar-nav-icon @click.stop="setDrawer()"></v-app-bar-nav-icon>
        <v-spacer></v-spacer>
        <v-toolbar-title class="blueS--text">
          SISTEMA DE INFORMACIÓN PARA LA GESTIÓN DE ACCIONES
          FORMATIVAS</v-toolbar-title
        >
        <v-spacer></v-spacer>
      </v-app-bar>
      <navigation-drawer-app :drawer.sync="drawer"></navigation-drawer-app>
      <router-view></router-view>
      <footer-app></footer-app>
    </v-container>
  </v-main>
</template>

<script>
import NavigationDrawerApp from '../components/my/NavigationDrawer'
import FooterApp from '../components/my/Footer'
export default {
  components: {
    'navigation-drawer-app': NavigationDrawerApp,
    'footer-app': FooterApp
  },
  data() {
    return {
      drawer: false,
      mini: false,
      title: 'Ticket'
    }
  },
  computed: {
    breackPoint() {
      return this.$vuetify.breakpoint.name
    }
  },
  methods: {
    setMini() {
      this.mini = !this.mini
    },
    setDrawer() {
      this.drawer = !this.drawer
    }
  },
  watch: {
    breackPoint(newValue) {
      if (newValue === 'sm' || newValue === 'xs') {
        console.log('branch true')
        this.drawer = true
      } else {
        this.drawer = false
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
