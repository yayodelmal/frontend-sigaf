<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    dark
    :expand-on-hover="hover"
    width="260"
    mobile-breakpoint="960"
    v-bind="$attrs"
  >
    <v-list>
      <v-list-item class="px-2">
        <v-list-item-avatar>
          <v-avatar color="redS">
            <span class="white--text headline">{{ getAvatarName }}</span>
          </v-avatar>
          <!-- <v-img src="https://randomuser.me/api/portraits/men/85.jpg"></v-img> -->
        </v-list-item-avatar>
        <v-list-item-title class="title">{{
          user !== null ? user.name : ''
        }}</v-list-item-title>
      </v-list-item>
      <v-list-item class="px-2">
        <v-list-item-avatar>
          <v-avatar color="whiteS">
            <span class="blueS--text headline">{{ getAvatarRole }}</span>
          </v-avatar>
          <!-- <span class="white--text headline">CJ</span> -->
        </v-list-item-avatar>
        <v-list-item-subtitle class="mt-3"
          ><span class="mr-2">
            Rol:
          </span>
          {{ user !== null ? user.role.description : '' }}
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>

    <v-list dense nav shaped>
      <v-list-item
        v-for="link in getPrivilegesMainLinks"
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

    <v-list v-if="isAdmin" dense nav shaped>
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
import { mapGetters, mapActions, mapState, mapMutations } from 'vuex'
export default {
  name: 'NavigationDrawerApp',
  props: {
    breakpoint: String
  },

  data: () => ({
    mini: true,
    links: {
      main: [
        {
          name: 'Dashboard',
          icon: 'mdi-view-dashboard',
          to: { name: 'Dashboard' },
          privileges: ['Administrador']
        },
        {
          name: 'Seguimiento',
          icon: 'mdi-google-classroom',
          to: { name: 'FollowUp' },
          privileges: ['Administrador', 'Tutor', 'Operador']
        },
        {
          name: 'Ticket',
          icon: 'mdi-ticket-account',
          to: { name: 'Ticket' },
          privileges: ['Administrador', 'Operador']
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
            },
            { name: 'Usuario', to: { name: 'User' } }
          ]
        },
        {
          name: 'Configuración',
          icon: 'mdi-cog-outline',
          links: [
            { name: 'Matrícula', to: { name: 'LoadStudents' } },
            { name: 'Conformar aulas', to: { name: 'BuildClassrooms' } },
            {
              name: 'Actividades',
              to: { name: 'Activity' }
            },
            {
              name: 'Gestión estudiantes',
              to: { name: 'ManagementStudent' }
            }
          ]
        }
      ]
    }
  }),
  // props: {
  //   // drawer: {
  //   //   type: Boolean
  //   // },
  // },
  created() {
    this.attempt(localStorage.getItem('access_token'))
  },
  computed: {
    ...mapState(['drawer']),
    ...mapGetters({
      user: 'auth/user',
      isAdmin: 'auth/isAdmin',
      isTutor: 'auth/isTutor',
      isOperator: 'auth/isOperator',
      role: 'auth/typeRole'
    }),
    hover() {
      switch (this.$vuetify.breakpoint.name) {
        case 'md':
          return true
        case 'lg':
          return false
        case 'xl':
          return true
        default:
          return false
      }
    },
    getAvatarName() {
      if (this.user) {
        const splitName = this.user.name.split(' ')
        return `${splitName[0].charAt(0)}${splitName[1].charAt(0)}`
      } else {
        return ''
      }
    },
    getAvatarRole() {
      if (this.user) {
        const role = this.user.role.description
        return `${role.charAt(0)}${role.charAt(1)}`
      } else {
        return ''
      }
    },
    getPrivilegesMainLinks() {
      return this.links.main.filter(link =>
        link.privileges.includes(this.role.description)
      )
    },
    // drawerLocal: {
    //   get: function() {
    //     return this.drawer
    //   },
    //   set: function(value) {
    //     this.$emit('update:drawer', value)
    //   }
    // },
    drawer: {
      get() {
        return this.$store.state.drawer
      },
      set(val) {
        this.$store.commit('SET_DRAWER', val)
      }
    }
    // bp() {
    //   return this.breakpoint === 'sm' || this.breakpoint === 'xs'
    // }
  },
  methods: {
    ...mapMutations({
      setDrawer: 'SET_DRAWER'
    }),
    ...mapActions({
      attempt: 'auth/attempt'
    })
  }
}
</script>

<style lang="scss" scoped></style>
