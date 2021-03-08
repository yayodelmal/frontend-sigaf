<template>
  <v-dialog
    :value="value"
    @input="$emit('input', $event)"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-card-title>
        <span class="headline">Editar ticket individual</span>
        <v-spacer></v-spacer>
        <v-btn color="blueS" text @click="clearTicket">Cancelar</v-btn>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-stepper alt-labels non-linear v-model="e1">
            <v-stepper-header>
              <v-stepper-step
                :color="!completeStepOne ? 'redS' : 'green'"
                dark
                :complete="completeStepOne"
                :rules="[() => rulesValueStepOne]"
                step="1"
                >Ticket</v-stepper-step
              >
              <v-divider></v-divider>
              <v-stepper-step
                :color="!completeStepTwo ? 'redS' : 'green'"
                dark
                :complete="completeStepTwo"
                :rules="[() => rulesValueStepTwo]"
                step="2"
                >Contacto</v-stepper-step
              >
            </v-stepper-header>
            <v-stepper-items>
              <v-stepper-content step="1">
                <v-container fluid>
                  <v-card elevation="0" tile class="mx-2 my-2">
                    <v-row class="bg-gray lighten-4">
                      <v-col
                        cols="12"
                        md="5"
                        xl="3"
                        lg="4"
                        sm="12"
                        class="d-flex align-center"
                      >
                        <v-card tile elevation="0">
                          <v-card-title>
                            <span
                              class="subtitle-1 font-weight-bold  blueS--text mb-3"
                            >
                              Información resumen
                            </span>
                          </v-card-title>
                          <v-card-text v-if="user" class="d-flex text-center">
                            <sigaf-card-data-student
                              :user="user"
                            ></sigaf-card-data-student>
                          </v-card-text>
                        </v-card>
                      </v-col>
                      <v-col cols="12" md="7" xl="9" lg="8" sm="12">
                        <v-row>
                          <v-col cols="12">
                            <v-card tile elevation="0">
                              <v-card-text>
                                <v-row>
                                  <v-col cols="12">
                                    <span
                                      class="subtitle-1 font-weight-bold  blueS--text mb-3"
                                    >
                                      Opciones ticket
                                    </span>
                                  </v-col>
                                  <v-col cols="12" md="6" sm="6" lg="4">
                                    <s-autocomplete-source-ticket
                                      :disabled="true"
                                      v-model="editedTicketItem.source"
                                      @blur="
                                        $v.editedTicketItem.source.$touch()
                                      "
                                      :errors="sourceErrors[0]"
                                    />
                                  </v-col>
                                  <v-col cols="12" md="6" sm="6" lg="4">
                                    <s-autocomplete-type-ticket
                                      :disabled="true"
                                      v-model="editedTicketItem.type"
                                      @blur="$v.editedTicketItem.type.$touch()"
                                      :errors="typeErrors[0]"
                                    />
                                  </v-col>
                                  <v-col cols="12" md="6" sm="6" lg="4">
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
                                          disabled
                                          v-model="editedTicketItem.createdAt"
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
                                        v-model="editedTicketItem.createdAt"
                                        header-color="blueS"
                                        color="redS"
                                        @input="menu = false"
                                      ></v-date-picker>
                                    </v-menu>
                                  </v-col>
                                  <v-col cols="12" md="6" sm="6" lg="4">
                                    <s-autocomplete-operator-ticket
                                      v-model="editedTicketItem.operator"
                                      @blur="
                                        $v.editedTicketItem.operator.$touch()
                                      "
                                      :errors="operatorErrors[0]"
                                    />
                                  </v-col>
                                  <v-col cols="12" md="6" sm="6" lg="4">
                                    <s-autocomplete-motive-ticket
                                      :disabled="true"
                                      v-model="editedTicketItem.motive"
                                      @blur="
                                        $v.editedTicketItem.motive.$touch()
                                      "
                                      :errors="motiveErrors[0]"
                                    />
                                  </v-col>
                                  <v-col cols="12" md="6" sm="6" lg="4">
                                    <s-autocomplete-priority-ticket
                                      v-model="editedTicketItem.priority"
                                      @blur="
                                        $v.editedTicketItem.priority.$touch()
                                      "
                                      :errors="priorityErrors[0]"
                                    />
                                  </v-col>
                                </v-row>
                              </v-card-text>
                            </v-card>
                          </v-col>
                          <v-col cols="12">
                            <s-table-status-detail
                              v-if="ticketDetails.length !== 0"
                              :ticketDetails="ticketDetails"
                            />
                            <v-card v-else tile elevation="1">
                              <v-card-text>
                                <v-row>
                                  <v-col cols="12">
                                    <span
                                      class="subtitle-1 font-weight-bold  blueS--text mb-3"
                                    >
                                      Intentos de contacto
                                    </span>
                                  </v-col>
                                  <v-col cols="12">
                                    <span class="subtitle-1"
                                      >No existen intentos de contacto
                                      registrados</span
                                    >
                                  </v-col>
                                </v-row>
                              </v-card-text>
                            </v-card>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                    <v-row class="justify-end">
                      <v-col cols="2" class="d-flex">
                        <v-btn
                          class="mt-3"
                          color="blueS"
                          depressed
                          dark
                          @click="secondStep"
                        >
                          Continuar
                          <v-icon class="ml-3"
                            >mdi-arrow-right-bold-circle</v-icon
                          >
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-container>
              </v-stepper-content>
              <v-stepper-content step="2">
                <v-container fluid>
                  <v-card elevation="0" tile class="mx-2 my-2">
                    <v-row class="bg-gray lighten-4">
                      <v-col
                        cols="12"
                        md="5"
                        xl="3"
                        lg="4"
                        sm="12"
                        class="d-flex align-center"
                      >
                        <v-card tile elevation="0">
                          <v-card-title>
                            <span
                              class="subtitle-1 font-weight-bold  blueS--text mb-3"
                            >
                              Información resumen
                            </span>
                          </v-card-title>
                          <v-card-text v-if="user" class="d-flex text-center">
                            <sigaf-card-data-student
                              :user="user"
                            ></sigaf-card-data-student>
                          </v-card-text>
                        </v-card>
                      </v-col>
                      <v-col cols="12" md="7" xl="9" lg="8" sm="12">
                        <v-row>
                          <v-col cols="12">
                            <v-card tile elevation="0">
                              <v-card-text>
                                <v-row>
                                  <v-col cols="12">
                                    <span
                                      class="subtitle-1 font-weight-bold  blueS--text mb-3"
                                    >
                                      Intento de contacto
                                    </span>
                                  </v-col>
                                  <v-col cols="12" sm="6" md="6">
                                    <s-autocomplete-status-detail-ticket
                                      v-model="
                                        editedDetailTicketItem.statusDetail
                                      "
                                      @blur="
                                        $v.editedDetailTicketItem.statusDetail.$touch()
                                      "
                                      :errors="statusDetailErrors[0]"
                                    />
                                  </v-col>
                                  <v-col cols="12" sm="6" md="6">
                                    <s-autocomplete-status-ticket
                                      v-model="editedTicketItem.status"
                                      @blur="
                                        $v.editedTicketItem.status.$touch()
                                      "
                                      :errors="statusErrors[0]"
                                    />
                                  </v-col>
                                  <v-col cols="12">
                                    <base-textarea
                                      label="Observaciones"
                                      v-model="editedDetailTicketItem.comment"
                                      @blur="
                                        $v.editedDetailTicketItem.comment.$touch()
                                      "
                                      :errors="commentErrors[0]"
                                      rows="1"
                                    >
                                    </base-textarea>
                                  </v-col>
                                </v-row>
                              </v-card-text>
                            </v-card>
                          </v-col>
                          <v-col cols="12" class="d-flex my-n6">
                            <v-checkbox
                              class="mx-auto"
                              color="blueS"
                              v-model="activateEmail"
                            >
                              <template v-slot:label>
                                <div>
                                  ¿Componer correo electrónico?
                                </div>
                              </template>
                            </v-checkbox>
                          </v-col>
                          <v-col cols="12" class="mt-n5">
                            <v-expand-transition>
                              <v-card
                                class="mt-5"
                                v-show="isEmailActivated && activateEmail"
                                tile
                                elevation="0"
                              >
                                <v-card-text>
                                  <v-row>
                                    <v-col cols="12">
                                      <span
                                        class="subtitle-1 font-weight-bold blueS--text mb-3"
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
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                    <v-row class="justify-space-between">
                      <v-col cols="2">
                        <v-btn dark depressed color="grayS" @click="e1 = 1">
                          <v-icon left>mdi-arrow-left-bold-circle</v-icon>
                          Atrás</v-btn
                        >
                      </v-col>
                      <v-col cols="2">
                        <v-btn
                          class="ml-3"
                          color="blueS"
                          depressed
                          :dark="!ticketClose"
                          :disabled="ticketClose"
                          @click="editTicket()"
                        >
                          Guardar
                          <v-icon class="ml-3"
                            >mdi-arrow-right-bold-circle</v-icon
                          >
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-container>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

