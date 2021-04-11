<template>
  <v-dialog
    :value="value"
    @input="$emit('input', $event)"
    fullscreen
    persistent
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card tile elevation="0">
      <v-card-title>
        <span class="headline">Editar ticket</span>
        <v-spacer></v-spacer>
        <span class="headline font-weight-bold">Código: {{ code }}</span>
        <v-spacer></v-spacer>
        <v-btn color="blueS" text @click="clearTicket">Cancelar</v-btn>
      </v-card-title>
      <v-container fluid>
        <v-card tile elevation="0" class="ma-3">
          <v-row class="bg-gray lighten-5">
            <v-col
              cols="12"
              md="5"
              xl="4"
              lg="4"
              sm="12"
              class="d-flex justify-center align-stretch"
            >
              <sigaf-container-card
                @showEditForm="editUserForm = !editUserForm"
                :showEditButton="true"
                title="Información alumno"
                :showLastSync="true"
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
            <v-col cols="12" md="3" xl="3" lg="3" sm="12">
              <sigaf-container-card title="Opciones de ticket">
                <template v-slot:content>
                  <v-col cols="12">
                    <s-autocomplete-source-ticket
                      v-model="editedTicketItem.source"
                    />
                  </v-col>
                  <v-col cols="12">
                    <s-autocomplete-type-ticket
                      v-model="editedTicketItem.type"
                    />
                  </v-col>
                  <v-col cols="12">
                    <s-autocomplete-motive-ticket
                      v-model="editedTicketItem.motive"
                    />
                  </v-col>
                  <v-col cols="12">
                    <s-autocomplete-priority-ticket
                      v-model="editedTicketItem.priority"
                    />
                  </v-col>
                  <v-col cols="12">
                    <s-autocomplete-operator-ticket
                      v-model="editedTicketItem.operator"
                    />
                  </v-col>
                  <v-col cols="12">
                    <s-autocomplete-status-ticket
                      v-model="editedTicketItem.status"
                    />
                  </v-col>
                </template>
              </sigaf-container-card>
            </v-col>
            <v-col cols="5">
              <sigaf-container-card
                v-if="ticketDetails"
                title="Intentos de contacto"
              >
                <template v-slot:content>
                  <v-col cols="12">
                    <v-simple-table fixed-header height="180">
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th class="text-left redS--text">#</th>
                            <th class="text-left redS--text">
                              Intento
                            </th>
                            <th
                              style="min-width: 150px;"
                              class="text-left redS--text"
                            >
                              Observación
                            </th>
                            <th
                              class="text-left redS--text"
                              style="min-width:80px;"
                            >
                              Fecha
                            </th>
                            <th class="text-left redS--text">
                              Operador responsable
                            </th>
                            <th class="text-left redS--text"></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(item, index) in ticketDetails"
                            :key="item.id"
                          >
                            <td class="text-size-8">{{ index + 1 }}</td>
                            <td
                              class="text-size-8"
                              :class="styleDescription(item)"
                            >
                              {{ item.status_detail_ticket.description }}
                            </td>
                            <td class="text-size-8">
                              {{ item.comment }}
                            </td>
                            <td class="text-size-8">
                              {{ item.created_at | formatDate }}
                            </td>
                            <td class="text-size-8">
                              {{ item.user_created.name }}
                            </td>
                            <td class="text-size-8">
                              <v-btn
                                icon
                                @click="handleRemoveDetailTicket(item)"
                              >
                                <v-icon>mdi-delete</v-icon></v-btn
                              >
                            </td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-col>
                </template>
              </sigaf-container-card>
              <sigaf-container-card v-else title="Intentos de contacto">
                <template v-slot:content>
                  <v-col cols="12">
                    <span class="subtitle-1"
                      >No existen intentos de contacto registrados</span
                    >
                  </v-col>
                </template>
              </sigaf-container-card>
            </v-col>
          </v-row>
        </v-card>
        <v-row class="justify-end">
          <v-col cols="2" class="d-flex">
            <v-btn
              class="ml-auto"
              color="blueS"
              depressed
              dark
              @click="handleEditTicket"
            >
              Guardar
              <v-icon class="ml-3">mdi-arrow-right-bold-circle</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <confirm-dialog
      icon="mdi-alert-circle"
      color-icon="warning"
      :dialog="dialogConfirm"
      :cancel="close"
      :accept="confirmDelete"
    >
      <template v-slot:content>
        <h3 class="text-body-1">
          Eliminará un registro de forma permanente
        </h3>
      </template>
    </confirm-dialog>
  </v-dialog>
