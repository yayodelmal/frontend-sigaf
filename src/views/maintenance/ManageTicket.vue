<template>
  <div>
    <base-card
      color="blueS"
      class="px-5 py-3"
      icon="mdi-message-cog-outline"
      title="Administración ticket"
    >
      <v-card>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="4">
              <div class="d-flex">
                <v-text-field
                  v-model="searchByCode"
                  color="blueS"
                  clearable
                  prepend-inner-icon="mdi-magnify"
                  label="Código de ticket"
                  outlined
                  dense
                ></v-text-field>
                <v-btn
                  class="ml-2"
                  @click="handleFindByCode"
                  color="blueS"
                  dark
                  :loading="loadingCode"
                >
                  <v-icon>mdi-magnify</v-icon></v-btn
                >
              </div>
            </v-col>
            <v-col cols="12" sm="4">
              <div class="d-flex">
                <v-dialog
                  ref="dialog"
                  v-model="modal"
                  :return-value.sync="dates"
                  persistent
                  width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="dateRangeText"
                      label="Rango de fechas"
                      prepend-inner-icon="mdi-calendar"
                      color="blueS"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      outlined
                      dense
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="dates" range>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="modal = false">
                      Cancelar
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.dialog.save(dates)"
                    >
                      Aceptar
                    </v-btn>
                  </v-date-picker>
                </v-dialog>
                <v-btn
                  class="ml-2"
                  color="blueS"
                  dark
                  @click="handleFindByRangeOfDates"
                  :loading="loadingDates"
                >
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>
              </div>
            </v-col>
            <v-col cols="12" sm="4">
              <div class="d-flex">
                <s-autocomplete-operator-ticket v-model="operator" />
                <v-btn
                  class="ml-2"
                  @click="handleFindByOperator"
                  color="blueS"
                  dark
                  :loading="loadingOperator"
                >
                  <v-icon>mdi-magnify</v-icon></v-btn
                >
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <sigaf-skeleton-loader
        v-if="loading"
        :transition="transition"
        :loading="loading"
      ></sigaf-skeleton-loader>
      <v-data-table
        v-else
        item-key="properties.id"
        v-model="selected"
        :search="search"
        :headers="headers"
        :items="manageTickets.collections"
        :items-per-page="10"
        class="elevation-1"
        loading-text="Cargando... por favor espere"
        show-select
      >
        <template v-slot:progress>
          <v-progress-linear
            color="blueS"
            :height="3"
            indeterminate
          ></v-progress-linear>
        </template>
        <template v-slot:top>
          <v-toolbar tile dark color="blueS darken-1" class="mb-1">
            <v-row>
              <v-col cols="6">
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
              </v-col>
              <v-spacer />
              <v-col cols="2" class="d-flex">
                <v-btn
                  class="ml-auto"
                  large
                  color="blueS"
                  v-if="selected.length > 0"
                  @click="deleteItem"
                  >Eliminar</v-btn
                >
              </v-col>
            </v-row>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-tooltip color="blueS" bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon text v-on="on">
                <v-icon @click.prevent="editItem(item)">
                  mdi-pencil
                </v-icon>
              </v-btn>
            </template>
            <span>Editar</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </base-card>
    <edit-ticket
      v-if="showModalEditTicket"
      v-model="modalEditTicket"
      :ticket="editedTicketItem"
      @closeModal="closeEditModal"
      @updateTicket="handleUpdateTicket"
    />

    <sigaf-snackbar
      v-model="snackbar"
      :type="type"
      :message="message"
    ></sigaf-snackbar>
    <confirm-dialog
      icon="mdi-alert-circle"
      color-icon="warning"
      :dialog="dialogConfirm"
      :cancel="close"
      :accept="confirmDeleteTicket"
    >
      <template v-slot:content>
        <h3 class="text-body-1">
          Se eliminarán registros de forma permanente
        </h3>
      </template>
    </confirm-dialog>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import { mapActions, mapGetters } from 'vuex'
import SigafSnackbar from '../../components/component/Snackbar'
import { Snackbar } from '../../utils/constants'
import ConfirmDialog from '../../components/component/ConfirmCard'
import SigafSkeletonLoader from '../../components/maintenance/SigafSkeletonLoader.vue'
import SAutocompleteOperatorTicket from '../../components/ticket/SAutocompleteOperatorTicket.vue'
import EditTicket from '../../components/manageTicket/EditTicket.vue'
import Ticket from '../../models/Ticket'

