<template>
  <v-navigation-drawer
    app
    overflow
    left
    :mini-variant.sync="drawerLocal"
    dark
    permanent
  >
    <v-list>
      <v-list-item link>
        <v-list-item-content>
          <v-list-item-title class="title">{{
            user !== null ? user.name : ''
          }}</v-list-item-title>
          <v-list-item-subtitle>{{
            user !== null ? user.email : ''
          }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list dense nav shaped>
      <v-list-item
        v-for="link in links.main"
        :key="link.name"
        :to="link.to"
        link
      >
        <v-list-item-icon>
          <v-icon>{{ link.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ link.name }}</v-list-item-title>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list dense nav shaped>
      <v-list-group
        v-for="link in links.secondary"
        :key="link.name"
        no-action
        :prepend-icon="link.icon"
        color
      >
        <template v-slot:activator>
          <v-list-item>
            <v-list-item-title>{{ link.name }}</v-list-item-title>
          </v-list-item>
        </template>
        <v-list-item
          v-for="internalLink in link.links"
          :key="internalLink.name"
          :to="internalLink.to"
          link
        >
          <v-list-item-content>
            <v-list-item-title>{{ internalLink.name }}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-icon v-if="internalLink.icon !== undefined">
            <v-icon>{{ internalLink.icon }}</v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'NavigationDrawerApp',
  data: () => ({
    mini: true,
    links: {
      main: [
        {
          name: 'Dashboard',
          icon: 'mdi-view-dashboard',
          to: { name: 'Dashboard' }
        },
        {
          name: 'Cursos',
          icon: 'mdi-google-classroom',
          to: { name: 'Classroom' }
        },
        {
          name: 'Ticket',
          icon: 'mdi-ticket-account',
          to: { name: 'Ticket' }
        }
      ],
      secondary: [
        {
          name: 'Mantenedor',
          icon: 'mdi-hammer-wrench',
          links: [
            {
              name: 'Aula',
              to: { name: 'Classroom' }
            },
            {
              name: 'Estado ticket',
              to: { name: 'StatusTicket' }
            },
            {
              name: 'Estado final alumno',
              to: { name: 'FinalStatus' }
            },
            {
              name: 'Tipo ticket',
              to: { name: 'TypeTicket' }
            },
            {
              name: 'Motivo ticket',
              to: { name: 'MotiveTicket' }
            },
            {
              name: 'Prioridad ticket',
              to: { name: 'PriorityTicket' }
            },
            {
              name: 'Sección',
              to: { name: 'Section' }
            },
            {
              name: 'Origen Ticket',
              to: { name: 'SourceTicket' }
            },
            {
              name: 'Intento Contacto',
              to: { name: 'StatusDetailTicket' }
            },
            {
              name: 'Rol Usuario',
              to: { name: 'Role' }
            },
            {
              name: 'Perfil Plataforma',
              to: { name: 'Profile' }
            },
            {
              name: 'Categoría',
              to: { name: 'Category' }
            },
            {
              name: 'Curso',
              to: { name: 'Course' }
            }
          ]
        },
        {
          name: 'Configuración',
          icon: 'mdi-cog-outline',
          links: [
            { name: 'Cargar estudiantes', to: { name: 'LoadStudents' } },
            {
              name: 'Actividades',
              to: { name: 'Activity' }
            }
          ]
        }
      ]
    }
  }),
  props: {
    drawer: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user'
    }),
    drawerLocal: {
      get: function() {
        return this.drawer
      },
      set: function(value) {
        this.$emit('update:drawer', value)
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
