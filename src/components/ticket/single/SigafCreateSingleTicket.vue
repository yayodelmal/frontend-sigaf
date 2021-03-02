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
        <span class="headline">Ticket individual</span>
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
                >Destinatario</v-stepper-step
              >
              <v-divider></v-divider>
              <v-stepper-step
                :color="!completeStepTwo ? 'redS' : 'green'"
                dark
                :complete="completeStepTwo"
                :rules="[() => rulesValueStepTwo]"
                step="2"
                >Ticket</v-stepper-step
              >
              <v-divider></v-divider>
              <v-stepper-step
                :color="!completeStepThree ? 'redS' : 'green'"
                dark
                step="3"
                :complete="completeStepThree"
                :rules="[() => rulesValueStepThree]"
                >Contacto</v-stepper-step
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
                        :disabled="ticketClose"
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
                        :disabled="ticketClose"
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
                <div v-if="user">
                  <v-row justify="center">
                    <v-col
                      class="d-flex text-center"
                      cols="12"
                      sm="8"
                      md="6"
                      lg="4"
                      xl="4"
                    >
                      <sigaf-card-data-student
                        :user="user"
                      ></sigaf-card-data-student>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-spacer />
                    <v-btn
                      class="mt-3"
                      color="blueS"
                      depressed
                      dark
                      @click="secondStep"
                    >
                      Continuar
                      <v-icon class="ml-3">mdi-arrow-right-bold-circle</v-icon>
                    </v-btn>
                  </v-row>
                </div>
              </v-stepper-content>
              <v-stepper-content step="2">
                <v-row>
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
                  <!--          <v-col cols="12" sm="6" md="4">
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
                  </v-col> -->
                  <v-col cols="12" sm="4">
                    <s-autocomplete-operator-ticket
                      v-model="editedTicketItem.operator"
                      @blur="$v.editedTicketItem.operator.$touch()"
                      :errors="operatorErrors[0]"
                    />
                  </v-col>
                </v-row>
                <v-row>
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
                    <s-autocomplete-status-ticket
                      v-model="editedTicketItem.status"
                      @blur="$v.editedTicketItem.status.$touch()"
                      :errors="statusErrors[0]"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-spacer />
                  <v-btn dark depressed color="grayS" @click="e1 = 1">
                    <v-icon left>mdi-arrow-left-bold-circle</v-icon>
                    Atrás</v-btn
                  >
                  <v-btn
                    class="ml-3"
                    color="blueS"
                    depressed
                    dark
                    @click="checkStepTwo"
                  >
                    Continuar
                    <v-icon class="ml-3">mdi-arrow-right-bold-circle</v-icon>
                  </v-btn>
                </v-row>
              </v-stepper-content>
              <v-stepper-content step="3">
                <v-row>
                  <v-col cols="12" sm="3" md="3">
                    <s-autocomplete-status-detail-ticket
                      v-model="editedDetailTicketItem.statusDetail"
                      @blur="$v.editedDetailTicketItem.statusDetail.$touch()"
                      :errors="statusDetailErrors[0]"
                    />
                  </v-col>
                  <v-col cols="12" sm="9" md="9">
                    <base-textarea
                      label="Observaciones"
                      v-model="editedDetailTicketItem.comment"
                      @blur="$v.editedDetailTicketItem.comment.$touch()"
                      :errors="commentErrors[0]"
                    >
                    </base-textarea>
                  </v-col>
                </v-row>
                <v-row>
                  <v-spacer />
                  <v-btn dark depressed color="grayS" @click="e1 = 2">
                    <v-icon left>mdi-arrow-left-bold-circle</v-icon>
                    Atrás</v-btn
                  >
                  <v-btn
                    class="ml-3"
                    color="blueS"
                    depressed
                    :dark="!ticketClose"
                    :disabled="ticketClose"
                    @click="saveTicket()"
                  >
                    Guardar
                    <v-icon class="ml-3">mdi-arrow-right-bold-circle</v-icon>
                  </v-btn>
                </v-row>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

