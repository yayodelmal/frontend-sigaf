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
        <span class="headline">Crear ticket individual</span>
        <v-spacer></v-spacer>
        <v-btn color="blueS" text @click="clearTicket">Cancelar</v-btn>
      </v-card-title>
      <v-card-text>
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
          </v-stepper-header>
          <v-stepper-items>
            <v-stepper-content step="1">
              <v-card elevation="0" tile class="ma-2">
                <v-row class="bg-gray lighten-4">
                  <v-col cols="12">
                    <v-toolbar dark color="blueS darken-1">
                      <v-spacer />
                      <v-text-field
                        label="12.345.678-9"
                        prepend-inner-icon="mdi-magnify"
                        flat
                        clearable
                        dark
                        hide-details
                        solo-inverted
                        color="blueS"
                        v-model="rut"
                        :loading="searchRutLoading"
                        class="shrink"
                      ></v-text-field>

                      <v-btn
                        class="ml-2"
                        depressed
                        large
                        color="blueS"
                        :loading="searchRutLoading"
                        @click.stop="fetchUserByRut()"
                      >
                        BUSCAR
                      </v-btn>
                      <v-spacer />
                    </v-toolbar>
                  </v-col>
                  <v-col
                    class="d-flex text-center"
                    cols="4"
                    v-if="user.fullname"
                  >
                    <sigaf-container-card
                      @showEditForm="editUserForm = !editUserForm"
                      :showEditButton="true"
                      title="Información alumno"
                    >
                      <template v-slot:content>
                        <sigaf-card-data-student
                          v-if="!editUserForm"
                          :user="user"
                        ></sigaf-card-data-student>
                        <s-edit-user-form
                          v-else
                          :user="user"
                          @userUpdate="updateUser"
                          @cancelForm="editUserForm = false"
                        ></s-edit-user-form>
                      </template>
                    </sigaf-container-card>
                  </v-col>
                  <v-col cols="8" v-if="user.fullname">
                    <sigaf-container-card title="Historial de tickets">
                      <template v-slot:content>
                        <s-table-ticket-historical
                          @showItem="showItem"
                          :courseRegisteredUser="user"
                        />
                      </template>
                    </sigaf-container-card>
                  </v-col>
                </v-row>
                <div v-if="user.fullname">
                  <v-row class="justify-end">
                    <v-col cols="2" class="d-flex">
                      <v-btn
                        class="ml-auto"
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
                </div>
              </v-card>
            </v-stepper-content>
            <v-stepper-content step="2">
              <v-card elevation="0" tile class="mx-2 my-2">
                <v-row class="bg-gray lighten-4">
                  <v-col
                    class="d-flex text-center"
                    cols="4"
                    v-if="user.fullname"
                  >
                    <sigaf-container-card
                      @showEditForm="editUserForm = !editUserForm"
                      :showEditButton="true"
                      title="Información alumno"
                    >
                      <template v-slot:content>
                        <sigaf-card-data-student
                          v-if="!editUserForm"
                          :user="user"
                        ></sigaf-card-data-student>
                        <s-edit-user-form
                          v-else
                          :user="user"
                          @userUpdate="updateUser"
                          @cancelForm="editUserForm = false"
                        ></s-edit-user-form>
                      </template>
                    </sigaf-container-card>
                  </v-col>
                  <v-col cols="12" md="7" xl="9" lg="8" sm="12">
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
                              v-model="editedTicketItem.source"
                              @blur="$v.editedTicketItem.source.$touch()"
                              :errors="sourceErrors[0]"
                            />
                          </v-col>
                          <v-col cols="12" md="6" sm="6" lg="4">
                            <s-autocomplete-type-ticket
                              v-model="editedTicketItem.type"
                              @blur="$v.editedTicketItem.type.$touch()"
                              :errors="typeErrors[0]"
                            />
                          </v-col>
                          <v-col cols="12" md="6" sm="6" lg="4">
                            <s-autocomplete-motive-ticket
                              v-model="editedTicketItem.motive"
                              @blur="$v.editedTicketItem.motive.$touch()"
                              :errors="motiveErrors[0]"
                            />
                          </v-col>
                          <v-col cols="12" md="6" sm="6" lg="4">
                            <s-autocomplete-priority-ticket
                              v-model="editedTicketItem.priority"
                              @blur="$v.editedTicketItem.priority.$touch()"
                              :errors="priorityErrors[0]"
                            />
                          </v-col>
                          <v-col cols="12" md="6" sm="6" lg="4">
                            <s-autocomplete-operator-ticket
                              v-model="editedTicketItem.operator"
                              @blur="$v.editedTicketItem.operator.$touch()"
                              :errors="operatorErrors[0]"
                            />
                          </v-col>
                          <v-col cols="12" md="6" sm="6" lg="4">
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
                        class="mt-5"
                        v-show="isEmailActivated"
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
                    <v-btn dark depressed color="grayS" @click="e1 = 1">
                      <v-icon left>mdi-arrow-left-bold-circle</v-icon>
                      Atrás</v-btn
                    >
                  </v-col>
                  <v-col cols="2">
                    <v-btn
                      dark
                      class="float-right"
                      color="blueS"
                      depressed
                      @click="saveTicket()"
                    >
                      Guardar
                      <v-icon class="ml-3">mdi-arrow-right-bold-circle</v-icon>
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
import SigafMailCompose from '../../utility/SigafMailCompose.vue'
import STableTicketHistorical from '../STableTicketHistorical.vue'
import SigafContainerCard from '../../utility/SigafContainerCard.vue'
import SEditUserForm from '../../utility/SEditUserForm.vue'

