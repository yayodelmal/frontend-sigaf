<template>
  <v-row justify="center" align="center">
    <v-col cols="10">
      <base-card
        color="blueS"
        class="px-5 py-3"
        icon="mdi-ticket-account"
        title="Ticket"
      >
        <template v-slot:searchInput>
          <v-row justify="center">
            <v-col cols="12" md="6">
              <base-autocomplete
                v-model="course.id"
                :items="coursesComputed"
                label="Cursos"
                item-value="id"
                item-text="name"
              >
              </base-autocomplete>
            </v-col>
            <v-col cols="12" md="3">
              <base-textfield
                v-model="search"
                append-icon="mdi-magnify"
                label="Buscar"
                single-line
              ></base-textfield>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="12" md="2">
              <v-dialog
                v-model="dialog"
                fullscreen
                hide-overlay
                transition="dialog-bottom-transition"
              >
                <template v-slot:activator="{ on }">
                  <base-button
                    icon="mdi-plus-circle"
                    v-on="on"
                    label="Crear Ticket"
                  ></base-button>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">Ticket</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-stepper alt-labels non-linear v-model="e1">
                        <v-stepper-header>
                          <v-stepper-step
                            color="redS"
                            dark
                            editable
                            :complete="e1 > 1"
                            step="1"
                            >Usuario</v-stepper-step
                          >
                          <v-divider></v-divider>
                          <v-stepper-step
                            color="redS"
                            dark
                            editable
                            :complete="e1 > 2"
                            step="2"
                            >Ticket</v-stepper-step
                          >
                          <v-divider></v-divider>
                          <v-stepper-step color="redS" dark editable step="3"
                            >Detalle</v-stepper-step
                          >
                        </v-stepper-header>
                        <v-stepper-items>
                          <v-stepper-content step="1">
                            <form @keydown.enter.prevent="fetchUserByRut()">
                              <v-row>
                                <v-col cols="12" sm="6" md="6">
                                  <v-label>Último acceso:</v-label>
                                  <v-chip
                                    v-if="user"
                                    :color="colorLastAccess"
                                    label
                                    dark
                                    class="ma-2"
                                  >
                                    <v-icon left>{{ iconLastAccess }}</v-icon>
                                    {{ user.last_access_registered_moodle }}
                                  </v-chip>
                                </v-col>
                                <v-spacer />
                                <v-col cols="10" sm="4" md="4">
                                  <base-textfield
                                    label="Rut"
                                    required
                                    color="blueS"
                                    v-model="rut"
                                    clearable
                                    :loading="searchRutLoading"
                                    hint="Formato 12.345.678-9"
                                  ></base-textfield>
                                </v-col>
                                <v-col cols="2" sm="1" md="1">
                                  <v-btn
                                    color="blueS"
                                    elevation="1"
                                    fab
                                    small
                                    dark
                                    @click.stop="fetchUserByRut()"
                                  >
                                    <v-icon>mdi-magnify</v-icon>
                                  </v-btn>
                                </v-col>
                              </v-row>
                            </form>
                            <v-row>
                              <v-col cols="12" sm="6" md="6">
                                <base-textfield
                                  label="Nombre"
                                  required
                                  color="blueS"
                                  v-model="
                                    user.registered_user.name_registered_moodle
                                  "
                                ></base-textfield>
                              </v-col>
                              <v-col cols="12" sm="6" md="6">
                                <base-textfield
                                  label="Correo electrónico"
                                  required
                                  color="blueS"
                                  v-model="
                                    user.registered_user.email_registered_moodle
                                  "
                                ></base-textfield>
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col cols="12">
                                <base-textfield
                                  label="Curso"
                                  required
                                  dense
                                  v-model="user.course.description"
                                ></base-textfield>
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col cols="12">
                                <base-textfield
                                  label="Test"
                                  type="password"
                                ></base-textfield>
                              </v-col>
                            </v-row>
                            <base-button
                              @click="e1 = 2"
                              icon="mdi-arrow-right-bold-circle"
                              label="Continuar"
                            ></base-button>

                            <v-btn text color="grayS">
                              <v-icon size="30" left>mdi-close-circle</v-icon>
                              Cancelar</v-btn
                            >
                          </v-stepper-content>

                          <v-stepper-content step="2">
                            <v-row>
                              <v-col cols="12" sm="4">
                                <base-autocomplete
                                  :items="['Urgente', 'Alta', 'Media', 'Baja']"
                                  label="Prioridad"
                                ></base-autocomplete>
                              </v-col>
                              <v-col cols="12" sm="4">
                                <v-combobox
                                  :items="['Tipo 1', 'Tipo 2']"
                                  label="Tipo"
                                  chips
                                >
                                  <template v-slot:selection="data">
                                    <v-chip
                                      :key="JSON.stringify(data.item)"
                                      v-bind="data.attrs"
                                      :input-value="data.selected"
                                      :disabled="data.disabled"
                                      @click:close="
                                        data.parent.selectItem(data.item)
                                      "
                                    >
                                      <v-avatar
                                        class="red white--text"
                                        left
                                        v-text="
                                          data.item.slice(0, 1).toUpperCase()
                                        "
                                      ></v-avatar>
                                      {{ data.item }}
                                    </v-chip>
                                  </template></v-combobox
                                >
                              </v-col>
                              <v-col cols="12" sm="4">
                                <v-autocomplete
                                  :items="['Motivo 1', 'Motivo 2']"
                                  label="Motivo"
                                ></v-autocomplete>
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col cols="12" sm="6" md="4">
                                <v-menu
                                  v-model="menu"
                                  :close-on-content-click="false"
                                  :nudge-right="40"
                                  transition="scale-transition"
                                  offset-y
                                  min-width="290px"
                                >
                                  <template v-slot:activator="{ on }">
                                    <base-textfield
                                      v-model="date"
                                      label="Fecha apertura"
                                      readonly
                                      v-on="on"
                                    ></base-textfield>
                                  </template>
                                  <v-date-picker
                                    :weekday-format="getDay"
                                    show-week
                                    landscape
                                    locale="es"
                                    v-model="date"
                                    header-color="blueS"
                                    color="redS"
                                    @input="menu = false"
                                  ></v-date-picker>
                                </v-menu>
                              </v-col>
                              <v-col cols="12" sm="4">
                                <v-autocomplete
                                  :items="['Tipo 1', 'Tipo 2']"
                                  label="Tipo"
                                ></v-autocomplete>
                              </v-col>
                              <v-col cols="12" sm="4">
                                <v-autocomplete
                                  :items="['Motivo 1', 'Motivo 2']"
                                  label="Motivo"
                                ></v-autocomplete>
                              </v-col>
                            </v-row>

                            <base-button
                              @click="e1 = 3"
                              icon="mdi-arrow-right-bold-circle"
                              label="Continuar"
                            ></base-button>

                            <v-btn text color="grayS">
                              <v-icon size="30" left>mdi-close-circle</v-icon>
                              Cancelar</v-btn
                            >
                          </v-stepper-content>

                          <v-stepper-content step="3">
                            <v-card
                              class="mb-12"
                              color="grey lighten-1"
                              height="200px"
                            ></v-card>

                            <base-button
                              @click="e1 = 1"
                              icon="mdi-arrow-right-bold-circle"
                              label="Continuar"
                            ></base-button>

                            <v-btn text color="grayS">
                              <v-icon size="30" left>mdi-close-circle</v-icon>
                              Cancelar</v-btn
                            >
                          </v-stepper-content>
                        </v-stepper-items>
                      </v-stepper>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blueS" text @click="dialog = false"
                      >Cerrar</v-btn
                    >
                    <v-btn color="blueS" text @click="dialog = false"
                      >Crear ticket</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
          </v-row>
        </template>
        <v-data-table
          :headers="headers"
          :search="search"
          :items="tickets"
          :page.sync="page"
          :items-per-page="itemsPerPage"
          hide-default-footer
          class="elevation-1"
          @page-count="pageCount = $event"
          :loading="loading"
          loading-text="Cargando... por favor espere"
        >
          <template
            v-slot:item.courseRegisteredUser.registered_user.rut_registered_moodle="{
              item
            }"
          >
            {{
              item.courseRegisteredUser.registered_user.rut_registered_moodle.toUpperCase()
            }}
          </template>
          <template
            v-slot:item.courseRegisteredUser.registered_user.name_registered_moodle="{
              item
            }"
          >
            <v-tooltip color="blueS" bottom>
              <template v-slot:activator="{ on }">
                <v-label v-on="on">
                  {{
                    item.courseRegisteredUser.registered_user.name_registered_moodle.toUpperCase()
                  }}</v-label
                >
              </template>
              <span>{{ item.courseRegisteredUser.course.description }}</span>
            </v-tooltip>
          </template>
          <template v-slot:item.typeTicket.description="{ item }">
            <v-tooltip color="blueS" bottom>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on">{{
                  getTypeTicket(item.typeTicket.description)
                }}</v-icon>
              </template>
              <span>{{ item.typeTicket.description }}</span>
            </v-tooltip>
          </template>
          <template v-slot:item.statusTicket.description="{ item }">
            <v-tooltip color="blueS" bottom>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on">{{
                  getStatusTicket(item.statusTicket.description)
                }}</v-icon>
              </template>
              <span>{{ item.statusTicket.description }}</span>
            </v-tooltip>
          </template>
          <template v-slot:item.priorityTicket.description="{ item }">
            <v-chip
              small
              :color="getColor(item.priorityTicket.description)"
              dark
              label
              >{{ item.priorityTicket.description.toUpperCase() }}</v-chip
            >
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon class="mr-2" @click.prevent="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon @click.prevent="deleteItem(item)">
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
        <template v-slot:actions>
          <div class="text-center pt-2">
            <v-pagination
              color="redS"
              v-model="page"
              :length="pageCount"
            ></v-pagination>
          </div>
        </template>
      </base-card>
    </v-col>
  </v-row>