import { currentDate, mapUser } from '@/utils/constants'
import DetailTicket from '@/models/DetailTicket'
import STableStatusDetail from '@/components/ticket/single/STableStatusDetail.vue'
import SigafCardDataStudent from '@/components/utility/SigafCardDataStudent.vue'
import SAutocompleteMotiveTicket from '@/components/ticket/SAutocompleteMotiveTicket.vue'
import SAutocompletePriorityTicket from '@/components/ticket/SAutocompletePriorityTicket.vue'
import SAutocompleteOperatorTicket from '@/components/ticket/SAutocompleteOperatorTicket.vue'
import SAutocompleteStatusDetailTicket from '@/components/ticket/SAutocompleteStatusDetailTicket.vue'
import SAutocompleteStatusTicket from '@/components/ticket/SAutocompleteStatusTicket.vue'
import SAutocompleteSourceTicket from '@/components/ticket/SAutocompleteSourceTicket.vue'
import SAutocompleteTypeTicket from '@/components/ticket/SAutocompleteTypeTicket.vue'
import SigafMailCompose from '../../utility/SigafMailCompose.vue'

export default {
  components: {
    SigafCardDataStudent,
    STableStatusDetail,
    SAutocompleteMotiveTicket,
    SAutocompletePriorityTicket,
    SAutocompleteOperatorTicket,
    SAutocompleteStatusDetailTicket,
    SAutocompleteStatusTicket,
    SAutocompleteSourceTicket,
    SAutocompleteTypeTicket,
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
    selectedCourse: Object,
    ticket: Object,
    ticketDetails: Array
  },
  data: () => ({
    rut: '',
    user: {},
    date: currentDate,
    editedTicketItem: {
      id: null,
      source: null,
      type: null,
      motive: null,
      priority: null,
      operator: null,
      status: null,
      courseRegisteredUser: null,
      createdAt: currentDate
    },
    editedDetailTicketItem: {
      statusDetail: null,
      comment: null
    },
    defaultDetailTicketItem: new DetailTicket(),
    e1: 1,
    checkValidStepTwo: false,
    checkValidStepThree: false,
    completeStepOne: false,
    completeStepTwo: false,
    completeStepThree: false,
    rulesValueStepOne: true,
    rulesValueStepTwo: true,
    rulesValueStepThree: true,
    ticketClose: false,
    menu: false,
    searchRutLoading: false,
    activateEmail: false,
    showContactAttemp: false,
    files: null,
    sender: false,
    subject: '',
    text: '',
    offsetTop: 0
  }),
  watch: {
    ticket() {
      this.parseTicket()
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
      sections: 'section/sections',
      loggedUser: 'auth/user',
      logEditingTicket: 'logEditingTicket/logEditingTicket'
    }),
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
    isEmailActivated() {
      if (!this.editedTicketItem.type) return ''
      return this.editedTicketItem.type.description === 'Correo electrónico'
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
    }
  },
  methods: {
    ...mapActions({
      findRegisteredUserByRut: 'registeredUser/findRegisteredUserByRut',
      findSpecificUserCourse:
        'courseRegisteredUser/findCourseRegisteredUserByUserCourse',
      fetchSections: 'section/fetchSections',
      putTicket: 'ticket/putTicket',
      postDetailTicket: 'detailTicket/postDetailTicket',
      findTicket: 'ticket/findTicket',
      deleteLogEditingTicket: 'logEditingTicket/deleteLogEditingTicket'
    }),
    ...mapMutations({
      PUT_TICKET: 'ticket/PUT_TICKET'
    }),
    getDay(date) {
      const daysOfWeek = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do']
      let i = new Date(date).getDay(date)
      return daysOfWeek[i]
    },
    checkStepTwo() {
      this.rulesValueStepTwo = true
      this.checkValidStepTwo = true
      this.$v.validationGroup.editedTicketItem.$reset()
      this.$v.validationGroup.editedTicketItem.$touch()

      if (!this.$v.validationGroup.editedTicketItem.$invalid) {
        console.log('validated')
        this.completeStepTwo = true
        this.e1 = 3

        if (this.editedTicketItem.type.description !== 'Correo electrónico') {
          this.showstatusDetail = false
          this.showObservation = false
        } else {
          this.showstatusDetail = true
          this.showObservation = true
        }
      }
    },
    secondStep() {
      this.e1 = 2
      this.completeStepOne = true
    },

    async parseTicket() {
      if (this.ticket) {
        const editedTicket = this.ticket.properties
        this.editedTicketItem.id = editedTicket.id
        this.editedTicketItem.source = editedTicket.sourceTicket
        this.editedTicketItem.type = editedTicket.typeTicket
        this.editedTicketItem.motive = editedTicket.motiveTicket
        this.editedTicketItem.priority = editedTicket.priorityTicket
        this.editedTicketItem.operator = editedTicket.userAssigned
        this.editedTicketItem.status = editedTicket.statusTicket
        this.editedTicketItem.courseRegisteredUser =
          editedTicket.courseRegisteredUser
        this.editedTicketItem.createdAt = editedTicket.createdAt

        const userTicket = { ...editedTicket.courseRegisteredUser }

        this.user = Object.assign({}, mapUser(userTicket, this.sections))

        this.user
      }
    },
    async editTicket() {
      this.rulesValueStepThree = true
      this.checkValidStepThree = true

      if (!this.$v.validationGroup.editedDetailTicketItem.$invalid) {
        let dataStoreTicket = {
          ticket_id: this.editedTicketItem.id,
          course_registered_user_id: this.editedTicketItem.courseRegisteredUser
            .id,
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

          console.log('currentDate', currentDate)
          dataStoreTicket = { ...dataStoreTicket, ...clossingDate }
        }

        const { success } = await this.putTicket(dataStoreTicket)

        if (success) {
          const dataDetailTicket = {
            comment: this.editedDetailTicketItem.comment,
            ticket_id: this.editedTicketItem.id,
            status_detail_ticket_id: this.editedDetailTicketItem.statusDetail
              .id,
            user_created_id: this.loggedUser.id
          }

          await this.postDetailTicket(dataDetailTicket)
          const { _data } = await this.findTicket(this.editedTicketItem)
          this.PUT_TICKET(_data)
          this.$emit('closeModal', false)
        }
      }
    },
    clearTicket() {
      this.deleteLogEditingTicket(this.logEditingTicket)
      this.$emit('closeModal', false)
    },
    handleKeepDataStatus() {
      if (!this.isKeepDataStatusDetail) {
        this.editedDetailTicketItem.statusDetail = null
      }

      if (!this.isKeepDataStatusComment) {
        this.editedDetailTicketItem.comment = null
      }
    },
    handleDataEmailComposer(value) {
      this.text = value.text
      this.files = value.files
      this.subject = value.subject
    }
  }
}
</script>

<style scoped></style>
