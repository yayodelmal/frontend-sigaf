<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    color="blueS darken-1"
    dark
    :expand-on-hover="hover"
    width="260"
    mobile-breakpoint="960"
    v-bind="$attrs"
  >
    <!-- <v-list color="white">
      <v-list-item>
        <v-img
          contain
          max-height="50"
          src="..\..\assets\iie_iso@2x.png"
        ></v-img>
      </v-list-item>
    </v-list> -->

    <v-list elevation="10" height="64">
      <v-list-item two-line class="px-2 mt-n3">
        <v-list-item-avatar>
          <v-avatar color="redS">
            <span class="white--text headline">{{ getAvatarName }}</span>
          </v-avatar>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{
            user !== null ? user.name : ''
          }}</v-list-item-title>
          <v-list-item-subtitle>
            {{
              user !== null ? user.role.description : ''
            }}</v-list-item-subtitle
          >
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

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

    <v-list dense nav shaped>
      <v-list-group
        v-for="(link, index) in links.secondary"
        :key="index"
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
          v-for="internalLink in getPrivilegesSecondaryLinks(index)"
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

    <template v-slot:append>
      <v-list nav>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              <v-btn
                dark
                color="blueS"
                @click="showLogoutConfirmation"
                depressed
                block
                >Cerrar sesión</v-btn
              >
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>
    <!-- <v-dialog v-model="dialog" max-width="350">
      <v-card>
        <v-toolbar flat color="blueS" dark dense>
          <v-toolbar-title>SIGAF</v-toolbar-title>
        </v-toolbar>

        <v-card-text class="text-center title my-6">
          ¿Cerrar sesión?
        </v-card-text>

        <v-divider />
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn outlined @click="dialog = false">
            CANCELAR
          </v-btn>
          <v-btn color="blueS" dark depressed @click="logout">
            ACEPTAR
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->
    <confirm-dialog
      :icon="'mdi-exit-to-app'"
      :color-icon="'blueS'"
      :dialog="dialog"
      :cancel="closeDialog"
      :accept="logout"
    >
      <template v-slot:content>
        <h3 class="text-body-1">¿Cerrar sesión?</h3>
      </template>
    </confirm-dialog>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters, mapActions, mapState, mapMutations } from 'vuex'
import ConfirmDialog from '../component/ConfirmCard'

export default {
  name: 'NavigationDrawerApp',
  props: {
    breakpoint: String
  },
  components: {
    'confirm-dialog': ConfirmDialog
  },
  data: () => ({
    links: {
      main: [
        {
          name: 'Dashboard',
          icon: 'mdi-view-dashboard',
          to: { name: 'Dashboard' },
          privileges: ['Administrador', 'Developer']
        },
        {
          name: 'Seguimiento',
          icon: 'mdi-google-classroom',
          to: { name: 'FollowUp' },
          privileges: ['Administrador', 'Tutor', 'Operador', 'Developer']
        },
        {
          name: 'Ticket',
          icon: 'mdi-ticket-account',
          to: { name: 'Ticket' },
          privileges: ['Administrador', 'Operador', 'Developer']
        }
      ],
      secondary: [
        {
          name: 'Mantenedor',
          icon: 'mdi-hammer-wrench',
          links: [
            {
              name: 'Aula',
              to: { name: 'Classroom' },
              privileges: ['Administrador', 'Developer']
            },
            {
              name: 'Estado ticket',
              to: { name: 'StatusTicket' },
              privileges: ['Developer']
            },
            {
              name: 'Estado final alumno',
              to: { name: 'FinalStatus' },
              privileges: ['Developer']
            },
            {
              name: 'Tipo ticket',
              to: { name: 'TypeTicket' },
              privileges: ['Developer']
            },
            {
              name: 'Motivo ticket',
              to: { name: 'MotiveTicket' },
              privileges: ['Developer']
            },
            {
              name: 'Prioridad ticket',
              to: { name: 'PriorityTicket' },
              privileges: ['Developer']
            },
            {
              name: 'Sección',
              to: { name: 'Section' },
              privileges: ['Administrador', 'Developer']
            },
            {
              name: 'Origen Ticket',
              to: { name: 'SourceTicket' },
              privileges: ['Developer']
            },
            {
              name: 'Intento Contacto',
              to: { name: 'StatusDetailTicket' },
              privileges: ['Developer']
            },
            {
              name: 'Rol Usuario',
              to: { name: 'Role' },
              privileges: ['Developer']
            },
            {
              name: 'Perfil Plataforma',
              to: { name: 'Profile' },
              privileges: ['Developer']
            },
            {
              name: 'Categoría',
              to: { name: 'Category' },
              privileges: ['Administrador', 'Developer']
            },
            {
              name: 'Curso',
              to: { name: 'Course' },
              privileges: ['Administrador', 'Developer']
            },
            {
              name: 'Usuario',
              to: { name: 'User' },
              privileges: ['Administrador', 'Developer']
            }
          ]
        },
        {
          name: 'Configuración',
          icon: 'mdi-cog-outline',
          links: [
            {
              name: 'Matrícula',
              to: { name: 'LoadStudents' },
              privileges: ['Administrador', 'Developer']
            },
            {
              name: 'Conformar aulas',
              to: { name: 'BuildClassrooms' },
              privileges: ['Administrador', 'Developer']
            },
            {
              name: 'Actividades',
              to: { name: 'Activity' },
              privileges: ['Administrador', 'Developer']
            },
            {
              name: 'Gestión estudiantes',
              to: { name: 'ManagementStudent' },
              privileges: ['Administrador', 'Developer']
            }
          ]
        }
      ]
    },
    dialog: false
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
          return false
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
    },
    mini() {
      switch (this.$vuetify.breakpoint.name) {
        case 'md':
          return false
        case 'lg':
          return true
        case 'xl':
          return true
        default:
          return false
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
      attempt: 'auth/attempt',
      logoutStore: 'auth/logout'
    }),
    getPrivilegesSecondaryLinks(index) {
      return this.links.secondary[index].links.filter(link =>
        link.privileges.includes(this.role.description)
      )
    },
    closeDialog() {
      this.dialog = false
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
  }
}
</script>

<style lang="scss" scoped></style>
