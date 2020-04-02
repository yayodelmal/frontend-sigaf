<template>
  <v-card>
    <v-navigation-drawer permanent expand-on-hover app clipped dark>
      <v-list>
        <!-- <v-list-item class="px-2">
          <v-list-item-avatar>
            <v-img
              src="https://randomuser.me/api/portraits/women/85.jpg"
            ></v-img>
          </v-list-item-avatar>
        </v-list-item> -->

        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title class="title">Administrador</v-list-item-title>
            <v-list-item-subtitle>adm@gmail.com</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item to="/my/dashboard" link>
          <v-list-item-icon>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item>
        <v-list-item link>
          <v-list-item-icon>
            <v-icon>mdi-google-classroom</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Cursos</v-list-item-title>
        </v-list-item>
        <v-list-item link>
          <v-list-item-icon>
            <v-icon>mdi-ticket-account</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Ticket</v-list-item-title>
        </v-list-item>
        <v-list-item to="/my/mantenedor/aulas" link>
          <v-list-item-icon>
            <v-icon>mdi-cog</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Mantenedor</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
export default {
  name: 'NavigationDrawerApp',
  data: () => ({
    items: [
      { title: 'Home', icon: 'dashboard' },
      { title: 'About', icon: 'question_answer' }
    ],
    links: ['Home', 'Contacts', 'Settings'],
    mini: true
  })
}
</script>

<style lang="scss" scoped></style>