</template>

<script>
import axios from '../services/axios'
import { mapActions, mapGetters } from 'vuex'
export default {
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      search: '',
      loading: false,
      searchRutLoading: false,
      headers: [
        {
          text: '#',
          align: 'start',
          sortable: false,
          value: 'id'
        },
        {
          text: 'RUT',
          value: 'courseRegisteredUser.registered_user.rut_registered_moodle'
        },
        {
          text: 'Nombre participante',
          value: 'courseRegisteredUser.registered_user.name_registered_moodle'
        },
        { text: 'Tipo', value: 'typeTicket.description' },
        { text: 'Estado', value: 'statusTicket.description' },
        {
          text: 'Prioridad',
          value: 'priorityTicket.description'
        },
        { text: 'Opciones', value: 'actions', sortable: false }
      ],
      courses: [],
      course: {
        id: 0
      },
      ticket: {},
      usersCourse: [],
      userCourse: {},
      dialog: false,
      date: new Date().toISOString().substr(0, 10),
      menu: false,
      user: {
        registered_user: {},
        course: {}
      },
      rut: '17.057.394-3',
      e1: 1
    }
  },
  methods: {
    ...mapActions({
      fetchItems: 'ticket/fetchTickets'
    }),
    getColor(priority) {
      if (priority === 'Alta') return 'red'
      else if (priority === 'Media') return 'orange'
      else return 'green'
    },
    getTypeTicket(type) {
      if (type === 'Correo electrónico') return 'mdi-email'
      else if (type === 'Contacto telefónico') return 'mdi-phone'
      else return 'error'
    },
    getStatusTicket(status) {
      if (status === 'Abierto') return 'mdi-lock-open'
      else if (status === 'Cerrado') return 'mdi-lock'
      else return 'error'
    },
    getDay(date) {
      const daysOfWeek = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do']
      let i = new Date(date).getDay(date)
      return daysOfWeek[i]
    },
    async fetchCourseRegisteredUser() {
      const { data } = await axios.get('/api/v2/course-registered-user')
      console.log(data)

      if (data.success) {
        this.usersCourse = data.data
      }
    },
    async fetchCourses() {
      const { data } = await axios.get('/api/v2/courses')

      if (data.success) {
        this.courses = data._data.collections
        console.log(this.courses)
        this.courses.push({
          properties: { id: 0, description: 'Todos', status: 1 }
        })
      }
    },
    async fetchUserByRut() {
      this.searchRutLoading = true

      setTimeout(async () => {
        const { data } = await axios.get(`/api/v2/registered-user/${this.rut}`)

        console.log(data)
        this.userCourse = data.registeredUser

        const userInter = this.usersCourse.filter(userCourse => {
          return userCourse.registered_user.id === this.userCourse.id
        })[0]
        this.user = userInter

        this.findActivity(this.user.id)

        this.searchRutLoading = false
      }, 1000)
    },
    async findActivity(id) {
      const { data } = await axios.get(
        `/api/v2/activity-course-registered-user/${id}`
      )

      console.log(data)
    }
  },
  created() {
    this.fetchCourseRegisteredUser()
    this.fetchCourses()
    // this.fetchTickets()
    this.fetchUserByRut()
    this.fetchItems()
  },
  watch: {},
  computed: {
    ...mapGetters({
      items: 'ticket/tickets'
    }),
    colorLastAccess() {
      return this.user.last_access_registered_moodle === 'Nunca'
        ? 'redS'
        : 'blueS'
    },
    iconLastAccess() {
      return this.user.last_access_registered_moodle === 'Nunca'
        ? 'mdi-alert-circle'
        : 'mdi-check-circle'
    },
    coursesComputed() {
      return this.courses
        .map(course => {
          return {
            id: course.properties.id,
            name: course.properties.description,
            status: course.properties.status
          }
        })
        .filter(course => {
          return course.status === 1
        })
    },
    tickets() {
      if (this.courseId !== 0) {
        return this.items.filter(ticket => {
          return ticket.courseRegisteredUser.course.id === this.courseId
        })
      } else {
        return this.items
      }
    },
    courseId() {
      return this.course.id
    }
  }
}
</script>

<style lang="sass" scoped></style>
