<template>
  <div>
    <base-card
      color="blueS"
      class="px-5 py-3"
      icon="mdi-ticket-account"
      title="Ticket"
    >
      <sigaf-category-course-toolbar
        @showTable="showTable = $event"
        @loading="loading = $event"
        @selectedCourse="selectedCourse = $event"
      ></sigaf-category-course-toolbar>

      <v-expand-transition>
        <div v-if="showTable">
          <v-divider class="mt-5 mb-3" />
          <v-toolbar dark color="blueS darken-1">
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
            <v-divider class="mx-4" vertical></v-divider>
            <div class="d-flex flex-column">
              <v-checkbox
                class="mt-5"
                v-model="openTicket"
                label="Abierto"
              ></v-checkbox>
              <v-checkbox
                class="mt-n5"
                v-model="closeTicket"
                label="Cerrado"
              ></v-checkbox>
            </div>
            <v-divider class="mx-4" vertical></v-divider>
            <div class="d-none d-sm-flex">
              <v-btn
                large
                depressed
                color="blueS"
                @click="openCreateSingleModal"
              >
                <div class="d-flex flex-column">
                  Individual
                  <v-icon right dark class="mx-auto">
                    mdi-plus
                  </v-icon>
                </div>
              </v-btn>
              <v-btn
                class="ml-3"
                width="128"
                large
                depressed
                color="blueS"
                v-if="isAdmin || isDeveloper"
                @click="handleCreateMultipleTickets"
              >
                <div class="d-flex flex-column">
                  Masivo
                  <v-icon right dark class="mx-auto">
                    mdi-plus
                  </v-icon>
                </div>
              </v-btn>
              <v-btn
                large
                depressed
                color="blueS"
                class="ml-3"
                @click="openHistoricalModal"
              >
                <div class="d-flex flex-column">
                  Historial
                  <v-icon right dark class="mx-auto">
                    mdi-history
                  </v-icon>
                </div>
              </v-btn>
            </div>
          </v-toolbar>
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
          <div v-else class="mt-5">
            <span class="subtitle-1 gray--text mb-2">Lista de tickets</span>
            <s-table-ticket
              :loading="loading"
              :tickets="tickets"
              :search="search"
              @editTicket="editItem"
              @deleteItem="deleteItem"
              @showItem="showItem"
              @showSnackbar="showSnackbar"
            />
          </div>
        </div>
      </v-expand-transition>
    </base-card>
    <sigaf-create-single-ticket
      v-if="showSingleCreateModal"
      v-model="singleCreateModal"
      :selectedCourse="selectedCourse"
      @closeModal="closeCreatedSingleModal($event)"
      @showSnackbar="showSnackbar"
    />
    <sigaf-edit-single-ticket
      v-if="showSingleEditModal"
      v-model="singleEditModal"
      :selectedCourse="selectedCourse"
      :ticket="editedTicketItem"
      :ticket-details="editedTicketDetails"
      @closeModal="closeEditedSingleModal($event)"
      @showSnackbar="showSnackbar"
    />
    <sigaf-show-single-ticket
      v-if="showSingleShowModal"
      v-model="singleShowModal"
      :selectedCourse="selectedCourse"
      :ticket="editedTicketItem"
      :ticket-details="editedTicketDetails"
      @closeModal="closeShowSingleModal($event)"
    />
    <v-overlay
      :value="overlayCreateMultipleTicket"
      color="grayS"
      :opacity="opacity"
      z-index="99"
    >
      <h3 class="headline text-center mb-16">
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
      :courseRegisteredUsers="filteredUsersCourse"
      @closeModalMultiple="closeEditedMultipleModal"
      @showSnackbar="showSnackbar"
    />

    <v-dialog v-model="historicalModal" fullscreen>
      <s-find-historical-tickets
        @closeHistoricalModal="historicalModal = false"
        :selectedCourse="selectedCourse"
      />
    </v-dialog>

    <sigaf-snackbar v-model="snackbar" v-bind="configSnack" />

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
  </div>
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
import SigafSnackbar from '../components/component/Snackbar'
import SigafShowSingleTicket from '../components/ticket/single/SigafShowSingleTicket.vue'
import SFindHistoricalTickets from '../components/utility/SFindHistoricalTickets.vue'

/* Array.prototype.forEachAsyncCustom = function(fn) {
  return this.reduce(
    (promise, n, index) => promise.then(() => fn(n, index)),
    Promise.resolve()
  )
}
 */
