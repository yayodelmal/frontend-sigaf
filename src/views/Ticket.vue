<template>
  <v-container fluid>
    <base-card
      color="blueS"
      class="px-5 py-3"
      icon="mdi-ticket-account"
      title="Ticket"
    >
      <v-col cols="12">
        <sigaf-category-course-toolbar
          @showTable="showTable = $event"
          @loading="loading = $event"
          @selectedCourse="selectedCourse = $event"
        ></sigaf-category-course-toolbar>
      </v-col>
      <v-card v-if="showTable" flat>
        <v-card-title>
          <v-col cols="12">
            <v-card flat outlined>
              <v-card-text>
                <v-row justify="center">
                  <v-col cols="12" sm="12" md="7" lg="6">
                    <base-button
                      icon="mdi-plus-circle"
                      label="Crear ticket individual"
                      @click="openCreateSingleModal"
                    ></base-button>
                  </v-col>
                  <v-col cols="12" sm="12" md="5" lg="6">
                    <base-button
                      v-if="isAdmin || isDeveloper"
                      icon="mdi-plus-circle"
                      label="Crear Ticket Masivo"
                      @click="handleCreateMultipleTickets"
                    ></base-button>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-toolbar dark color="blueS darken-1" class="mb-1">
              <v-text-field
                v-model="search"
                color="blueS"
                clearable
                flat
                solo-inverted
                hide-details
                prepend-inner-icon="mdi-magnify"
                label="Buscar"
              ></v-text-field>
              <v-spacer />
              <v-checkbox v-model="openTicket" label="Abierto"></v-checkbox>
              <v-checkbox
                class="ml-10"
                v-model="closeTicket"
                label="Cerrado"
              ></v-checkbox>
            </v-toolbar>
          </v-col>
        </v-card-title>
        <v-card-text>
          <div v-if="loading">
            <v-skeleton-loader
              :loading="loading"
              :transition="transition"
              class="mx-auto"
              type="table-tbody"
            ></v-skeleton-loader>
            <v-skeleton-loader
              :loading="loading"
              :transition="transition"
              class="mx-auto"
              type="table-tfoot"
            ></v-skeleton-loader>
          </div>
          <s-table-ticket
            v-else
            :loading="loading"
            :tickets="tickets"
            :search="search"
            @editTicket="editItem"
          />
        </v-card-text>
      </v-card>

      <sigaf-create-single-ticket
        v-if="showSingleCreateModal"
        v-model="singleCreateModal"
        :selectedCourse="selectedCourse"
        @closeModal="closeCreatedSingleModal($event)"
      ></sigaf-create-single-ticket>

      <sigaf-edit-single-ticket
        v-if="showSingleEditModal"
        v-model="singleEditModal"
        :selectedCourse="selectedCourse"
        :ticket="editedTicketItem"
        :ticket-details="editedTicketDetails"
        @closeModal="closeEditedSingleModal($event)"
      ></sigaf-edit-single-ticket>

      <v-overlay
        :value="overlayCreateMultipleTicket"
        color="grayS"
        :opacity="opacity"
        z-index="99"
      >
        <h3 class="text-body-1 text-center mb-16">
          {{ overlayMessageCreateMultipleTicket }}
        </h3>
        <div class="text-center">
          <v-progress-circular indeterminate size="64"> </v-progress-circular>
        </div>
      </v-overlay>
      <sigaf-create-multiple-ticket
        v-if="showMultipleCreateModal"
        v-model="multipleCreateModal"
        :selectedCourse="selectedCourse"
        :courseRegisteredUsers="courseRegisteredUserItems"
      >
      </sigaf-create-multiple-ticket>

      <v-snackbar
        @snackbar="setSnackbar($event)"
        color="blueS"
        v-model="snackbar"
        :timeout="timeout"
      >
        {{ message }}
        <v-btn dark text @click="snackbar = false">
          Cerrar
        </v-btn>
      </v-snackbar>

      <confirm-dialog
        :icon="'mdi-alert-circle-outline'"
        :color-icon="'warning'"
        :dialog="dialogConfirm"
        :cancel="close"
        :accept="confirmDelete"
      >
        <template v-slot:content>
          <h3 class="text-button">
            Eliminará un registro de forma permanente
          </h3>
        </template>
      </confirm-dialog>
      <v-dialog v-model="dialogSelectCourse" max-width="400">
        <v-card>
          <v-card-title class="headline text-center"
            >Seleccione un curso:</v-card-title
          >
          <v-card-text>
            <v-hover
              v-for="user in arrayCourseUserSelect"
              :key="user.course.id"
              v-slot:default="{ hover }"
              close-delay="100"
            >
              <v-card
                class="mt-3"
                :elevation="hover ? 6 : 0"
                flat
                @click="selectCourse(user)"
              >
                <v-card-text class="font-weight-medium text-center subtitle-1">
                  {{ user.course.description }}
                </v-card-text>
              </v-card>
            </v-hover>
          </v-card-text>
        </v-card>
      </v-dialog>
    </base-card>
    <v-overlay :value="overlay" color="grayS" :opacity="opacity">
      <h3 class="text-body-2 text-center mb-16">
        Por favor espere. Esto puede tardar un momento
      </h3>
      <div class="text-center">
        <v-progress-circular indeterminate size="64"> </v-progress-circular>
      </div>
      <h3 class="headline text-center mt-5">
        Generando tickets...
      </h3>
    </v-overlay>
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

