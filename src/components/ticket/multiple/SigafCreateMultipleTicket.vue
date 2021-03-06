<template>
  <div>
    <v-dialog
      :value="value"
      @input="$emit('input', $event)"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Ticket masivo</span>
          <v-spacer />
          <v-btn color="blueS" @click="clearTicket" text>Cancelar</v-btn>
        </v-card-title>
        <v-card-text>
          <v-stepper alt-labels non-linear v-model="em1">
            <v-stepper-header>
              <v-stepper-step
                :color="!completeStepOne ? 'redS' : 'green'"
                dark
                :complete="completeStepOne"
                :rules="[() => rulesValueStepOne]"
                step="1"
                >Destinatarios</v-stepper-step
              >
              <v-divider></v-divider>
              <v-stepper-step
                :color="!completeStepTwo ? 'redS' : 'green'"
                dark
                step="2"
                :complete="completeStepTwo"
                :rules="[() => rulesValueStepTwo]"
                >Ticket</v-stepper-step
              >
            </v-stepper-header>
            <v-stepper-items>
              <v-stepper-content step="1">
                <v-card elevation="0" tile class="mx-2 my-2">
                  <v-row class="bg-gray lighten-4">
                    <v-col cols="12">
                      <v-card class="blueS" elevation="0" tile>
                        <v-card-text>
                          <v-row>
                            <v-col
                              cols="9"
                              class="flex-grow-1 flex-shrink-0 grow"
                            >
                              <v-autocomplete
                                v-model="selectedActivities"
                                :items="filterActivities"
                                chips
                                dark
                                color="blueS"
                                flat
                                solo-inverted
                                hide-details
                                return-object
                                label="Filtrar actividades pendientes"
                                item-text="description"
                                item-value="description"
                                multiple
                              >
                                <template v-slot:selection="data">
                                  <v-chip
                                    small
                                    v-bind="data.attrs"
                                    :input-value="data.selected"
                                    close
                                    @click="data.select"
                                    @click:close="remove(data.item)"
                                  >
                                    {{ data.item.description }}
                                  </v-chip>
                                </template>
                                <template v-slot:item="{ item }">
                                  <template>
                                    <v-list-item-content>
                                      <v-list-item-title
                                        v-html="item.description"
                                      >
                                      </v-list-item-title>
                                      <v-list-item-subtitle
                                        v-html="item.section.description"
                                      ></v-list-item-subtitle>
                                    </v-list-item-content>
                                  </template>
                                </template>
                              </v-autocomplete>
                            </v-col>
                            <v-col
                              cols="1"
                              class="d-flex flex-grow-0 flex-shrink-1 min-width-180"
                            >
                              <v-btn
                                class="ml-auto"
                                large
                                color="blueS darken-1"
                                depressed
                                dark
                                @click="findUserByActivityFiltered"
                                :loading="loading"
                              >
                                Buscar
                                <v-icon class="ml-3"
                                  >mdi-arrow-right-bold-circle</v-icon
                                >
                              </v-btn>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="6">
                              <v-autocomplete
                                :items="currentClassrooms"
                                label="Filtrar aula"
                                chips
                                dense
                                dark
                                flat
                                hide-details
                                solo-inverted
                                item-text="description"
                                item-value="description"
                                return-object
                                v-model="selectedClassrooms"
                                multiple
                                color="blueS"
                              >
                                <template v-slot:selection="data">
                                  <v-chip
                                    :key="JSON.stringify(data.item)"
                                    v-bind="data.attrs"
                                    :input-value="data.selected"
                                    :disabled="data.disabled"
                                    close
                                    small
                                    @click:close="
                                      data.parent.selectItem(data.item)
                                    "
                                  >
                                    <v-avatar
                                      class="redS whiteS--text"
                                      left
                                      v-text="
                                        `${data.item.description
                                          .split(' ')[0]
                                          .slice(0, 1)
                                          .toUpperCase()}${data.item.description
                                          .split(' ')[1]
                                          .slice(0, 2)
                                          .toUpperCase()}`
                                      "
                                    ></v-avatar>
                                    {{ data.item.description }}
                                  </v-chip>
                                </template></v-autocomplete
                              >
                            </v-col>
                            <v-col
                              cols="4"
                              class="flex-grow-1 flex-shrink-0 grow"
                            >
                              <v-text-field
                                v-model="searchMassiveTicket"
                                append-icon="mdi-magnify"
                                label="Buscar"
                                color="blueS"
                                dense
                                flat
                                dark
                                hide-details
                                solo-inverted
                              ></v-text-field>
                            </v-col>
                            <v-col
                              cols="2"
                              class="d-flex flex-grow-0 flex-shrink-1"
                            >
                              <v-switch
                                class="mt-1 ml-auto"
                                label="Nunca"
                                color="blueS darken-1"
                                dark
                                v-model="never"
                                hide-details
                                style="min-width:150px;"
                              ></v-switch>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-col>
                    <v-col cols="12">
                      <v-card elevation="0">
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
                        <table-user
                          v-else
                          v-model="selectedUsers"
                          :items="filteredUser"
                          :search="searchMassiveTicket"
                        ></table-user>
                      </v-card>
                    </v-col>
                  </v-row>
                  <v-row class="justify-end">
                    <v-col cols="3" class="d-flex">
                      <v-btn
                        class="ml-auto"
                        color="blueS"
                        depressed
                        dark
                        @click="checkStepOne"
                      >
                        Continuar
                        <v-icon class="ml-3"
                          >mdi-arrow-right-bold-circle</v-icon
                        >
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card>
              </v-stepper-content>
              <v-stepper-content step="2">
                <v-card elevation="0" tile class="mx-2 my-2">
                  <v-row class="bg-gray lighten-4">
                    <v-col cols="4">
                      <v-card tile elevation="0">
                        <v-card-title>
                          <span
                            class="subtitle-1 font-weight-bold  blueS--text mb-3"
                          >
                            Información resumen
                          </span>
                        </v-card-title>
                        <v-card-text>
                          <v-timeline dense clipped>
                            <v-slide-x-reverse-transition group hide-on-leave>
                              <v-timeline-item
                                v-for="timeline in timelineData"
                                :key="timeline.id"
                                :color="timeline.color"
                                :icon="timeline.icon"
                                fill-dot
                              >
                                <v-card
                                  color="green lighten-5"
                                  tile
                                  elevation="1"
                                >
                                  <v-card-text>
                                    <span
                                      :class="
                                        `subtitle-1 font-weight-bold ${timeline.color}--text`
                                      "
                                      v-text="timeline.number"
                                    ></span>
                                    {{ timeline.text }}
                                    <div
                                      v-if="timeline.hasItems"
                                      class="caption"
                                    >
                                      <ol>
                                        <li
                                          v-for="item in timeline.items"
                                          :key="item.id"
                                        >
                                          {{ item.description }}
                                        </li>
                                      </ol>
                                    </div>
                                  </v-card-text>
                                </v-card>
                              </v-timeline-item>
                            </v-slide-x-reverse-transition>
                          </v-timeline>
                        </v-card-text>
                      </v-card>
                    </v-col>
                    <v-col cols="8">
                      <v-card tile elevation="0">
                        <v-card-text>
                          <v-row>
                            <v-col cols="12">
                              <span
                                class="subtitle-1 font-weight-bold  blueS--text"
                              >
                                Opciones ticket
                              </span>
                            </v-col>
                            <v-col cols="12" sm="4">
                              <s-autocomplete-source-ticket
                                v-model="editedTicketItem.source"
                                @blur="$v.editedTicketItem.source.$touch()"
                                :errors="sourceErrors[0]"
                              />
                            </v-col>
                            <v-col cols="12" sm="4">
                              <s-autocomplete-type-ticket
                                v-model="editedTicketItem.type"
                                @blur="$v.editedTicketItem.type.$touch()"
                                :errors="typeErrors[0]"
                              />
                            </v-col>
                            <v-col cols="12" sm="4">
                              <s-autocomplete-motive-ticket
                                v-model="editedTicketItem.motive"
                                @blur="$v.editedTicketItem.motive.$touch()"
                                :errors="motiveErrors[0]"
                              />
                            </v-col>
                            <v-col cols="12" sm="4">
                              <s-autocomplete-priority-ticket
                                v-model="editedTicketItem.priority"
                                @blur="$v.editedTicketItem.priority.$touch()"
                                :errors="priorityErrors[0]"
                              />
                            </v-col>
                            <v-col cols="12" sm="4">
                              <s-autocomplete-operator-ticket
                                v-model="editedTicketItem.operator"
                                @blur="$v.editedTicketItem.operator.$touch()"
                                :errors="operatorErrors[0]"
                              />
                            </v-col>
                            <v-col cols="12" md="4">
                              <s-autocomplete-status-ticket
                                v-model="editedTicketItem.status"
                                @blur="$v.editedTicketItem.status.$touch()"
                                :errors="statusErrors[0]"
                              />
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                      <v-expand-transition>
                        <v-card
                          class="mt-3"
                          v-show="isEmailActivated"
                          tile
                          elevation="0"
                        >
                          <v-card-text>
                            <v-row>
                              <v-col cols="12">
                                <span
                                  class="subtitle-1 font-weight-bold blueS--text"
                                >
                                  Correo electrónico
                                </span>
                              </v-col>
                              <v-col cols="12">
                                <sigaf-mail-compose
                                  :sender="sender"
                                  @emailComposer="handleDataEmailComposer"
                                />
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </v-expand-transition>
                      <v-expand-transition>
                        <v-card
                          class="mt-3"
                          v-show="showContactAttemp"
                          tile
                          elevation="0"
                        >
                          <v-card-text>
                            <v-row>
                              <v-col cols="12">
                                <span
                                  class="subtitle-1 font-weight-bold  blueS--text mb-3"
                                >
                                  Intento de contacto
                                </span>
                              </v-col>

                              <v-col cols="12" sm="4" md="4">
                                <s-autocomplete-status-detail-ticket
                                  v-model="editedDetailTicketItem.statusDetail"
                                  @blur="
                                    $v.editedDetailTicketItem.statusDetail.$touch()
                                  "
                                  :errors="statusDetailErrors[0]"
                                />
                              </v-col>
                              <v-col cols="12" sm="8" md="8">
                                <base-textarea
                                  label="Observaciones"
                                  v-model="editedDetailTicketItem.comment"
                                  @blur="
                                    $v.editedDetailTicketItem.comment.$touch()
                                  "
                                >
                                </base-textarea>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </v-expand-transition>
                    </v-col>
                  </v-row>
                  <v-row class="justify-space-between">
                    <v-col cols="2">
                      <v-btn dark depressed color="grayS" @click="em1 = 1">
                        <v-icon left>mdi-arrow-left-bold-circle</v-icon>
                        Atrás</v-btn
                      >
                    </v-col>
                    <v-col cols="4">
                      <v-btn
                        dark
                        class="float-right"
                        color="blueS"
                        depressed
                        @click="saveMassiveTicket()"
                      >
                        Generar tickets
                        <v-icon class="ml-3"
                          >mdi-arrow-right-bold-circle</v-icon
                        >
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-overlay z-index="210" :value="overlay" color="grayS" :opacity="opacity">
      <div class="text-center">
        <v-progress-circular indeterminate size="64"> </v-progress-circular>
      </div>
      <h3 class="headline text-center mt-5">
        Generando tickets...
      </h3>
    </v-overlay>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { setTimer } from '@/utils/constants'
