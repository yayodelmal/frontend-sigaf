<template>
  <div>
    <base-card
      color="blueS"
      class="px-5 py-3"
      icon="mdi-hammer-wrench"
      title="Estado de ticket"
    >
      <div v-if="loading">
        <v-skeleton-loader
          :loading="loading"
          :transition="transition"
          class="mx-auto"
          type="table-heading"
        ></v-skeleton-loader>
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
      <v-data-table
        :search="search"
        v-else
        :headers="headers"
        :items="items"
        :items-per-page="5"
        class="elevation-1"
        :loading="loading"
        loading-text="Cargando... por favor espere"
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
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px" persistent>
              <template v-slot:activator="{ on }">
                <v-btn depressed large color="blueS" v-on="on">
                  <v-icon class="mr-2" size="25">mdi-plus</v-icon>
                  Crear Estado Ticket
                </v-btn>
              </template>
              <v-form>
                <v-card :loading="loadingSave">
                  <template v-slot:progress>
                    <v-progress-linear
                      color="blueS"
                      indeterminate
                    ></v-progress-linear>
                  </template>
                  <v-toolbar dark color="blueS darken-1">
                    <v-toolbar-title>
                      {{ formTitle }}
                    </v-toolbar-title>
                  </v-toolbar>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12">
                        <base-textfield
                          v-model="editedItem.description"
                          label="Nombre"
                          @input="$v.description.$touch()"
                          @blur="$v.description.$touch()"
                          :error-messages="descriptionErrors"
                        ></base-textfield>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="close()">
                      CANCELAR
                    </v-btn>
                    <v-btn
                      :loading="loading"
                      color="blueS"
                      dark
                      depressed
                      @click="save()"
                    >
                      ACEPTAR
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-form>
            </v-dialog>
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
          <v-tooltip color="blueS" bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon text v-on="on">
                <v-icon @click.prevent="deleteItem(item)">
                  mdi-delete
                </v-icon>
              </v-btn>
            </template>
            <span>Eliminar</span>
          </v-tooltip>
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
import StatusTicket from '../../models/StatusTicket'
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import { mapActions, mapGetters } from 'vuex'
import SigafSnackbar from '../../components/component/Snackbar'
import { Snackbar } from '../../utils/constants'
import ConfirmDialog from '../../components/component/ConfirmCard'

export default {
  inject: ['theme'],
  mixins: [validationMixin],
  components: {
    SigafSnackbar,
    ConfirmDialog
  },
  validations: {
    description: {
      required,
      minLength: minLength(5),
      maxLength: maxLength(25)
    }
  },
  data: () => ({
    dialog: false,
    dialogConfirm: false,
    headers: [
      {
        text: '#',
        value: 'id',
        class: ['redS--text', 'text-subtitle-2', 'font-weight-bold']
      },
      {
        text: 'Nombre',
        value: 'description',
        class: ['redS--text', 'text-subtitle-2', 'font-weight-bold']
      },
      {
        text: 'Acciones',
        value: 'actions',
        class: ['redS--text', 'text-subtitle-2', 'font-weight-bold'],
        sortable: false
      }
    ],
    editedIndex: -1,
    editedItem: new StatusTicket(),
    defaultItem: new StatusTicket(),
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
    ...mapGetters({ items: 'statusTicket/statusTickets' }),
    descriptionErrors() {
      const errors = []

      if (!this.$v.description.$dirty) return errors
      !this.$v.description.required && errors.push('Es obligatorio.')
      !this.$v.description.minLength &&
        errors.push('Debe contener al menos 5 caracteres.')
      !this.$v.description.maxLength &&
        errors.push('Debe contener máximo 25 caracteres.')
      return errors
    },
    formTitle() {
      return this.editedIndex === -1
        ? 'Crear estado ticket'
        : 'Editar estado ticket'
    },
    description() {
      return this.editedItem.description
    }
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
      fetchItems: 'statusTicket/fetchStatusTickets',
      postItem: 'statusTicket/postStatusTicket',
      putItem: 'statusTicket/putStatusTicket',
      removeItem: 'statusTicket/deleteStatusTicket',
      fetchTickets: 'statusTicket/fetchTickets'
    }),
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
    async save() {
      this.$v.$touch()
      if (!this.$v.$error) {
        this.loadingSave = true
        if (this.editedIndex > -1) {
          const { success } = await this.putItem(this.editedItem)
          if (success) {
            this.responseSuccessMessage()
          } else {
            this.resposeErrorMessage()
          }
        } else {
          const { success } = await this.postItem(this.editedItem)
          if (success) {
            this.responseSuccessMessage()
          } else {
            this.resposeErrorMessage()
          }
        }
        this.close()
      }
    },
    close() {
      this.dialog = false
      this.dialogConfirm = false
      setTimeout(() => {
        this.clear()
      }, 300)
    },
    clear() {
      this.$v.$reset()
      this.editedItem = Object.assign({}, this.defaultItem)
      this.editedIndex = -1
    }
  }
}
</script>
