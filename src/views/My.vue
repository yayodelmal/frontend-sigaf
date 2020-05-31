<template>
  <v-content>
    <v-container class="fill-height" fluid>
      <v-app-bar app clipped-right flat color="white">
        <v-app-bar-nav-icon @click.stop="setDrawer()"></v-app-bar-nav-icon>
      </v-app-bar>
      <navigation-drawer-app :drawer.sync="drawer"></navigation-drawer-app>
      <router-view></router-view>
      <footer-app></footer-app>
    </v-container>
  </v-content>
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
  methods: {
    setMini() {
      this.mini = !this.mini
    },
    setDrawer() {
      this.drawer = !this.drawer
    }
  }
}
</script>

<style lang="scss" scoped></style>