export default {
  inject: ['theme'],
  components: {
    ConfirmDialog,
    SigafCategoryCourseToolbar,
    SigafCreateSingleTicket,
    SigafEditSingleTicket,
    SigafCreateMultipleTicket,
    STableTicket,
    SigafSnackbar,
    SigafShowSingleTicket,
    SFindHistoricalTickets
  },
  data() {
    return {
      singleCreateModal: false,
      singleEditModal: false,
      singleShowModal: false,
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
      configSnack: {
        type: '',
        active: false,
        message: ''
      },
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
      showSingleShowModal: false,
      overlayCreateMultipleTicket: false,
      overlayMessageCreateMultipleTicket: '',
      transition: 'scale-transition',
      snackbar: false,
      historicalModal: false
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
      findTicketDetailByTicket: 'ticket/findTicketDetailByTicket',
      numberOfUsersByCourse: 'courseRegisteredUser/numberOfUsersByCourse'
    }),
    ...mapMutations({
      PUT_TICKET: 'ticket/PUT_TICKET'
    }),
    openHistoricalModal() {
      this.historicalModal = true
    },
    showItem(ticket) {
      this.showSingleShowModal = ticket.showSingleShowModal
      setTimeout(() => {
        this.editedTicketDetails = ticket.editedTicketDetails
        this.editedTicketItem = ticket.editedTicketItem
        this.singleShowModal = ticket.singleShowModal
      }, 200)
    },
    openCreateSingleModal() {
      this.showSingleCreateModal = true
      this.singleCreateModal = true
    },
    showSnackbar(item) {
      this.snackbar = false
      this.configSnack = { ...item }
      this.snackbar = true
      console.log('snackbar', this.configSnack)
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
      this.overlayMessageCreateMultipleTicket = `Buscando actividades del curso ${this.selectedCourse.description}`

      if (this.activityItems.length === 0) {
        await this.fetchActivities()
      }
      this.overlayMessageCreateMultipleTicket = `Obteniendo alumnos del curso ${this.selectedCourse.description}`

      const countCourseUser = {
        ...this.countUsersByCourses.filter(courseUser => {
          return courseUser.id === this.selectedCourse.id
        })[0]
      }

      if (countCourseUser) {
        const { _data } = await this.numberOfUsersByCourse(this.selectedCourse)

        if (countCourseUser.count !== _data.count) {
          await this.fetchUsersByCourse(this.selectedCourse)
        } else {
          //TODO envio de mensake a SNACKBAR
        }
      } else {
        //TODO envio de mensake a SNACKBAR
      }

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
    },
    closeEditedSingleModal(event) {
      this.editedTicketItem = null
      this.singleEditModal = event
      this.showSingleEditModal = event
    },
    closeShowSingleModal(event) {
      this.editedTicketItem = null
      this.singleShowModal = event
      this.showSingleShowModal = event
    },
    closeCreatedSingleModal(event) {
      this.singleCreateModal = event
      this.showSingleCreateModal = event
    },
    closeEditedMultipleModal(event) {
      this.multipleCreateModal = event
      this.showMultipleCreateModal = event
    },
    close() {
      this.dialogConfirm = false
      setTimeout(() => {
        this.clearTicket()
      }, 300)
    },
    handleAuthTicket(ticket) {
      if (this.loggedUser) {
        if (this.isAdmin || this.isDeveloper) {
          return ticket
        } else {
          return ticket.properties.userAssigned.id === this.loggedUser.id
        }
      }
    },
    handleOpenAndCloseTicket(ticket) {
      if (this.openTicket === true && this.closeTicket === false) {
        return ticket.properties.statusTicket.description === 'Abierto'
      } else if (this.openTicket === false && this.closeTicket === true) {
        return ticket.properties.statusTicket.description === 'Cerrado'
      } else if (this.openTicket === true && this.closeTicket === true) {
        return ticket
      } else {
        return
      }
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
      loggedUser: 'auth/user',
      isAdmin: 'auth/isAdmin',
      isDeveloper: 'auth/isDeveloper',
      sections: 'section/sections',
      ticketsByCourse: 'ticket/ticketsByCourse',
      courseByCategory: 'course/coursesByCategory',
      activityItems: 'activity/activities',
      countUsersByCourses: 'courseRegisteredUser/countUsersByCourses',
      storeUsersByCourse: 'courseRegisteredUser/storeUsersByCourse'
    }),

    filteredUsersCourse() {
      const usersByCourse = this.storeUsersByCourse.filter(course => {
        return course.id === this.selectedCourse.id
      })

      if (usersByCourse.length !== 0) {
        return usersByCourse[0].collection
      }
      return []
    },
    nameNever() {
      if (this.never) {
        return 'Agregar nunca'
      } else {
        return 'Eliminar nunca'
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
      return this.items
        .filter(item => this.handleOpenAndCloseTicket(item))
        .filter(item => this.handleAuthTicket(item))
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
