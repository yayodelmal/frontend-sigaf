<template>
  <v-navigation-drawer permanent expand-on-hover app dark clipped>
    <v-list>
      <v-list-item link>
        <v-list-item-content>
          <v-list-item-title class="title">Administrador</v-list-item-title>
          <v-list-item-subtitle>adm@gmail.com</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list dense nav shaped>
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
    </v-list>

    <v-divider></v-divider>

    <v-list dense nav shaped>
      <v-list-group no-action prepend-icon="mdi-brightness-7" color>
        <template v-slot:activator>
          <v-list-item>
            <v-list-item-title>Mantenedor</v-list-item-title>
          </v-list-item>
        </template>
        <v-list-item to="/my/mantenedor/aulas" link>
          <v-list-item-content>
            <v-list-item-title>Aula</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title>Aula</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
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
