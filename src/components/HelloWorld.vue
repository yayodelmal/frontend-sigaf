<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list dense>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-settings</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Application</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-card>
            <v-card-title>
              Ticket
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
              ></v-text-field>
            </v-card-title>
            <v-data-table
              calculate-widths
              dense
              :headers="headers"
              :items="alerts"
              :search="search"
            ></v-data-table>
          </v-card>
        </v-row>
      </v-container>
    </v-content>

    <v-footer app>
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      test: {},
      alerts: [],
      headers: [
        {
          text: 'Alumno',
          value: 'alumno'
        },
        {
          text: 'Curso',
          value: 'curso'
        }
      ],
      search: '',
      drawer: null
    }
  },
  created() {
    this.$vuetify.theme.dark = true
  },
  mounted: function() {
    this.fetchAlerts()
  },
  methods: {
    async fetchAlerts() {
      const data = await fetch('http://127.0.0.1:8002/api/alert')

      const json = await data.json()

      console.log(json)

      json.data.forEach(alert => {
        this.alerts.push({
          alumno:
            alert.ticket.course_registered_user.registered_user
              .name_registered_moodle,
          curso: alert.ticket.course_registered_user.course.description
        })
      })

      console.log(this.alerts)
    }
  }
}
</script>
