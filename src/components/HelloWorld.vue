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
          <div class="my-2">
            <v-btn v-on:click="postAlert" small color="primary">Primary</v-btn>
          </div>
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
              :items="alertsDataTable"
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
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'HelloWorld',
  data() {
    return {
      test: {
        id: 1,
        description: 'una descripción',
        commit: {
          valor: 5,
          unaFuncion: function(data) {
            return data + ' soy una function'
          }
        }
      },
      tests: ['amarillo', 'azul', 'rojo'],
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
    this.fetchAlerts()
  },
  computed: {
    alertsDataTable() {
      return this.alerts.map(formatData => {
        return {
          alumno:
            formatData.ticket.course_registered_user.registered_user
              .name_registered_moodle,
          curso: formatData.ticket.course_registered_user.course.description
        }
      })
    },
    ...mapGetters(['alerts'])
  },
  methods: {
    ...mapActions(['postAlert', 'fetchAlerts'])
  }
}
</script>