import { currentDate, mapUser } from '@/utils/constants'
import DetailTicket from '@/models/DetailTicket'
import Ticket from '@/models/Ticket'
import SigafCardDataStudent from '@/components/utility/SigafCardDataStudent.vue'
import SAutocompleteMotiveTicket from '@/components/ticket/SAutocompleteMotiveTicket.vue'
import SAutocompletePriorityTicket from '@/components/ticket/SAutocompletePriorityTicket.vue'
import SAutocompleteOperatorTicket from '@/components/ticket/SAutocompleteOperatorTicket.vue'
import SAutocompleteStatusDetailTicket from '@/components/ticket/SAutocompleteStatusDetailTicket.vue'
import SAutocompleteStatusTicket from '@/components/ticket/SAutocompleteStatusTicket.vue'
import SAutocompleteSourceTicket from '@/components/ticket/SAutocompleteSourceTicket.vue'
import SAutocompleteTypeTicket from '@/components/ticket/SAutocompleteTypeTicket.vue'

export default {
  components: {
    SigafCardDataStudent,
    SAutocompleteMotiveTicket,
    SAutocompletePriorityTicket,
    SAutocompleteOperatorTicket,
    SAutocompleteStatusDetailTicket,
    SAutocompleteStatusTicket,
    SAutocompleteSourceTicket,
    SAutocompleteTypeTicket
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
    selectedCourse: Object
  },
  data: () => ({
    rut: '',
    user: null,
    date: currentDate,
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
    defaultDetailTicketItem: new DetailTicket(),
    editItem_: new Ticket(),
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
    searchRutLoading: false
  }),
  created() {
    this.fetchSections()
  },
  computed: {
    ...mapGetters({
      sections: 'section/sections',
      loggedUser: 'auth/user',
      savedTicket: 'ticket/getLastTicket'
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
    }
  },
  methods: {
    ...mapActions({
      findRegisteredUserByRut: 'registeredUser/findRegisteredUserByRut',
      findSpecificUserCourse:
        'courseRegisteredUser/findCourseRegisteredUserByUserCourse',
      fetchSections: 'section/fetchSections',
      postTicket: 'ticket/postTicket',
      putTicket: 'ticket/putTicket',
      postDetailTicket: 'detailTicket/postDetailTicket'
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
    async fetchUserByRut() {
      this.searchRutLoading = true

      const vm = this
      setTimeout(async () => {
        const {
          _data,
          statusCode,
          message
        } = await this.findRegisteredUserByRut(this.rut)

        console.log('_data', _data)

        if (statusCode === 204) {
          vm.snackbar = true
          vm.message = message
        } else if (statusCode === 406) {
          vm.snackbar = true
          vm.message = message
        } else if (statusCode === 200) {
          if (_data !== null) {
            const payload = {
              course: this.selectedCourse.id,
              user: _data.id
            }

            const response = await this.findSpecificUserCourse(payload)

            console.log('response', response)

            const userCreated = response._data

            if (userCreated.is_sincronized === 0) {
              vm.snackbar = true
              vm.message = 'El estudiante no se encuentra registrado'
            } else {
              this.editedTicketItem.courseRegisteredUser = Object.assign(
                {},
                userCreated
              )

              this.user = Object.assign({}, mapUser(userCreated, this.sections))
            }
          } else {
            vm.snackbar = true
            vm.message = 'El estudiantes no se encuentra registrado'
          }
        }
        this.searchRutLoading = false
      }, 1000)
    },
    secondStep() {
      this.e1 = 2
      this.completeStepOne = true
    },
    async saveTicket() {
      this.rulesValueStepThree = true
      this.checkValidStepThree = true

      if (!this.$v.validationGroup.editedDetailTicketItem.$invalid) {
        let dataStoreTicket = {
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

          dataStoreTicket = { ...dataStoreTicket, ...clossingDate }
        }

        const { success } = await this.postTicket(dataStoreTicket)

        if (success) {
          const dataDetailTicket = {
            comment: this.editedDetailTicketItem.comment,
            ticket_id: this.savedTicket.properties.id,
            status_detail_ticket_id: this.editedDetailTicketItem.statusDetail
              .id,
            user_created_id: this.loggedUser.id
          }

          const responsePostDetailTicket = await this.postDetailTicket(
            dataDetailTicket
          )

          this.$emit('snackbar', responsePostDetailTicket)

          this.clearTicket()
        }
      }
    },
    clearTicket() {
      this.$emit('closeModal', false)
    }
  }
}
</script>

<style scoped></style>
