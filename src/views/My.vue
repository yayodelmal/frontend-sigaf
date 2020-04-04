<template>
  <v-app>
    <navbar-app></navbar-app>
    <navigation-drawer-app></navigation-drawer-app>
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
    <footer-app></footer-app>
  </v-app>
</template>

<script>
import NavigationDrawerApp from '../components/my/NavigationDrawer'
import NavbarApp from '../components/my/Navbar'
import FooterApp from '../components/my/Footer'
export default {
  components: {
    'navigation-drawer-app': NavigationDrawerApp,
    'navbar-app': NavbarApp,
    'footer-app': FooterApp
  },
  data() {
    return {
      drawer: null
    }
  }
}
</script>

<style lang="scss" scoped></style>