</template>

<script>
import { mapUser, Snackbar } from '../../utils/constants'
import { mapActions, mapGetters } from 'vuex'
import SAutocompleteMotiveTicket from '../ticket/SAutocompleteMotiveTicket.vue'
import SAutocompleteOperatorTicket from '../ticket/SAutocompleteOperatorTicket.vue'
import SAutocompletePriorityTicket from '../ticket/SAutocompletePriorityTicket.vue'
import SAutocompleteSourceTicket from '../ticket/SAutocompleteSourceTicket.vue'
import SAutocompleteTypeTicket from '../ticket/SAutocompleteTypeTicket.vue'
import SEditUserForm from '../utility/SEditUserForm.vue'
import SigafCardDataStudent from '../utility/SigafCardDataStudent.vue'
import SigafContainerCard from '../utility/SigafContainerCard.vue'
import SAutocompleteStatusTicket from '../ticket/SAutocompleteStatusTicket.vue'
import ConfirmDialog from '../component/ConfirmCard'

export default {
  props: {
    value: Boolean,
    selectedCourse: Object,
    ticket: Object
  },
  components: {
    SigafContainerCard,
    SigafCardDataStudent,
    SEditUserForm,
    SAutocompleteSourceTicket,
    SAutocompleteTypeTicket,
    SAutocompleteOperatorTicket,
    SAutocompleteMotiveTicket,
    SAutocompletePriorityTicket,
    SAutocompleteStatusTicket,
    ConfirmDialog
  },
  data: () => ({
    editedTicketItem: {
      id: null,
      source: null,
      type: null,
      motive: null,
      priority: null,
      operator: null,
      status: null,
      courseRegisteredUser: null
    },
    editedDetailTicket: {
      id: null
    },
    defaultTicketItem: {
      id: null,
      source: null,
      type: null,
      motive: null,
      priority: null,
      operator: null,
      status: null,
      courseRegisteredUser: null
    },
    defaultDetailTicket: {
      id: null
    },
    defaultDetailTicketIndex: -1,
    editUserForm: false,
    menu: false,
    user: {},
    dialogConfirm: false,
    code: '',
    ticketDetails: []
  }),
  created() {
    this.fetchSections()
  },
  watch: {
    ticket() {
      console.log(this.ticket)
      this.parseTicket()
    }
  },
  filters: {
    formatDate(date) {
      return new Date(date).toLocaleString('es-ES', {
        timeZone: 'America/Santiago'
      })
    }
  },
  computed: {
    ...mapGetters({
      sections: 'section/sections',
      loggedUser: 'auth/user',
      logEditingTicket: 'logEditingTicket/logEditingTicket'
    })
  },
  methods: {
    ...mapActions({
      deleteLogEditingTicket: 'logEditingTicket/deleteLogEditingTicket',
      fetchSections: 'section/fetchSections',
      removeItem: 'detailTicket/deleteDetailTicket',
      putTicket: 'ticket/putTicket'
    }),
    async confirmDelete() {
      const { success } = await this.removeItem(this.editedDetailTicket)

      if (success) {
        this.responseSuccessMessage()
        this.ticketDetails.splice(this.defaultDetailTicketIndex, 1)
      } else {
        this.resposeErrorMessage()
      }
      this.closeConfirmDelete()
    },
    closeConfirmDelete() {
      this.dialogConfirm = false
      setTimeout(() => {
        this.clear()
      }, 300)
    },
    close() {
      this.dialogConfirm = false
      setTimeout(() => {
        this.clear()
      }, 300)
    },
    leave() {
      this.dialogConfirm = false
      setTimeout(() => {
        this.clear()
      }, 300)
    },
    clear() {
      // this.editedTicketItem = Object.assign({}, this.defaultTicketItem)
      this.editedDetailTicket = Object.assign({}, this.defaultDetailTicket)

      this.defaultDetailTicketIndex = -1
    },
    handleRemoveDetailTicket(item) {
      this.editedDetailTicket = { ...this.editedDetailTicket, ...item }
      this.defaultDetailTicketIndex = this.ticketDetails.indexOf(item)
      this.dialogConfirm = true
    },
    styleDescription(item) {
      if (item.status_detail_ticket.description === 'Fallido')
        return 'redS--text'
      return 'success--text'
    },
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
    getDay(date) {
      const daysOfWeek = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do']
      let i = new Date(date).getDay(date)
      return daysOfWeek[i]
    },
    clearTicket() {
      //this.deleteLogEditingTicket(this.logEditingTicket)
      this.$emit('closeModal', false)
    },
    makeSnakResponse(message, type) {
      this.snackbar = true
      this.type = type
      this.message = message
      this.loadingSave = false
    },
    responseSuccessMessage() {
      this.makeSnakResponse(Snackbar.SUCCESS.message, Snackbar.SUCCESS.type)
    },
    resposeErrorMessage() {
      this.makeSnakResponse(Snackbar.ERROR.message, Snackbar.ERROR.type)
    },
    async handleEditTicket() {
      let dataStoreTicket = {
        ticket_id: this.editedTicketItem.id,
        course_registered_user_id: this.editedTicketItem.courseRegisteredUser
          .id,
        type_ticket_id: this.editedTicketItem.type.id,
        source_ticket_id: this.editedTicketItem.source.id,
        status_ticket_id: this.editedTicketItem.status.id,
        priority_ticket_id: this.editedTicketItem.priority.id,
        motive_ticket_id: this.editedTicketItem.motive.id,
        user_assigned_id: this.editedTicketItem.operator.id,
        user_create_id: this.editedTicketItem.userCreated.id
      }

      if (this.editedTicketItem.status.description === 'Cerrado') {
        const clossingDate = { closing_date: true }

        dataStoreTicket = { ...dataStoreTicket, ...clossingDate }
      }

      const { _data } = await this.putTicket(dataStoreTicket)

      this.$emit('updateTicket', _data)
    },
    async parseTicket() {
      try {
        if (this.ticket?.properties) {
          const editedTicket = this.ticket.properties
          this.editedTicketItem.id = editedTicket.id
          this.editedTicketItem.source = editedTicket.sourceTicket
          this.editedTicketItem.type = editedTicket.typeTicket
          this.editedTicketItem.motive = editedTicket.motiveTicket
          this.editedTicketItem.priority = editedTicket.priorityTicket
          this.editedTicketItem.operator = editedTicket.userAssigned
          this.editedTicketItem.status = editedTicket.statusTicket
          this.editedTicketItem.userCreated = editedTicket.userCreated
          this.editedTicketItem.courseRegisteredUser =
            editedTicket.courseRegisteredUser
          this.editedTicketItem.createdAt = editedTicket.createdAt
          this.code = this.ticket?.properties.ticketCode
          this.ticketDetails = this.ticket.relationships.array

          const userTicket = { ...editedTicket.courseRegisteredUser }

          this.user = Object.assign({}, mapUser(userTicket, this.sections))

          this.user
        }
      } catch (error) {
        this.clearTicket()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.text-size-8 {
  font-size: 12px !important;
}
</style>