import axios from '../services/axios'
import Ticket from '../models/Ticket'
import DetailTicket from '@/models/DetailTicket'
import ConfirmDialog from '../components/component/ConfirmCard'
import SigafCategoryCourseToolbar from '../components/utility/SigafCategoryCourseToolbar.vue'
import SigafCreateSingleTicket from '@/components/ticket/single/SigafCreateSingleTicket.vue'
import SigafEditSingleTicket from '@/components/ticket/single/SigafEditSingleTicket.vue'
import SigafCreateMultipleTicket from '@/components/ticket/multiple/SigafCreateMultipleTicket.vue'
import STableTicket from '../components/ticket/STableTicket.vue'

Array.prototype.forEachAsyncCustom = function(fn) {
  return this.reduce(
    (promise, n, index) => promise.then(() => fn(n, index)),
    Promise.resolve()
  )
}

export default {
  inject: ['theme'],
  components: {
    ConfirmDialog,
    SigafCategoryCourseToolbar,
    SigafCreateSingleTicket,
    SigafEditSingleTicket,
    SigafCreateMultipleTicket,
    STableTicket
  },
  data() {
    return {
      singleCreateModal: false,
      singleEditModal: false,
      multipleCreateModal: false,
      showMultipleCreateModal: false,
      search: '',
      loading: false,
      courses: [],
      course: {
        id: 0
      },
      category: null,
      categoryMassiveTicket: null,
      priority: null,
      status: null,
      operator: null,
      statusDetail: null,
      statusDetailMasive: null,
      observation: '',
      classrooms: [],
      userRegisteredFiltered: [],
      ticket: {},
      usersCourse: [],
      userCourse: {},
      dialog: false,
      dialogMassive: false,
      singleSelect: false,
      selected: [],
      menu: false,
      user: null,
      message: '',
      successMessage: 'Operación realizada con éxito.',
      errorMEssage: 'Ha ocurrido un error.',
      snackbar: false,
      timeout: 3000,
      editedTicketIndex: -1,
      editedTicketItem: null,
      defaultTicketItem: new Ticket(),
      editedDetailTicketItem: new DetailTicket(),
      defaultDetailTicketItem: new DetailTicket(),
      editItem_: new Ticket(),
      ticketDetailsItems: [],
      dialogConfirm: false,
      openTicket: true,
      closeTicket: false,
      showStatusDetailTicket: true,
      dialogSelectCourse: false,
      arrayCourseUserSelect: [],
      currentCourseUser: {},
      ticketClose: false,
      overlay: false,
      opacity: 0.8,
      selectedCourse: null,
      showTable: false,
      loadingButton: false,
      loadingUsers: false,
      selectedActivities: [],
      never: false,
      test: {},
      //!nueva data
      editedTicketDetails: null,
      showSingleEditModal: false,
      showSingleCreateModal: false,
      overlayCreateMultipleTicket: false,
      overlayMessageCreateMultipleTicket: '',
      transition: 'scale-transition'
    }
  },
  methods: {
    ...mapActions({
      fetchClassroom: 'classroom/fetchClassrooms',
      fetchStatusDetailTicket: 'statusDetailTicket/fetchStatusDetailTickets',
      fetchDetailTicket: 'detailTicket/fetchDetailTickets',
      fetchItems: 'ticket/fetchTickets',
      fetchCourseItems: 'course/fetchCourses',
      fetchCourseByCategory: 'course/getCoursesByCategory',
      fetchCategoryItems: 'category/fetchCategories',
      fetchCourseRegisteredUserItems:
        'courseRegisteredUser/fetchCourseRegisteredUsers',
      removeItem: 'ticket/deleteTicket',
      findTicket: 'ticket/findTicket',
      fetchTicketDetails: 'ticket/fetchTicketDetails',
      fetchSections: 'section/fetchSections',
      fetchUsersByCourse: 'courseRegisteredUser/getCourseRegisteredByCourse',
      fetchTicketsByCourse: 'ticket/findTicketByCourse',
      findSpecificUserCourse:
        'courseRegisteredUser/findCourseRegisteredUserByUserCourse',
      fetchActivities: 'activity/fetchActivities',
      findUserByActivity:
        'courseRegisteredUser/findCourseRegisteredUserByActivity',
      findUsersByPendingActivity: 'activity/findUserByPendingActivity',
      findLogEditingTicketByTicket:
        'logEditingTicket/findLogEditingTicketByTicket',
      postLogEditingTicket: 'logEditingTicket/postLogEditingTicket',
      findTicketDetailByTicket: 'ticket/findTicketDetailByTicket'
    }),
    ...mapMutations({
      PUT_TICKET: 'ticket/PUT_TICKET'
    }),
    openCreateSingleModal() {
      this.showSingleCreateModal = true
      this.singleCreateModal = true
    },
    setSnackbar(item) {
      console.log('item', item)
    },

    remove(item) {
      console.log(item.id)
      console.log(this.selectedActivities)
      const index = this.selectedActivities.findIndex(
        activity => item.id === activity.id
      )

      console.log(index)
      if (index >= 0) this.selectedActivities.splice(index, 1)
    },
    async findUserByActivityFiltered() {
      this.loadingUsers = true
      const idMoodleActivity = this.selectedActivities.map(activity => {
        return activity.idActivityMoodle
      })

      const payload = {
        ids: JSON.stringify(idMoodleActivity),
        course: this.selectedCourse.id
      }

      const { data } = await this.findUsersByPendingActivity(payload)

      this.userRegisteredFiltered = data.usersWithPendingActivities

      this.loadingUsers = false
    },
    async findTicketByCourse() {
      this.loadingButton = true

      await this.fetchTicketsByCourse(this.selectedCourse)

      this.loadingButton = false
      this.loading = false
      this.showTable = true
    },

    async findUsersByCourse() {
      this.loadingUsers = true

      this.filterUsersByCategoriesTicket()
      this.loadingUsers = false
    },

    editItem(item) {
      this.showSingleEditModal = item.showSingleEditModal
      setTimeout(() => {
        this.editedTicketDetails = item.editedTicketDetails
        this.editedTicketItem = item.editedTicketItem
        this.singleEditModal = item.singleEditModal
      }, 200)
    },
    async handleCreateMultipleTickets() {
      this.overlayCreateMultipleTicket = true
      this.overlayMessageCreateMultipleTicket = `Buscando actividades del curso ${this.selectedCourse.description}...`
      await this.fetchActivities()
      this.overlayMessageCreateMultipleTicket = `Obteniendo alumnos del curso ${this.selectedCourse.description}...`
      await this.fetchUsersByCourse(this.selectedCourse)
      this.multipleCreateModal = true
      this.showMultipleCreateModal = true
      this.overlayCreateMultipleTicket = false
    },
    async filterUsersByCategories(users) {
      if (this.category !== null) {
        this.selectedCourses.forEach(course => {
          this.userRegisteredFiltered = users.filter(userCourse => {
            return userCourse.course.id === course.id
          })
        })
      }
    },

    async fetchDataCourses() {
      const { success, message } = await this.fetchCourseItems()
      if (!success) {
        this.snackbar = true

        this.message = message
      }
    },
    async fetchDataCategories() {
      const { success, message } = await this.fetchCategoryItems()
      console.log()
      if (!success) {
        this.snackbar = true
        this.message = message
      }
    },
    async findActivities(id) {
      const { data } = await axios.get(
        `/api/v2/activity-course-registered-user/${id}`
      )

      this.user.activities = data.activityCourseRegisteredUser

      this.user.activities.forEach(activity => {
        if (
          activity.activity.description === 'Formulario de Renuncia' &&
          activity.status_moodle === 'Finalizado'
        ) {
          this.user.isActive = false
        } else {
          this.user.isActive = true
        }
      })
    },
    async deleteItem(ticket) {
      this.editedTicketIndex = this.tickets.findIndex(
        find => find.properties.id === ticket.properties.id
      )
      this.editItem_ = Object.assign({}, this.tickets[this.editedTicketIndex])
      this.dialogConfirm = true
    },
    async confirmDelete() {
      const { success, message } = await this.removeItem(
        this.editItem_.properties
      )

      if (success) {
        this.snackbar = true
        this.message = this.successMessage
      } else {
        this.snackbar = true
        this.message = message
      }
      this.closeConfirmDelete()
    },
    closeConfirmDelete() {
      this.dialogConfirm = false
      setTimeout(() => {
        this.clearTicket()
      }, 300)
    },
    closeEditedSingleModal(event) {
      this.editedTicketItem = null
      this.singleEditModal = event
      this.showSingleEditModal = event
    },
    closeCreatedSingleModal(event) {
      this.singleCreateModal = event
      this.showSingleCreateModal = event
    },
    close() {
      this.dialogConfirm = false
      setTimeout(() => {
        this.clearTicket()
      }, 300)
    }
  },
  created() {
    this.loading = true
    this.fetchSections()
    this.fetchDataCourses()
    this.fetchDataCategories()
    this.fetchClassroom()
    this.loadingButton = false
  },
  watch: {
    async category() {
      await this.fetchCourseByCategory(this.category.courses.href)
      // if (this.category !== null) {
      //   this.filterUsersByCategories()
      // }
    },
    async openTicket() {
      this.loading = true

      // this.fetchItems().then(() => (this.loading = false))

      await this.findTicketByCourse()

      this.loading = false
    },
    async closeTicket() {
      this.loading = true

      // this.fetchItems().then(() => (this.loading = false))

      await this.findTicketByCourse()

      this.loading = false
    },
    courseRegisteredUserItems() {
      if (this.courseRegisteredUserItems.length === 0) {
        this.showTable = false
      } else {
        this.showTable = true
      }
    }
  },
  computed: {
    ...mapGetters({
      items: 'ticket/tickets',
      coursesByCategory: 'course/coursesByCategory',
      categoryItems: 'category/categories',
      courseRegisteredUserItems: 'courseRegisteredUser/courseRegisteredUsers',
      motiveTicketItems: 'motiveTicket/motiveTickets',
      priorityTicketItems: 'priorityTicket/priorityTickets',
      sourceTicketItems: 'sourceTicket/sourceTickets',
      typeTicketItems: 'typeTicket/typeTickets',
      userItems: 'user/users',
      statusTicketItems: 'statusTicket/statusTickets',
      classroomItems: 'classroom/classrooms',
      userLog: 'auth/user',
      statusDetailTicketItems: 'statusDetailTicket/statusDetailTickets',
      savedTicket: 'ticket/getLastTicket',
      //ticketDetails: 'ticket/ticketDetailsByTicket',
      loggedUser: 'auth/user',
      isAdmin: 'auth/isAdmin',
      isDeveloper: 'auth/isDeveloper',
      sections: 'section/sections',
      ticketsByCourse: 'ticket/ticketsByCourse',
      courseByCategory: 'course/coursesByCategory',
      activityItems: 'activity/activities'
    }),

    nameNever() {
      if (this.never) {
        return 'Agregar nunca'
      } else {
        return 'Eliminar nunca'
      }
    },
    filterUsers() {
      if (this.never) {
        return this.userRegisteredFiltered.filter(user => {
          const user_ = user.activity_course_users.filter(activity => {
            return activity.activity.section.description === 'Renuncia'
          })

          if (user_.length === 0) {
            return user.last_access_registered_moodle !== 'Nunca'
          }
        })
      } else {
        return this.userRegisteredFiltered.filter(user => {
          const user_ = user.activity_course_users.filter(activity => {
            return activity.activity.section.description === 'Renuncia'
          })

          if (user_.length === 0) {
            return user
          }
        })
      }
    },
    filterActivities() {
      return this.activityItems.filter(
        activity =>
          activity.weighing > 0 && this.selectedCourse.id === activity.course.id
      )
    },
    arrayCourseByCategory() {
      return this.courseByCategory.map(({ properties }) => {
        return { id: properties.id, description: properties.description }
      })
    },
    filteredTickets() {
      if (this.category === null) {
        return this.tickets
      } else {
        return this.ticketsByCourse[this.category.id]
      }
    },
    sectionFiltered() {
      return this.sections.filter(
        section =>
          section.description !== 'Formativa' &&
          section.description !== 'Renuncia'
      )
    },
    titleTicket() {
      return this.editedTicketIndex > -1 ? 'Agregar contacto' : 'Generar ticket'
    },
    titleButtonTicket() {
      return this.editedTicketIndex > -1 ? 'Agregar contacto' : 'Generar ticket'
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
      const vm = this
      if (this.category !== null) {
        return this.items
          .filter(item => {
            if (this.openTicket === true && this.closeTicket === false) {
              return (
                item.properties.statusTicket.description === 'Abierto' &&
                item.properties.courseRegisteredUser.course.category
                  .description === this.category.description
              )
            } else if (this.openTicket === false && this.closeTicket === true) {
              return (
                item.properties.statusTicket.description === 'Cerrado' &&
                item.properties.courseRegisteredUser.course.category
                  .description === this.category.description
              )
            } else {
              return (
                item &&
                item.properties.courseRegisteredUser.course.category
                  .description === this.category.description
              )
            }
          })
          .filter(item => {
            if (vm.loggedUser) {
              if (vm.isAdmin || vm.isDeveloper) {
                return true
              } else {
                return item.properties.userAssigned.id === vm.loggedUser.id
              }
            }
          })
      } else {
        return this.items
          .filter(item => {
            if (this.openTicket === true && this.closeTicket === false) {
              return item.properties.statusTicket.description === 'Abierto'
            } else if (this.openTicket === false && this.closeTicket === true) {
              return item.properties.statusTicket.description === 'Cerrado'
            } else {
              return item
            }
          })
          .filter(item => {
            if (vm.loggedUser) {
              if (vm.isAdmin || vm.isDeveloper) {
                return true
              } else {
                return item.properties.userAssigned.id === vm.loggedUser.id
              }
            }
          })
      }
    },
    courseId() {
      return this.course.id
    },
    activities() {
      return this.user.activities
    }
  }
}
</script>

<style scoped>
.title-section {
  width: 100px;
  text-align: left;
}
</style>
