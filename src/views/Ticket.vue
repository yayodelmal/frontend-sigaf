<template>
  <div>
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
                              <v-spacer />
                              <v-col cols="10" sm="4" md="4">
                                <base-textfield
                                  label="Rut"
                                  required
                                  color="blueS"
                                  v-model="rut"
                                  clearable
                                  loading
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
                              <v-spacer />
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
        :items="ticketsComputed"
        :page.sync="page"
        :items-per-page="itemsPerPage"
        hide-default-footer
        class="elevation-1"
        @page-count="pageCount = $event"
        :loading="loading"
        loading-text="Cargando... por favor espere"
      >
        <template v-slot:item.priority="{ item }">
          <v-chip :color="getColor(item.priority)" dark>{{
            item.priority
          }}</v-chip>
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
  </div>
</template>

<script>
import axios from '../services/axios'
export default {
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      search: '',
      loading: false,
      headers: [
        {
          text: '#',
          align: 'start',
          sortable: false,
          value: 'id'
        },
        { text: 'RUT', value: 'rut' },
        { text: 'Nombre participante', value: 'name' },
        { text: 'Tipo', value: 'type' },
        { text: 'Estado', value: 'status' },
        { text: 'Prioridad', value: 'priority' },
        { text: 'Opciones', value: 'actions', sortable: false }
      ],
      courses: [],
      course: {
        id: 0
      },
      tickets: [],
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
    getColor(priority) {
      if (priority === 'Urgente') return 'red'
      else if (priority === 'Normal') return 'orange'
      else return 'green'
    },
    getDay(date) {
      const daysOfWeek = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do']
      let i = new Date(date).getDay(date)
      return daysOfWeek[i]
    },
    async fetchCourseRegisteredUser() {
      const { data } = await axios.get('v1/course-registered-user')
      console.log(data)

      if (data.success) {
        this.usersCourse = data.data
      }
    },
    async fetchCourses() {
      const { data } = await axios.get('v1/courses')

      if (data.success) {
        this.courses = data.data
        this.courses.push({ id: 0, description: 'Todos', status: 1 })
      }
    },
    async fetchTickets() {
      this.loading = true
      const { data } = await axios.get('v1/tickets')

      if (data.success) {
        this.tickets = data.tickets
        this.loading = false
      }
    },
    async fetchUserByRut() {
      const { data } = await axios.get(`v1/registered-user/${this.rut}`)

      console.log(data)
      this.userCourse = data.registeredUser

      const userInter = this.usersCourse.filter(userCourse => {
        return userCourse.registered_user.id === this.userCourse.id
      })[0]
      this.user = userInter
    }
  },
  created() {
    this.fetchCourseRegisteredUser()
    this.fetchCourses()
    this.fetchTickets()
    this.fetchUserByRut()
  },
  watch: {
    courseId() {
      if (this.courseId !== 0) {
        this.ticketsComputed.filter(ticket => {
          console.log(ticket)
          return ticket.course.id === this.courseId
        })
      }
    }
  },
  computed: {
    coursesComputed() {
      return this.courses
        .map(course => {
          return {
            id: course.id,
            name: course.description,
            status: course.status
          }
        })
        .filter(course => {
          return course.status === 1
        })
    },
    ticketsComputed() {
      if (this.courseId !== 0) {
        return this.tickets
          .map(ticket => {
            return {
              id: ticket.id,
              course: ticket.courseRegisteredUser.course,
              name: ticket.courseRegisteredUser.registered_user.name_registered_moodle.toUpperCase(),
              rut: ticket.courseRegisteredUser.registered_user.rut_registered_moodle.toUpperCase(),
              email: ticket.courseRegisteredUser.registered_user.email_registered_moodle.toLowerCase(),
              phone: ticket.courseRegisteredUser.registered_user.mobile,
              lastAccess:
                ticket.courseRegisteredUser.last_access_registered_moodle,
              type: ticket.inOutTicket.description,
              motive: ticket.motiveTicket.description,
              priority: ticket.priorityTicket.description,
              status: ticket.statusTicket.description
            }
          })
          .filter(ticket => {
            return ticket.course.id === this.courseId
          })
      } else {
        return this.tickets.map(ticket => {
          return {
            id: ticket.id,
            course: ticket.courseRegisteredUser.course,
            name: ticket.courseRegisteredUser.registered_user.name_registered_moodle.toUpperCase(),
            rut: ticket.courseRegisteredUser.registered_user.rut_registered_moodle.toUpperCase(),
            email: ticket.courseRegisteredUser.registered_user.email_registered_moodle.toLowerCase(),
            phone: ticket.courseRegisteredUser.registered_user.mobile,
            lastAccess:
              ticket.courseRegisteredUser.last_access_registered_moodle,
            type: ticket.inOutTicket.description,
            motive: ticket.motiveTicket.description,
            priority: ticket.priorityTicket.description,
            status: ticket.statusTicket.description
          }
        })
      }
    },
    courseId() {
      return this.course.id
    }
  }
}
</script>

<style lang="sass" scoped></style>