const HEADER_CLASS = 'font-weight-bold redS--text'
export default {
  inject: ['theme'],
  mixins: [validationMixin],
  components: {
    SigafSnackbar,
    ConfirmDialog,
    SigafSkeletonLoader,
    SAutocompleteOperatorTicket,
    EditTicket
  },
  validations: {
    description: {
      required,
      minLength: minLength(7),
      maxLength: maxLength(25)
    }
  },
  data: () => ({
    dialog: false,
    dialogConfirm: false,
    headers: [
      {
        text: 'Código',
        value: 'properties.ticketCode',
        class: HEADER_CLASS
      },
      {
        text: 'Fecha creación',
        value: 'properties.createdAt',
        class: HEADER_CLASS
      },
      {
        text: 'Operador',
        value: 'properties.userAssigned.name',
        class: HEADER_CLASS
      },
      {
        text: 'Estado',
        value: 'properties.statusTicket.description',
        class: HEADER_CLASS
      },
      {
        text: 'Tipo',
        value: 'properties.typeTicket.description',
        class: HEADER_CLASS
      },
      {
        text: 'Motivo',
        value: 'properties.motiveTicket.description',
        class: HEADER_CLASS
      },
      {
        text: 'Acciones',
        value: 'actions',
        sortable: false,
        class: HEADER_CLASS
      }
    ],
    editedIndex: -1,
    editedItem: new Ticket(),
    defaultItem: new Ticket(),
    message: '',
    snackbar: false,
    type: '',
    loading: false,
    transition: 'scale-transition',
    loadingSave: false,
    snakResponse: null,
    search: '',
    searchByCode: '',
    dates: [],
    transformDates: [],
    menu: false,
    modal: false,
    operator: null,
    loadingCode: false,
    loadingDates: false,
    loadingOperator: false,
    modalEditTicket: false,
    editedTicketIndex: -1,
    editedTicketItem: {},
    defaultTicketItem: {},
    showModalEditTicket: false,
    selected: []
  }),
  computed: {
    ...mapGetters({
      manageTickets: 'ticket/getManageTicket'
    }),
    dateRangeText() {
      let array = [...this.dates]

      array.map(date => {
        const split = date.split('-')
        return `${split[2]}-${split[1]}-${split[0]}`
      })

      return array.join(' a ')
    },
    descriptionErrors() {
      const errors = []

      if (!this.$v.description.$dirty) return errors
      !this.$v.description.required && errors.push('Es obligatorio.')
      !this.$v.description.minLength &&
        errors.push('Debe contener al menos 7 caracteres.')
      !this.$v.description.maxLength &&
        errors.push('Debe contener máximo 25 caracteres.')
      return errors
    },
    formTitle() {
      return this.editedIndex === -1
        ? 'Crear motivo ticket'
        : 'Editar motivo ticket'
    },
    description() {
      return this.editedItem.description
    }
  },

  methods: {
    ...mapActions({
      fetchItems: 'motiveTicket/fetchMotiveTickets',
      fetchTickets: 'motiveTicket/fetchTickets',
      fetchManageTicketByCode: 'ticket/findTicketByCode',
      fetchManageTicketsByRangeOfDates: 'ticket/findTicketByRangeOfDates',
      fetchManageTicketByOperator: 'ticket/findTicketByOperator',
      removeTickets: 'ticket/deleteMultipleTicket'
    }),
    async handleFindByCode() {
      this.loading = true
      this.loadingCode = true
      await this.fetchManageTicketByCode(this.searchByCode)
      this.loadingCode = false
      this.loading = false
    },
    async handleFindByRangeOfDates() {
      this.loadingDates = true
      this.loading = true
      await this.fetchManageTicketsByRangeOfDates(this.dates)
      this.loadingDates = false
      this.loading = false
    },
    async handleFindByOperator() {
      this.loadingOperator = true
      this.loading = true
      await this.fetchManageTicketByOperator(this.operator.id)
      this.loadingOperator = false
      this.loading = false
    },
    createItem() {
      this.dialog = true
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
    editItem(item) {
      this.showModalEditTicket = true
      this.editedIndex = this.manageTickets.collections.indexOf(item)

      setTimeout(() => {
        this.editedTicketItem = Object.assign({}, item)
        this.modalEditTicket = true
      }, 200)
    },
    deleteItem() {
      this.dialogConfirm = true
      /*      this.editedTicketIndex = this.manageTickets.collections.indexOf(item)
      setTimeout(() => {
        this.editedTicketItem = Object.assign({}, item)
      }, 200) */
    },
    async confirmDeleteTicket() {
      const ticketIds = this.selected.map(ticket => {
        return ticket.properties.id
      })
      const { success } = await this.removeTickets(ticketIds)

      if (success) {
        this.selected.forEach(ticket => {
          this.editedTicketIndex = this.manageTickets.collections.indexOf(
            ticket
          )
          this.manageTickets.collections.splice(this.editedTicketIndex, 1)
        })
        this.selected = []
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
    handleUpdateTicket(ticket) {
      Object.assign(this.manageTickets.collections[this.editedIndex], ticket)
      this.closeEditModal()
    },
    closeEditModal() {
      this.modalEditTicket = false
      this.showModalEditTicket = false
      this.clear()
    },
    close() {
      this.dialog = false
      this.dialogConfirm = false
      setTimeout(() => {
        this.clear()
      }, 300)
    },
    clear() {
      this.editedTicketItem = Object.assign({}, this.defaultTicketItem)
      this.editedTicketIndex = -1
    }
  }
}
</script>
