<template>
  <div>
    <base-card
      color="blueS"
      class="px-5 py-3"
      icon="mdi-message-text-lock-outline"
      title="Ticket bloqueados"
    >
      <sigaf-skeleton-loader
        v-if="loading"
        :transition="transition"
        :loading="loading"
      ></sigaf-skeleton-loader>
      <v-data-table
        v-else
        :headers="headers"
        :items="items"
        sort-by="id"
        class="elevation-1"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon small @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:no-data>
          <span class="subtitle">No existen ticket bloqueados</span>
        </template>
      </v-data-table>
    </base-card>
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
      :accept="confirmDelete"
    >
      <template v-slot:content>
        <h3 class="text-body-1">
          Eliminará un registro de forma permanente
        </h3>
      </template>
    </confirm-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import SigafSnackbar from '../../components/component/Snackbar'
import { Snackbar } from '../../utils/constants'
import ConfirmDialog from '../../components/component/ConfirmCard'
import SigafSkeletonLoader from '../../components/maintenance/SigafSkeletonLoader.vue'
import LogEditingTicket from '../../models/LogEditingTicket'

export default {
  components: {
    SigafSnackbar,
    ConfirmDialog,
    SigafSkeletonLoader
  },
  data: () => ({
    dialog: false,
    dialogConfirm: false,
    buttonName: 'Crear prioridad ticket',
    headers: [
      {
        text: '#',
        value: 'id'
      },
      {
        text: 'Código',
        value: 'ticket.ticket_code'
      },
      {
        text: 'Operador',
        value: 'user.name'
      },
      {
        text: 'Fecha bloqueo',
        value: 'createdAt'
      },
      {
        text: 'Acciones',
        value: 'actions',
        sortable: false
      }
    ],
    editedIndex: -1,
    editedItem: new LogEditingTicket(),
    defaultItem: new LogEditingTicket(),
    message: '',
    snackbar: false,
    type: '',
    loading: false,
    transition: 'scale-transition',
    loadingSave: false,
    snakResponse: null,
    search: ''
  }),
  computed: {
    ...mapGetters({ items: 'logEditingTicket/logEditingTickets' })
  },
  async created() {
    this.loading = true
    if (this.items.length === 0) {
      const { success } = await this.fetchItems()
      this.loading = !success
    } else {
      this.loading = false
    }
  },
  methods: {
    ...mapActions({
      fetchItems: 'logEditingTicket/fetchLogEditingTickets',
      removeItem: 'logEditingTicket/deleteLogEditingTicket'
    }),
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
      this.editedIndex = this.items.indexOf(item)

      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem(item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogConfirm = true
    },
    async confirmDelete() {
      const { success } = await this.removeItem(this.editedItem)

      if (success) {
        this.responseSuccessMessage()
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
      this.dialog = false
      this.dialogConfirm = false
      setTimeout(() => {
        this.clear()
      }, 300)
    },
    clear() {
      this.editedItem = Object.assign({}, this.defaultItem)
      this.editedIndex = -1
    }
  }
}
</script>