export default {
  components: {
    SigafCardDataStudent,
    SAutocompleteMotiveTicket,
    SAutocompletePriorityTicket,
    SAutocompleteOperatorTicket,
    SAutocompleteStatusDetailTicket,
    SAutocompleteStatusTicket,
    SAutocompleteSourceTicket,
    SAutocompleteTypeTicket,
    SigafMailCompose,
    STableTicketHistorical,
    SigafContainerCard,
    SEditUserForm
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
    user: {
      rut: '',
      email: '',
      phone: '',
      fullname: '',
      mobile: ''
    },
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
    searchRutLoading: false,
    showContactAttemp: false,
    files: null,
    sender: false,
    subject: '',
    text: '',
    CCRecipient: '',
    editUserForm: false
  }),
  created() {
    this.fetchSections()
  },
  watch: {
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
    isDataDetailRequired() {
      if (!this.editedTicketItem.type) return ''
      return this.editedTicketItem.type.description === 'Correo electrónico'
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
      postDetailTicket: 'detailTicket/postDetailTicket',
      postMailTicket: 'ticket/postMailTicket'
    }),
    updateUser(item) {
      this.$nextTick(() => {
        this.user.registered_user.name = item.name
        this.user.registered_user.last_name = item.last_name
        this.user.registered_user.mother_last_name = item.mother_last_name
        this.user.registered_user.mobile = item.mobile
        this.user.registered_user.phone = item.phone
        this.user.registered_user.email = item.email
        this.editUserForm = false
      })
    },
    showItem(ticket) {
      this.$emit('showItem', ticket)
    },
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

      this.user = {
        rut: '',
        email: '',
        phone: '',
        fullname: '',
        mobile: ''
      }
      const vm = this
      setTimeout(async () => {
        const {
          _data,
          statusCode,
          message
        } = await this.findRegisteredUserByRut(this.rut)

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
              console.log('user', this.user)
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
      this.sender = true
      this.rulesValueStepTwo = true
      this.checkValidStepTwo = true

      this.$v.validationGroup.editedTicketItem.$reset()
      this.$v.validationGroup.editedTicketItem.$touch()

      if (this.showContactAttemp) {
        this.$v.validationGroup.editedDetailTicketItem.$reset()
        this.$v.validationGroup.editedDetailTicketItem.$touch()

        if (this.$v.validationGroup.editedDetailTicketItem.$invalid) {
          this.rulesValueStepTwo = false
          this.checkValidStepTwo = false
        }
      } else {
        this.editedDetailTicketItem.statusDetail = null
        this.editedDetailTicketItem.comment = ''
        if (this.$v.validationGroup.editedTicketItem.$invalid) {
          this.rulesValueStepTwo = false
          this.checkValidStepTwo = false
        }
      }

      if (this.checkValidStepTwo) {
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

        const { success, _data } = await this.postTicket(dataStoreTicket)

        if (success && this.editedDetailTicketItem.statusDetail !== null) {
          const dataDetailTicket = {
            comment: this.editedDetailTicketItem.comment,
            ticket_id: _data.properties.id,
            status_detail_ticket_id: this.editedDetailTicketItem.statusDetail
              .id,
            user_created_id: this.loggedUser.id
          }

          const responsePostDetailTicket = await this.postDetailTicket(
            dataDetailTicket
          )

          console.log(responsePostDetailTicket)
        }

        if (this.isEmailActivated) {
          let payload = {
            ticketId: _data.properties.id
          }

          if (this.text === '' && this.subject === '') {
            console.log('sin datos de email')
          } else {
            if (this.text !== '') {
              payload = {
                ...payload,
                ...{
                  text: this.text,
                  subject: this.subject
                }
              }
            }

            if (this.files !== null) {
              payload = { ...payload, ...{ files: this.files } }
            }

            if (this.CCRecipient !== '') {
              payload = { ...payload, ...{ CCRecipient: this.CCRecipient } }
            }

            await this.postMailTicket(payload)
          }
        }
        this.$emit('showSnackbar', {
          type: 'success',
          message: 'El ticket se ha creado correctamente.'
        })
        this.clearTicket()
      } else {
        this.$emit('showSnackbar', {
          type: 'warning',
          message: 'Complete los campos obligatorios.'
        })

        setTimeout(() => {
          this.$v.validationGroup.editedTicketItem.$reset()
          this.$v.validationGroup.editedDetailTicketItem.$reset()
        }, 3000)
      }
    },
    clearTicket() {
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
      this.CCRecipient = value.CCRecipient

      console.log(value)
    }
  }
}
</script>

<style scoped></style>