import TableUser from './tableUser.vue'

import SAutocompleteSourceTicket from '@/components/ticket/SAutocompleteSourceTicket.vue'
import SAutocompleteTypeTicket from '@/components/ticket/SAutocompleteTypeTicket.vue'
import SAutocompletePriorityTicket from '@/components/ticket/SAutocompletePriorityTicket.vue'
import SAutocompleteMotiveTicket from '@/components/ticket/SAutocompleteMotiveTicket.vue'
import SAutocompleteOperatorTicket from '@/components/ticket/SAutocompleteOperatorTicket.vue'
import SAutocompleteStatusDetailTicket from '@/components/ticket/SAutocompleteStatusDetailTicket.vue'
import SAutocompleteStatusTicket from '@/components/ticket/SAutocompleteStatusTicket.vue'
import SigafMailCompose from '../../utility/SigafMailCompose.vue'

export default {
  components: {
    TableUser,
    SAutocompleteSourceTicket,
    SAutocompleteTypeTicket,
    SAutocompletePriorityTicket,
    SAutocompleteMotiveTicket,
    SAutocompleteOperatorTicket,
    SAutocompleteStatusDetailTicket,
    SAutocompleteStatusTicket,
    SigafMailCompose
  },
  mixins: [validationMixin],
  validations: {
    editedTicketItem: {
      source: { required },
      type: { required },
      motive: { required },
      priority: { required },
      operator: { required },
      status: { required }
    },
    editedDetailTicketItem: {
      statusDetail: { required },
      comment: { required }
    },
    validationGroup: ['editedTicketItem', 'editedDetailTicketItem']
  },
  props: {
    value: Boolean,
    courseRegisteredUsers: Array,
    selectedCourse: Object
  },
  data: () => ({
    selectedActivities: [],
    never: false,
    em1: 1,
    selectedUsers: [],
    checkValidStepOne: false,
    checkValidStepTwo: false,
    text: ``,
    completeStepOne: false,
    completeStepTwo: false,
    rulesValueStepOne: true,
    rulesValueStepTwo: true,
    searchMassiveTicket: '',
    selectedClassrooms: [],
    userRegisteredFiltered: [],
    editedTicketItem: {
      source: null,
      type: null,
      motive: null,
      priority: null,
      operator: null,
      status: null
    },
    editedDetailTicketItem: {
      statusDetail: null,
      comment: null
    },
    timelineData: [],
    loadingUsers: false,
    loading: false,
    transition: 'scale-transition',
    showContactAttemp: false,
    files: null,
    sender: false,
    subject: '',
    overlay: false,
    opacity: 0.8
  }),

  async mounted() {
    await this.fetchClassroom()
    this.userRegisteredFiltered = this.courseRegisteredUsers

    await this.fetchCourses()
  },
  watch: {
    selectedActivities() {
      this.userRegisteredFiltered = []
      if (this.selectedActivities.length === 0) {
        this.userRegisteredFiltered = this.courseRegisteredUsers
      }
    },
    type() {
      this.handleKeepDataStatus()
      this.showContactAttemp = false
      if (this.type === 'Correo electrónico') {
        this.showContactAttemp = true
      }
      if (this.type === 'Contacto telefónico' && this.status === 'Cerrado') {
        this.showContactAttemp = true
      }
    },
    status() {
      this.handleKeepDataStatus()
      this.showContactAttemp = false
      if (this.status === 'Cerrado') {
        this.showContactAttemp = true
      }
      if (this.status === 'Abierto' && this.type === 'Correo electrónico') {
        this.showContactAttemp = true
      }
    }
  },
  computed: {
    ...mapGetters({
      activityItems: 'activity/activities',
      classroomItems: 'classroom/classrooms',
      loggedUser: 'auth/user'
    }),
    filterActivities() {
      return this.activityItems
        .filter(
          activity =>
            activity.weighing > 0 &&
            this.selectedCourse.id === activity.course.id
        )
        .sort((a, b) => {
          const sortA = a.section.description.split(' ')[1]
          const sortB = b.section.description.split(' ')[1]
          return sortA - sortB
        })
    },
    sourceErrors() {
      const errors = []

      if (!this.$v.editedTicketItem.source.$dirty) return errors
      !this.$v.editedTicketItem.source.required &&
        errors.push('Es obligatorio.')

      return errors
    },
    typeErrors() {
      const errors = []

      if (!this.$v.editedTicketItem.type.$dirty) return errors
      !this.$v.editedTicketItem.type.required && errors.push('Es obligatorio.')

      return errors
    },
    motiveErrors() {
      const errors = []

      if (!this.$v.editedTicketItem.motive.$dirty) return errors
      !this.$v.editedTicketItem.motive.required &&
        errors.push('Es obligatorio.')

      return errors
    },
    priorityErrors() {
      const errors = []

      if (!this.$v.editedTicketItem.priority.$dirty) return errors
      !this.$v.editedTicketItem.priority.required &&
        errors.push('Es obligatorio.')

      return errors
    },
    operatorErrors() {
      const errors = []

      if (!this.$v.editedTicketItem.operator.$dirty) return errors
      !this.$v.editedTicketItem.operator.required &&
        errors.push('Es obligatorio.')

      return errors
    },
    statusErrors() {
      const errors = []

      if (!this.$v.editedTicketItem.status.$dirty) return errors
      !this.$v.editedTicketItem.status.required &&
        errors.push('Es obligatorio.')

      return errors
    },
    statusDetailErrors() {
      const errors = []

      if (!this.$v.editedDetailTicketItem.statusDetail.$dirty) return errors
      !this.$v.editedDetailTicketItem.statusDetail.required &&
        errors.push('Es obligatorio.')

      return errors
    },
    commentErrors() {
      const errors = []

      if (!this.$v.editedDetailTicketItem.comment.$dirty) return errors
      !this.$v.editedDetailTicketItem.comment.required &&
        errors.push('Es obligatorio.')

      return errors
    },
    type() {
      if (this.editedTicketItem.type === null) return ''
      return this.editedTicketItem.type.description
    },
    status() {
      if (this.editedTicketItem.status === null) return ''
      return this.editedTicketItem.status.description
    },
    isKeepDataStatusDetail() {
      return (
        this.editedDetailTicketItem.statusDetail !== null &&
        this.editedDetailTicketItem.statusDetail.id !== 0
      )
    },
    isKeepDataStatusComment() {
      return (
        this.editedDetailTicketItem.comment !== null &&
        this.editedDetailTicketItem.comment !== '_'
      )
    },
    isEmailActivated() {
      if (!this.editedTicketItem.type) return ''
      return this.editedTicketItem.type.description === 'Correo electrónico'
    },
    filteredUser() {
      return this.userRegisteredFiltered
        .filter(user => this.filterQuitUser(user.activity_course_users))
        .filter(user => this.filterClassrooms(user))
        .filter(user => this.filterNeverUser(user))
    },
    currentClassrooms() {
      return this.classroomItems.filter(classroom =>
        this.handleFilterClassroom(classroom)
      )
    }
  },
  methods: {
    ...mapActions({
      findUsersByPendingActivity: 'activity/findUserByPendingActivity',
      fetchClassroom: 'classroom/fetchClassrooms',
      postMultipleTicket: 'ticket/postMultipleTicket',
      postMassiveDetailTicket: 'detailTicket/postMassiveDetailTicket',
      postMailMultipleTicket: 'ticket/postMailMultipleTicket',
      fetchCourses: 'course/fetchCourses'
    }),
    handleFilterClassroom(classroom) {
      const currentClassrooms = this.userRegisteredFiltered.reduce(
        (accumulator, item) => {
          const key = item.classroom_id

          if (!accumulator[key]) {
            accumulator[key] = []
          }
          accumulator[key].push(item)
          return accumulator
        },
        {}
      )
      const classroomsIds = Object.keys(currentClassrooms).map(id =>
        Number.parseInt(id)
      )

      if (classroomsIds.includes(classroom.id)) return classroom
      return
    },
    filterQuitUser(userActivities) {
      if (userActivities.length === 0) return
      const filterActivity = userActivities.filter(activity => {
        return activity.activity.section.description !== 'Renuncia'
      })

      return filterActivity.length !== 0
    },
    filterNeverUser(user) {
      if (this.never) return user.last_access_registered_moodle === 'Nunca'
      return user
    },
    filterClassrooms(user) {
      const classroomIds = this.selectedClassrooms.map(
        classroom => classroom.id
      )
      if (classroomIds.length === 0) return user
      else if (classroomIds.includes(user.classroom.id)) return user
    },
    async findUserByActivityFiltered() {
      this.loading = true
      this.selectedUsers = []
      const idMoodleActivity = this.selectedActivities.map(activity => {
        return activity.idActivityMoodle
      })

      const payload = {
        ids: JSON.stringify(idMoodleActivity),
        course: this.selectedCourse.id
      }

      const { data } = await this.findUsersByPendingActivity(payload)

      this.userRegisteredFiltered = data.usersWithPendingActivities

      this.loading = false
    },

    async checkStepOne() {
      this.rulesValueStepOne = true
      this.timelineData = []

      if (this.selectedUsers.length === 0) {
        //TODO agregar snackbar

        this.$emit('showSnackbar', {
          open: true,
          message: 'Custom message'
        })
        this.rulesValueStepOne = false
      }

      if (this.rulesValueStepOne) {
        this.completeStepOne = true
        this.em1 = 2
        const data = []
        data.push({
          id: 1,
          text: `alumnos seleccionados`,
          number:
            this.selectedUsers.length === 0 ? 'Sin' : this.selectedUsers.length,

          icon: 'mdi-account',
          color: 'redS'
        })

        data.push({
          id: 2,
          text: `actividades pendientes seleccionadas`,
          icon: 'mdi-clipboard-list-outline',
          number:
            this.selectedActivities.length === 0
              ? 'Sin'
              : this.selectedActivities.length,
          color: 'redS',
          hasItems: true,
          items: this.selectedActivities
        })

        data.push({
          id: 4,
          text: `aulas seleccionadas`,
          icon: 'mdi-google-circles-extended',
          number:
            this.selectedClassrooms.length === 0
              ? 'Sin'
              : this.selectedClassrooms.length,
          color: 'redS',
          hasItems: true,
          items: this.selectedClassrooms
        })

        for (var i = 0; i < data.length; i++) {
          await setTimer(1000) // then the created Promise can be awaited
          this.timelineData.push(data[i])
        }
      }
    },
    async saveMassiveTicket() {
      this.sender = true
      if (!this.showContactAttemp) {
        this.editedDetailTicketItem.statusDetail = {
          ...this.editedDetailTicketItem.statusDetail,
          ...{ id: 0 }
        }
        this.editedDetailTicketItem.comment = '_'
      }

      this.$v.$reset()
      this.$v.$touch()

      if (!this.$v.$invalid) {
        this.overlay = true

        const mapUsersId = this.selectedUsers.map(user => {
          return user.id
        })

        let dataStoreTicket = {
          course_registered_user_id: mapUsersId,
          type_ticket_id: this.editedTicketItem.type.id,
          source_ticket_id: this.editedTicketItem.source.id,
          status_ticket_id: this.editedTicketItem.status.id,
          priority_ticket_id: this.editedTicketItem.priority.id,
          motive_ticket_id: this.editedTicketItem.motive.id,
          user_create_id: this.loggedUser.id,
          user_assigned_id: this.editedTicketItem.operator.id
        }

        if (this.editedTicketItem.status.description === 'Cerrado') {
          const clossingDate = { closing_date: true }

          dataStoreTicket = { ...dataStoreTicket, ...clossingDate }
        }

        const { success, _data } = await this.postMultipleTicket(
          dataStoreTicket
        )

        if (success) {
          if (this.editedDetailTicketItem.statusDetail.id !== 0) {
            const ticketsId = _data.map(ticket => {
              return ticket.properties.id
            })

            const dataDetailTicket = {
              comment: this.editedDetailTicketItem.comment,
              ticket_id: ticketsId,
              status_detail_ticket_id: this.editedDetailTicketItem.statusDetail
                .id,
              user_created_id: this.loggedUser.id
            }

            const response = await this.postMassiveDetailTicket(
              dataDetailTicket
            )

            if (response.success && this.isEmailActivated) {
              let payload = {
                ticketsId: ticketsId
              }

              if (this.text === '' && this.subject === '') {
                //TODO Aca va lógica de mensake de validación
              } else {
                if (this.text !== '') {
                  payload = {
                    ...payload,
                    ...{ text: this.text, subject: this.subject }
                  }
                }

                if (this.files !== null) {
                  payload = { ...payload, ...{ files: this.files } }
                }

                await this.postMailMultipleTicket(payload)
              }
            }
          }
          this.$emit('closeModalMultiple', false)
          this.overlay = false
        }
      } else {
        //TODO Aca va lógica de mensake de validación
      }
    },

    handleKeepDataStatus() {
      if (!this.isKeepDataStatusDetail) {
        this.editedDetailTicketItem.statusDetail = null
      }

      if (!this.isKeepDataStatusComment) {
        this.editedDetailTicketItem.comment = null
      }
    },

    remove(item) {
      const index = this.selectedActivities.findIndex(
        activity => item.id === activity.id
      )
      if (index >= 0) this.selectedActivities.splice(index, 1)
    },

    handleDataEmailComposer(value) {
      this.text = value.text
      this.files = value.files
      this.subject = value.subject
    },
    clearTicket() {
      this.$emit('closeModalMultiple', false)
    }
  }
}
</script>

<style scoped>
.grow {
  max-width: 100%;
}

.min-width-180 {
  min-width: 160px;
}

.v-stepper__content {
  padding: 0;
}
</style>
